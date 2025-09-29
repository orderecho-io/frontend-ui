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
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    console.log('Orders page mounted, loading data...', location.pathname);
    loadOrders();
  }, [location.pathname]);

  const loadOrders = async () => {
    console.log('Orders page - loadOrders called');
    setIsLoading(true);
    
    // First, let's test if we can reach the backend at all
    try {
      console.log('Testing backend connectivity...');
      const healthResponse = await fetch('http://localhost:8000/');
      console.log('Backend health status:', healthResponse.status);
      console.log('Backend health ok:', healthResponse.ok);
      
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        console.log('Backend health data:', healthData);
        
        // Now test the orders API
        console.log('Testing orders API call...');
        const directResponse = await fetch('http://localhost:8000/api/orders/ACC000000000001');
        console.log('Direct API response status:', directResponse.status);
        console.log('Direct API response ok:', directResponse.ok);
        console.log('Direct API response headers:', Object.fromEntries(directResponse.headers.entries()));
        
        if (directResponse.ok) {
          const directData = await directResponse.json();
          console.log('Direct API data:', directData);
          console.log('Direct API orders count:', directData.orders?.length);
          console.log('Direct API success:', directData.success);
          console.log('Direct API total:', directData.total);
          
          // Set the data directly from the API call
          setOrders(directData.orders || []);
          setDebugInfo({
            response: directData,
            timestamp: new Date().toISOString(),
            dataLength: directData.orders?.length,
            firstOrder: directData.orders?.[0],
            method: 'direct_api_call',
            backendHealth: healthData
          });
          console.log('Orders page - data set from direct API call:', directData.orders?.length, 'orders');
          setIsLoading(false);
          return;
        } else {
          const errorText = await directResponse.text();
          console.error('Orders API error response:', errorText);
        }
      }
    } catch (directError) {
      console.error('Direct API call failed:', directError);
      console.error('Error details:', {
        message: directError.message,
        name: directError.name,
        stack: directError.stack
      });
    }
    
    // Fallback to original method
    try {
      const ordersResponse = await Order.list('-created_date');
      console.log('Orders page - FULL API response:', JSON.stringify(ordersResponse, null, 2));
      console.log('Orders page - Response success:', ordersResponse.success);
      console.log('Orders page - Response data type:', typeof ordersResponse.data);
      console.log('Orders page - Response data length:', ordersResponse.data?.length);
      console.log('Orders page - Response data:', ordersResponse.data);
      
      if (ordersResponse.success) {
        setOrders(ordersResponse.data || []);
        setDebugInfo({
          response: ordersResponse,
          timestamp: new Date().toISOString(),
          dataLength: ordersResponse.data?.length,
          firstOrder: ordersResponse.data?.[0],
          method: 'order_list_method'
        });
        console.log('Orders page - data set successfully:', ordersResponse.data?.length, 'orders');
        console.log('Orders page - First order:', ordersResponse.data?.[0]);
      } else {
        console.error('Orders page - API error:', ordersResponse.error);
        setOrders([]);
        setDebugInfo({
          error: ordersResponse.error,
          timestamp: new Date().toISOString(),
          method: 'order_list_method'
        });
        // You could show a toast notification here if needed
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
      setDebugInfo({
        error: error.message,
        timestamp: new Date().toISOString(),
        method: 'order_list_method'
      });
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
        const orderDate = new Date(order.created_at || order.created_date);
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

    return orders.filter(order => new Date(order.created_at || order.created_date) >= startDate);
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

      {/* Debug Panel */}
      {debugInfo && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">🐛 Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-yellow-800">Response Summary:</h4>
                <p className="text-sm text-yellow-700">
                  Data Length: {debugInfo.dataLength || 'N/A'} | 
                  Method: {debugInfo.method || 'unknown'} |
                  Timestamp: {debugInfo.timestamp} |
                  Success: {debugInfo.response?.success ? 'Yes' : 'No'}
                </p>
                {debugInfo.backendHealth && (
                  <p className="text-sm text-yellow-700">
                    Backend Health: {JSON.stringify(debugInfo.backendHealth)}
                  </p>
                )}
                {debugInfo.error && (
                  <p className="text-sm text-red-700">
                    Error: {debugInfo.error}
                  </p>
                )}
              </div>
              
              {debugInfo.firstOrder && (
                <div>
                  <h4 className="font-semibold text-yellow-800">First Order Sample:</h4>
                  <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-32">
                    {JSON.stringify(debugInfo.firstOrder, null, 2)}
                  </pre>
                </div>
              )}
              
              <div>
                <h4 className="font-semibold text-yellow-800">Full Response:</h4>
                <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-64">
                  {JSON.stringify(debugInfo.response, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
                    <div className="flex-1"><div className="flex items-center gap-3 mb-3"><Badge variant="outline" className="bg-green-50 text-green-700">Order #{order.id.slice(-8)}</Badge><span className="text-sm text-gray-500">{format(new Date(order.created_at || order.created_date), 'MMM dd, yyyy - h:mm a')}</span></div><div className="flex items-center gap-4 mb-3"><div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /><span className="font-medium">{order.customer_name || 'Anonymous'}</span></div>{order.customer_phone && (<span className="text-gray-500">{order.customer_phone}</span>)}</div>{order.order_details && order.order_details.items && order.order_details.items.length > 0 && (<div className="space-y-2"><h4 className="font-medium text-gray-700 text-sm">Items:</h4><div className="grid gap-2">{order.order_details.items.map((item, index) => (<div key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded-md text-sm"><div className="flex items-center gap-2"><span className="font-medium">{item.name}</span><Badge variant="secondary">x{item.quantity || 1}</Badge></div><span className="font-medium">${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span></div>))}</div></div>)}</div>
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

