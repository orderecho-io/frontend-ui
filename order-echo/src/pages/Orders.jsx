import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Order } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ShoppingBag, DollarSign, User, Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { format, subDays, subYears } from 'date-fns';

export default function OrdersPage() {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quickFilter, setQuickFilter] = useState('all');
  const [dateRange, setDateRange] = useState(undefined);

  useEffect(() => {
    console.log('Orders page mounted, loading data...', location.pathname);
    loadOrders();
  }, [location.pathname]);

  const loadOrders = async () => {
    console.log('Orders page - loadOrders called');
    setIsLoading(true);
    try {
      const ordersResponse = await Order.list('-created_date');
      console.log('Orders page - API response:', ordersResponse);
      setOrders(ordersResponse.data || []);
      console.log('Orders page - data set successfully');
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
      console.log('Orders page - loading completed');
    }
  };

  const handleQuickFilterChange = (value) => {
    setQuickFilter(value);
    setDateRange(undefined); // Clear date range when using quick filter
  };

  const getFilteredOrders = () => {
    if (dateRange && dateRange.from && dateRange.to) {
      const from = dateRange.from.setHours(0,0,0,0);
      const to = dateRange.to.setHours(23,59,59,999);
      return orders.filter(order => {
        const orderDate = new Date(order.created_date);
        return orderDate >= from && orderDate <= to;
      });
    }

    if (quickFilter === 'all') return orders;

    const now = new Date();
    let startDate;

    switch (quickFilter) {
      case 'today': startDate = subDays(now, 0); startDate.setHours(0,0,0,0); break;
      case 'week': startDate = subDays(now, 7); break;
      case 'month': startDate = subDays(now, 30); break;
      case 'year': startDate = subYears(now, 1); break;
      default: return orders;
    }

    return orders.filter(order => new Date(order.created_date) >= startDate);
  };

  const filteredOrders = getFilteredOrders();
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

  if (isLoading) {
    return <div className="p-8"><Loader2 className="animate-spin w-8 h-8" /></div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Track and manage all customer orders</p>
        </div>
        <div className="flex gap-2">
          <Select value={quickFilter} onValueChange={handleQuickFilterChange}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? 
                  (dateRange.to ? `${format(dateRange.from, "LLL dd")} - ${format(dateRange.to, "LLL dd, y")}` : format(dateRange.from, "PPP")) : 
                  "Select Date Range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Total Orders</p><p className="text-3xl font-bold text-gray-900">{filteredOrders.length}</p></div><ShoppingBag className="w-8 h-8 text-orange-500" /></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Total Revenue</p><p className="text-3xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p></div><DollarSign className="w-8 h-8 text-green-500" /></div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Average Order</p><p className="text-3xl font-bold text-gray-900">${filteredOrders.length > 0 ? (totalRevenue / filteredOrders.length).toFixed(2) : '0.00'}</p></div><CalendarIcon className="w-8 h-8 text-blue-500" /></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Order List</CardTitle></CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12"><ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" /><h3 className="text-xl font-medium text-gray-800 mb-2">No orders found</h3><p className="text-gray-500">No orders match the current filter criteria.</p></div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1"><div className="flex items-center gap-3 mb-3"><Badge variant="outline" className="bg-green-50 text-green-700">Order #{order.id.slice(-8)}</Badge><span className="text-sm text-gray-500">{format(new Date(order.created_date), 'MMM dd, yyyy - h:mm a')}</span></div><div className="flex items-center gap-4 mb-3"><div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /><span className="font-medium">{order.customer_name || 'Anonymous'}</span></div>{order.customer_phone && (<span className="text-gray-500">{order.customer_phone}</span>)}</div>{order.items && order.items.length > 0 && (<div className="space-y-2"><h4 className="font-medium text-gray-700 text-sm">Items:</h4><div className="grid gap-2">{order.items.map((item, index) => (<div key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded-md text-sm"><div className="flex items-center gap-2"><span className="font-medium">{item.name}</span><Badge variant="secondary">x{item.quantity}</Badge></div><span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span></div>))}</div></div>)}</div>
                    <div className="text-right ml-4"><div className="text-2xl font-bold text-gray-900">${order.total_amount?.toFixed(2) || '0.00'}</div></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

