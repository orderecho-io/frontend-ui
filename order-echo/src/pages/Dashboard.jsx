import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Call } from '@/api/entities';
import { Order } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { 
  Phone, 
  PhoneCall, 
  PhoneMissed, 
  Voicemail, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Eye, 
  BarChart3, 
  Calendar as CalendarIcon,
  ChevronDown
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DetailedAnalytics from '../components/analytics/DetailedAnalytics';

export default function Dashboard() {
  const location = useLocation();
  const [calls, setCalls] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('week');
  const [dateRange, setDateRange] = useState(undefined);
  const [showDetailedAnalytics, setShowDetailedAnalytics] = useState(false);

  useEffect(() => {
    console.log('Dashboard component mounted, loading data...', location.pathname);
    loadData();
  }, [location.pathname]);

  // Add effect to reload data when component becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Dashboard became visible, reloading data...');
        loadData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const loadData = async () => {
    console.log('loadData function called');
    setIsLoading(true);
    try {
      console.log('Making API calls...');
      const [callsResponse, ordersResponse] = await Promise.all([
        Call.list('-created_date'),
        Order.list('-created_date')
      ]);
      console.log('API responses:', { callsResponse, ordersResponse });
      setCalls(callsResponse.data || []);
      setOrders(ordersResponse.data || []);
      console.log('Data set successfully');
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
      console.log('Loading completed');
    }
  };

  const getFilteredData = (data) => {
    if (dateRange?.from && dateRange?.to) {
      const from = new Date(dateRange.from);
      from.setHours(0, 0, 0, 0);
      const to = new Date(dateRange.to);
      to.setHours(23, 59, 59, 999);
      return data.filter(item => {
        const itemDate = new Date(item.created_date);
        return itemDate >= from && itemDate <= to;
      });
    }

    if (timeFilter === 'all') return data;
    
    const now = new Date();
    let startDate;
    
    switch (timeFilter) {
      case 'today': 
        startDate = subDays(now, 0); 
        startDate.setHours(0,0,0,0);
        break;
      case 'week': 
        startDate = subDays(now, 7); 
        startDate.setHours(0,0,0,0);
        break;
      case 'month': 
        startDate = subDays(now, 30); 
        startDate.setHours(0,0,0,0);
        break;
      case 'custom':
      default: 
        return data;
    }
    
    return data.filter(item => new Date(item.created_date) >= startDate);
  };

  const handleTimeFilterChange = (value) => {
    setTimeFilter(value);
    setDateRange(undefined);
  };

  const handleDateRangeSelect = (range) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      setTimeFilter('custom');
    } else if (!range?.from && !range?.to) {
      setTimeFilter('week');
    }
  }
  
  const filteredCalls = getFilteredData(calls);
  const filteredOrders = getFilteredData(orders);

  const callStats = {
    total: filteredCalls.length,
    answered: filteredCalls.filter(c => c.status === 'answered').length,
    missed: filteredCalls.filter(c => c.status === 'missed').length,
    voicemail: filteredCalls.filter(c => c.status === 'voicemail').length,
  };

  const orderStats = {
    total: filteredOrders.length,
    revenue: filteredOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0),
    avgOrder: filteredOrders.length > 0 ? 
      filteredOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0) / filteredOrders.length : 0
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'answered': return <PhoneCall className="w-4 h-4 text-green-500" />;
      case 'missed': return <PhoneMissed className="w-4 h-4 text-red-500" />;
      case 'voicemail': return <Voicemail className="w-4 h-4 text-blue-500" />;
      default: return <Phone className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      answered: 'bg-green-100 text-green-800',
      missed: 'bg-red-100 text-red-800',
      voicemail: 'bg-blue-100 text-blue-800'
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  // Generate chart data for last 14 days
  const generateChartData = () => {
    const endDate = new Date();
    const startDate = subDays(endDate, 13);
    const data = [];
    
    for (let i = 0; i < 14; i++) {
      const date = subDays(endDate, 13 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayCalls = calls.filter(call => format(new Date(call.created_date), 'yyyy-MM-dd') === dateStr);
      
      const answered = dayCalls.filter(c => c.status === 'answered').length;
      const missed = dayCalls.filter(c => c.status === 'missed').length;
      const voicemail = dayCalls.filter(c => c.status === 'voicemail').length;
      
      data.push({
        date: format(date, 'MM/dd'),
        answered,
        missed,
        voicemail,
        total: answered + missed + voicemail
      });
    }
    
    return data;
  };

  const chartData = generateChartData();

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  console.log('Dashboard render - isLoading:', isLoading, 'calls:', calls.length, 'orders:', orders.length);

  return (
    <div className="p-8 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your restaurant's call and order activity</p>
        </div>
        <div className="flex gap-3">
          <Select value={timeFilter} onValueChange={handleTimeFilterChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select a period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="custom" disabled>Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-[280px] justify-start text-left font-normal ${
                  !dateRange?.from ? "text-muted-foreground" : ""
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleDateRangeSelect}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          
          <Button 
            onClick={() => setShowDetailedAnalytics(true)}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Detailed Analytics
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Calls</p>
                <p className="text-3xl font-bold text-gray-900">{callStats.total}</p>
              </div>
              <Phone className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Answered</p>
                <p className="text-3xl font-bold text-green-600">{callStats.answered}</p>
                <p className="text-xs text-gray-500">
                  {callStats.total > 0 ? Math.round((callStats.answered / callStats.total) * 100) : 0}% success rate
                </p>
              </div>
              <PhoneCall className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-green-600">${orderStats.revenue.toFixed(2)}</p>
                <p className="text-xs text-gray-500">{orderStats.total} orders</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Order</p>
                <p className="text-3xl font-bold text-blue-600">${orderStats.avgOrder.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Call Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-orange-500" />
            Daily Call Activity (Last 14 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="answered" stackId="a" fill="#10B981" name="Answered" />
                <Bar dataKey="missed" stackId="a" fill="#EF4444" name="Missed" />
                <Bar dataKey="voicemail" stackId="a" fill="#3B82F6" name="Voicemail" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Call Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent Call Activity
            <Badge variant="outline">{filteredCalls.length} calls</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCalls.length === 0 ? (
            <div className="text-center py-12">
              <Phone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-800 mb-2">No calls yet</h3>
              <p className="text-gray-500">Call activity will appear here once customers start calling.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredCalls.slice(0, 10).map((call) => (
                <div key={call.id} className="flex items-center justify-between p-4 rounded-lg border bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(call.status)}
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-900">
                          {call.from_number || 'Unknown Number'}
                        </span>
                        <Badge className={getStatusBadge(call.status)}>
                          {call.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(call.created_date), 'MMM dd, yyyy - h:mm a')}
                        {call.duration_seconds && (
                          <span>• {Math.floor(call.duration_seconds / 60)}m {call.duration_seconds % 60}s</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {call.transcript && (
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Analytics Modal */}
      {showDetailedAnalytics && (
        <DetailedAnalytics 
          calls={calls} 
          orders={orders} 
          onClose={() => setShowDetailedAnalytics(false)} 
        />
      )}
    </div>
  );
}