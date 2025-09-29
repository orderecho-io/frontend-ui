import React from 'react';
import { 
  Users2, 
  Store, 
  ShoppingCart, 
  DollarSign, 
  Mail, 
  Phone, 
  TrendingUp, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const AdminStatsCards = ({ stats }) => {
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const getConversionRate = () => {
    const totalOrders = stats.total_orders || 0;
    const totalCalls = stats.total_calls || 0;
    if (totalCalls === 0) return 0;
    return ((totalOrders / totalCalls) * 100);
  };

  const statCards = [
    {
      title: 'Total Users',
      value: formatNumber(stats.total_users),
      subtitle: `${stats.active_users} active`,
      icon: Users2,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: stats.new_leads_today,
      changeLabel: 'new today'
    },
    {
      title: 'Restaurants',
      value: formatNumber(stats.total_restaurants),
      subtitle: `${stats.active_restaurants} active`,
      icon: Store,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      change: stats.total_restaurants * 0.05, // Sample growth
      changeLabel: 'this month'
    },
    {
      title: 'Total Orders',
      value: formatNumber(stats.total_orders),
      subtitle: formatCurrency(stats.total_revenue),
      icon: ShoppingCart,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      change: stats.new_calls_today,
      changeLabel: 'orders today'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.total_revenue),
      subtitle: `${formatNumber(stats.total_orders)} orders`,
      icon: DollarSign,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      change: stats.total_revenue * 0.08, // Sample growth
      changeLabel: 'this month'
    },
    {
      title: 'Total Leads',
      value: formatNumber(stats.total_leads),
      subtitle: `${stats.new_leads_today} new today`,
      icon: Mail,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      change: stats.new_leads_today,
      changeLabel: 'new today'
    },
    {
      title: 'Call Volume',
      value: formatNumber(stats.total_calls),
      subtitle: `${stats.new_calls_today} calls today`,
      icon: Phone,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      change: stats.new_calls_today,
      changeLabel: 'today'
    },
    {
      title: 'Call-to-Order Rate',
      value: formatPercentage(getConversionRate()),
      subtitle: `${stats.total_orders} orders from ${stats.total_calls} calls`,
      icon: TrendingUp,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      change: getConversionRate() > 25 ? 'Good' : 'Needs Improvement',
      changeLabel: 'performance'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div key={index} className={`${stat.bgColor} rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`${stat.color} rounded-lg p-3`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            {stat.change && (
              <div className={`${stat.textColor} text-sm font-medium flex items-center`}>
                <ArrowUpRight className="h-4 w-4 mr-1" />
                {typeof stat.change === 'string' ? stat.change : `+${formatNumber(stat.change)}`}
              </div>
            )}
          </div>
          
          <div className="mb-2">
            <h3 className={`${stat.textColor} text-2xl font-bold`}>
              {stat.value}
            </h3>
            <p className="text-sm text-gray-600">
              {stat.title}
            </p>
          </div>
          
          <div className="text-sm text-gray-500 flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {stat.subtitle}
          </div>
          
          {stat.changeLabel && (
            <div className="mt-2 text-xs text-gray-500">
              {stat.changeLabel}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AdminStatsCards;
