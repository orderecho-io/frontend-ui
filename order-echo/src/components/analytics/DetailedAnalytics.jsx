import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { X, TrendingUp, PhoneCall, ShoppingCart, AlertCircle, Calendar as CalendarIcon } from 'lucide-react';
import { format, subDays, eachDayOfInterval } from 'date-fns';

const COLORS = ['#10B981', '#EF4444', '#3B82F6', '#F59E0B'];

export default function DetailedAnalytics({ calls, orders, onClose }) {
  const [timeRange, setTimeRange] = useState('30days');
  const [dateRange, setDateRange] = useState(undefined);
  const [chartData, setChartData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);

  const generateChartData = useCallback(() => {
    let startDate, endDate;

    if (dateRange?.from && dateRange?.to) {
      startDate = dateRange.from;
      endDate = dateRange.to;
    } else {
      const days = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
      endDate = new Date();
      startDate = subDays(endDate, days);
    }
    
    // Ensure both startDate and endDate are valid before proceeding
    if (!startDate || !endDate) return;

    const interval = eachDayOfInterval({ start: startDate, end: endDate });

    // Generate daily data
    const dailyData = interval.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayCalls = calls.filter(call => format(new Date(call.created_date), 'yyyy-MM-dd') === dateStr);
      const dayOrders = orders.filter(order => format(new Date(order.created_date), 'yyyy-MM-dd') === dateStr);
      
      const answered = dayCalls.filter(c => c.status === 'answered').length;
      const missed = dayCalls.filter(c => c.status === 'missed').length;
      const voicemail = dayCalls.filter(c => c.status === 'voicemail').length;
      const total = dayCalls.length;
      const ordersCount = dayOrders.length;
      const revenue = dayOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

      return {
        date: format(date, 'MMM dd'),
        fullDate: dateStr,
        totalCalls: total,
        answeredCalls: answered,
        missedCalls: missed,
        voicemailCalls: voicemail,
        orders: ordersCount,
        revenue: revenue,
        conversionRate: answered > 0 ? Math.round((ordersCount / answered) * 100) : 0,
        successRate: total > 0 ? Math.round((answered / total) * 100) : 0
      };
    });

    setChartData(dailyData);
    
    const filteredCalls = calls.filter(c => {
        const cDate = new Date(c.created_date);
        // Ensure comparison is only with date part if necessary, or full timestamp
        return cDate >= startDate && cDate <= endDate;
    });
    const filteredOrders = orders.filter(o => {
        const oDate = new Date(o.created_date);
        return oDate >= startDate && oDate <= endDate;
    });

    // Performance summary
    const totalCalls = filteredCalls.length;
    const totalAnswered = filteredCalls.filter(c => c.status === 'answered').length;
    const totalOrders = filteredOrders.length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

    const performanceMetrics = [
      { name: 'Calls Received', value: totalCalls },
      { name: 'Calls Answered', value: totalAnswered },
      { name: 'Orders Generated', value: totalOrders },
      { name: 'Revenue', value: `$${totalRevenue.toFixed(2)}` }
    ];
    setPerformanceData(performanceMetrics);

    // Status distribution for pie chart
    const statusData = [
      { name: 'Answered', value: filteredCalls.filter(c => c.status === 'answered').length, color: '#10B981' },
      { name: 'Missed', value: filteredCalls.filter(c => c.status === 'missed').length, color: '#EF4444' },
      { name: 'Voicemail', value: filteredCalls.filter(c => c.status === 'voicemail').length, color: '#3B82F6' }
    ];
    setStatusDistribution(statusData.filter(item => item.value > 0));
  }, [calls, orders, timeRange, dateRange]); // Dependencies for useCallback

  useEffect(() => {
    generateChartData();
  }, [generateChartData]); // generateChartData is now stable due to useCallback
  
  const handleTimeFilterChange = (value) => {
    setTimeRange(value);
    setDateRange(undefined);
  };

  const handleDateRangeSelect = (range) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      setTimeRange('custom'); // Corrected from setTimeFilter to setTimeRange
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Detailed Analytics</h2>
            <p className="text-gray-600">In-depth insights into your call performance and revenue</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={handleTimeFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="custom" disabled>Custom Range</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className="w-[280px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (dateRange.to ? <>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</> : format(dateRange.from, "LLL dd, y")) : <span>Pick a date range</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={handleDateRangeSelect} numberOfMonths={2} />
              </PopoverContent>
            </Popover>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="p-6 space-y-6">
            {/* Performance Cards */}
            <div className="grid grid-cols-4 gap-4">
              {performanceData.map((metric, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">{metric.name}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Call Activity Over Time */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PhoneCall className="w-5 h-5" />
                    Daily Call Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="answeredCalls" stackId="1" stroke="#10B981" fill="#10B981" name="Answered" />
                        <Area type="monotone" dataKey="missedCalls" stackId="1" stroke="#EF4444" fill="#EF4444" name="Missed" />
                        <Area type="monotone" dataKey="voicemailCalls" stackId="1" stroke="#3B82F6" fill="#3B82F6" name="Voicemail" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Orders & Revenue */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Orders & Revenue Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" orientation="left" stroke="#F59E0B" />
                        <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="orders" fill="#F59E0B" name="Orders" />
                        <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} name="Revenue ($)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Conversion Rates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 100]} unit="%" />
                        <Tooltip formatter={(value) => [`${value}%`, '']} />
                        <Legend />
                        <Line type="monotone" dataKey="successRate" stroke="#10B981" strokeWidth={2} name="Call Success Rate" />
                        <Line type="monotone" dataKey="conversionRate" stroke="#3B82F6" strokeWidth={2} name="Order Conversion Rate" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Call Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Call Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Table */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Date</th>
                        <th className="text-right p-2">Total Calls</th>
                        <th className="text-right p-2">Answered</th>
                        <th className="text-right p-2">Missed</th>
                        <th className="text-right p-2">Orders</th>
                        <th className="text-right p-2">Revenue</th>
                        <th className="text-right p-2">Success Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chartData.slice(-10).reverse().map((day, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-2">{day.date}</td>
                          <td className="text-right p-2">{day.totalCalls}</td>
                          <td className="text-right p-2 text-green-600">{day.answeredCalls}</td>
                          <td className="text-right p-2 text-red-600">{day.missedCalls}</td>
                          <td className="text-right p-2">{day.orders}</td>
                          <td className="text-right p-2">${day.revenue.toFixed(2)}</td>
                          <td className="text-right p-2">{day.successRate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

