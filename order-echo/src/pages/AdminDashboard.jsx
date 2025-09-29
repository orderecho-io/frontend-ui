import React, { useState, useEffect } from 'react';
import { 
  Users2, 
  Store, 
  TrendingUp, 
  Phone, 
  Mail, 
  Filter,
  Search,
  Plus,
  FilterX,
  Calendar,
  DollarSign
} from 'lucide-react';

// Import admin components
import AdminStatsCards from '../components/admin/AdminStatsCards';
import AdminDataTable from '../components/admin/AdminDataTable';
import AdminFilters from '../components/admin/AdminFilters';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [leads, setLeads] = useState([]);
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    date_from: '',
    date_to: '',
    status: '',
    role: ''
  });

  const tabs = [
    { id: 'stats', label: 'Dashboard Overview', icon: TrendingUp },
    { id: 'users', label: 'Users', icon: Users2 },
    { id: 'accounts', label: 'Restaurants', icon: Store },
    { id: 'leads', label: 'Leads', icon: Mail },
    { id: 'calls', label: 'Call History', icon: Phone }
  ];

  useEffect(() => {
    if (activeTab === 'stats') {
      fetchStats();
    } else {
      fetchTableData(activeTab);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'stats') {
      fetchTableData(activeTab);
    }
  }, [filters]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTableData = async (type) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.date_from) params.append('date_from', filters.date_from);
      if (filters.date_to) params.append('date_to', filters.date_to);
      if (filters.status) params.append(
        type === 'users' ? 'role' : 
        type === 'accounts' ? 'subscription_plan' :
        type === 'leads' ? 'lead_status' : 'call_status',
        filters.status
      );
      
      const response = await fetch(`/api/admin/${type}?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        switch (type) {
          case 'users':
            setUsers(data);
            break;
          case 'accounts':
            setAccounts(data);
            break;
          case 'leads':
            setLeads(data);
            break;
          case 'calls':
            setCalls(data);
            break;
        }
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const getColumns = () => {
    switch (activeTab) {
      case 'users':
        return [
          { key: 'first_name', label: 'First Name', sortable: true },
          { key: 'last_name', label: 'Last Name', sortable: true },
          { key: 'email', label: 'Email', sortable: true },
          { key: 'role', label: 'Role', sortable: true },
          { key: 'is_active', label: 'Active', type: 'boolean' },
          { key: 'restaurants_count', label: 'Restaurants', type: 'number' },
          { key: 'created_at', label: 'Created', type: 'date', sortable: true }
        ];
      case 'accounts':
        return [
          { key: 'restaurant_name', label: 'Restaurant Name', sortable: true },
          { key: 'owner_name', label: 'Owner', sortable: true },
          { key: 'cuisine_type', label: 'Cuisine', sortable: true },
          { key: 'is_active', label: 'Active', type: 'boolean' },
          { key: 'subscription_plan', label: 'Plan', sortable: true },
          { key: 'total_orders', label: 'Orders', type: 'number' },
          { key: 'total_revenue', label: 'Revenue', type: 'currency' },
          { key: 'created_at', label: 'Created', type: 'date', sortable: true }
        ];
      case 'leads':
        return [
          { key: 'restaurant_name', label: 'Restaurant', sortable: true },
          { key: 'contact_name', label: 'Contact', sortable: true },
          { key: 'email', label: 'Email', sortable: true },
          { key: 'phone', label: 'Phone' },
          { key: 'lead_status', label: 'Status', sortable: true },
          { key: 'lead_source', label: 'Source', sortable: true },
          { key: 'created_at', label: 'Created', type: 'date', sortable: true }
        ];
      case 'calls':
        return [
          { key: 'restaurant_name', label: 'Restaurant', sortable: true },
          { key: 'caller_name', label: 'Caller', sortable: true },
          { key: 'caller_phone', label: 'Phone' },
          { key: 'call_status', label: 'Status', sortable: true },
          { key: 'call_duration', label: 'Duration (min)', type: 'number' },
          { key: 'order_placed', label: 'Order Placed', type: 'boolean' },
          { key: 'call_date', label: 'Date', type: 'date', sortable: true }
        ];
      default:
        return [];
    }
  };

  const getTableData = () => {
    switch (activeTab) {
      case 'users':
        return users;
      case 'accounts':
        return accounts;
      case 'leads':
        return leads;
      case 'calls':
        return calls;
      default:
        return [];
    }
  };

  const getStatusOptions = () => {
    switch (activeTab) {
      case 'users':
        return [
          { value: '', label: 'All Roles' },
          { value: 'user', label: 'User' },
          { value: 'admin', label: 'Admin' },
          { value: 'super_admin', label: 'Super Admin' }
        ];
      case 'accounts':
        return [
          { value: '', label: 'All Plans' },
          { value: 'basic', label: 'Basic' },
          { value: 'pro', label: 'Pro' },
          { value: 'enterprise', label: 'Enterprise' }
        ];
      case 'leads':
        return [
          { value: '', label: 'All Statuses' },
          { value: 'new', label: 'New' },
          { value: 'contacted', label: 'Contacted' },
          { value: 'qualified', label: 'Qualified' },
          { value: 'demo_scheduled', label: 'Demo Scheduled' },
          { value: 'demo_completed', label: 'Demo Completed' },
          { value: 'converted', label: 'Converted' },
          { value: 'closed', label: 'Closed' }
        ];
      case 'calls':
        return [
          { value: '', label: 'All Statuses' },
          { value: 'answered', label: 'Answered' },
          { value: 'missed', label: 'Missed' },
          { value: 'voicemail', label: 'Voicemail' },
          { value: 'busy', label: 'Busy' },
          { value: 'no_answer', label: 'No Answer' }
        ];
      default:
        return [];
    }
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      date_from: '',
      date_to: '',
      status: '',
      role: ''
    });
  };

  const handleUpdate = async (itemData) => {
    const token = localStorage.getItem('token');
    let updateUrl = '';
    
    // Determine which endpoint to call based on active tab
    switch (activeTab) {
      case 'users':
        updateUrl = `/api/admin/users/${itemData.id}`;
        break;
      case 'accounts':
        updateUrl = `/api/admin/accounts/${itemData.id}`;
        break;
      case 'leads':
        updateUrl = `/api/admin/leads/${itemData.id}`;
        break;
      default:
        throw new Error(`Cannot update ${activeTab}`);
    }

    try {
      const response = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(itemData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update ${activeTab}`);
      }

      // Refresh the data
      fetchTableData(activeTab);
      alert('Update successful!');
    } catch (error) {
      console.error(`Error updating ${activeTab}:`, error);
      alert(`Failed to update ${activeTab}`);
    }
  };

  if (loading && activeTab === 'stats') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Comprehensive system management and analytics</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Stats Overview */}
        {activeTab === 'stats' && stats && (
          <AdminStatsCards stats={stats} />
        )}

        {/* Filters */}
        {activeTab !== 'stats' && (
          <AdminFilters
            filters={filters}
            onFiltersChange={setFilters}
            searchPlaceholder={
              activeTab === 'users' ? 'Search by name or email...' :
              activeTab === 'accounts' ? 'Search by restaurant name...' :
              activeTab === 'leads' ? 'Search by restaurant or contact...' :
              'Search by caller name or phone...'
            }
            statusOptions={getStatusOptions()}
            onClearFilters={clearFilters}
            showDateRange={activeTab === 'leads' || activeTab === 'calls'}
          />
        )}

        {/* Data Table */}
        {activeTab !== 'stats' && (
          <div className="bg-white rounded-lg shadow-sm">
            <AdminDataTable
              data={getTableData()}
              columns={getColumns()}
              loading={loading}
              title={
                activeTab === 'users' ? 'System Users' :
                activeTab === 'accounts' ? 'Restaurant Accounts' :
                activeTab === 'leads' ? 'Lead Pipeline' :
                'Call History'
              }
              searchable={true}
              paginated={true}
              onUpdate={handleUpdate}
              entityType={activeTab.slice(0, -1)} // Remove 's' from end
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
