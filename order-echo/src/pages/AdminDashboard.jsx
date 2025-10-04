import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  DollarSign,
  X
} from 'lucide-react';

// Import admin components
import AdminStatsCards from '../components/admin/AdminStatsCards';
import AdminDataTable from '../components/admin/AdminDataTable';
import AdminFilters from '../components/admin/AdminFilters';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [leads, setLeads] = useState([]);
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [accountDetails, setAccountDetails] = useState(null);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    date_from: '',
    date_to: '',
    status: '',
    role: ''
  });

  const tabs = [
    { id: 'stats', label: 'Dashboard Overview', icon: TrendingUp },
    { id: 'users', label: 'Users & Accounts', icon: Users2 },
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
      // Use the new super admin endpoint
      const response = await fetch('/api/admin/dashboard/stats', {
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
      
      let endpoint = '';
      switch (type) {
        case 'users':
          // Use new combined users endpoint that includes account info
          endpoint = `/api/admin/users?${params}`;
          break;
        case 'accounts':
          // For accounts, we'll use the same users endpoint but filter for those with accounts
          endpoint = `/api/admin/users?${params}`;
          break;
        case 'leads':
          endpoint = `/api/admin/leads?${params}`;
          break;
        case 'calls':
          endpoint = `/api/admin/calls?${params}`;
          break;
        default:
          endpoint = `/api/admin/${type}?${params}`;
      }
      
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        
        switch (type) {
          case 'users':
            // The new API returns accounts array with user info
            setUsers(data.accounts || data);
            break;
          case 'accounts':
            // Filter for users that have accounts
            const accountsData = data.accounts || data;
            setAccounts(accountsData.filter(item => item.account_id));
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
          { key: 'user_id', label: 'User ID', sortable: true, type: 'link' },
          { key: 'first_name', label: 'First Name', sortable: true },
          { key: 'last_name', label: 'Last Name', sortable: true },
          { key: 'email', label: 'Email', sortable: true },
          { key: 'role', label: 'Role', sortable: true },
          { key: 'is_active', label: 'Active', type: 'boolean' },
          { key: 'restaurant_name', label: 'Restaurant', sortable: true },
          { key: 'subscription_plan', label: 'Plan', sortable: true },
          { key: 'user_created_at', label: 'Created', type: 'date', sortable: true }
        ];
      case 'accounts':
        return [
          { key: 'restaurant_name', label: 'Restaurant Name', sortable: true },
          { key: 'first_name', label: 'Owner First', sortable: true },
          { key: 'last_name', label: 'Owner Last', sortable: true },
          { key: 'email', label: 'Email', sortable: true },
          { key: 'restaurant_phone', label: 'Phone' },
          { key: 'cuisine_type', label: 'Cuisine', sortable: true },
          { key: 'account_active', label: 'Active', type: 'boolean' },
          { key: 'subscription_plan', label: 'Plan', sortable: true },
          { key: 'subscription_status', label: 'Status', sortable: true },
          { key: 'total_orders', label: 'Orders', type: 'number' },
          { key: 'account_created_at', label: 'Created', type: 'date', sortable: true }
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
          { value: 'free', label: 'Free' },
          { value: 'basic', label: 'Basic' },
          { value: 'premium', label: 'Premium' },
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
        // For users, we might update the user or account depending on what changed
        if (itemData.account_id) {
          updateUrl = `/api/admin/accounts/${itemData.account_id}`;
        } else {
          updateUrl = `/api/admin/users/${itemData.user_id}`;
        }
        break;
      case 'accounts':
        updateUrl = `/api/admin/accounts/${itemData.account_id}`;
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

  const handleUserClick = async (userId) => {
    setSelectedUser(userId);
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      console.log('🔍 Debug: Fetching user details for:', userId);
      
      // Use the new detailed user endpoint
      const response = await fetch(`/api/admin/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('🔍 Debug: Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ User details fetch failed:', errorText);
        throw new Error(`Failed to fetch user details: ${response.status}`);
      }
      
      const userDetails = await response.json();
      console.log('✅ Received user details:', userDetails);
      
      setAccountDetails(userDetails);
      setShowAccountModal(true);
      
    } catch (error) {
      console.error('Error fetching user details:', error);
      alert(`Failed to fetch user details: ${error.message}`);
    } finally {
      setLoading(false);
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
              activeTab === 'users' ? 'Search by name, email, or restaurant...' :
              activeTab === 'accounts' ? 'Search by restaurant name or owner...' :
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
                activeTab === 'users' ? 'System Users & Accounts' :
                activeTab === 'accounts' ? 'Restaurant Accounts' :
                activeTab === 'leads' ? 'Lead Pipeline' :
                'Call History'
              }
              searchable={true}
              paginated={true}
              onUpdate={handleUpdate}
              entityType={activeTab.slice(0, -1)} // Remove 's' from end
              onRowClick={activeTab === 'users' ? handleUserClick : null}
            />
          </div>
        )}

        {/* Account Details Modal */}
        {showAccountModal && (
          <AccountDetailsModal
            user={selectedUser}
            accountDetails={accountDetails}
            onClose={() => {
              setShowAccountModal(false);
              setAccountDetails(null);
              setSelectedUser(null);
            }}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </div>
  );
};

// Enhanced Account Details Modal Component
const AccountDetailsModal = ({ user, accountDetails, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAccount, setEditedAccount] = useState({});
  const [editedSettings, setEditedSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('account');

  useEffect(() => {
    if (accountDetails?.user) {
      setEditedAccount(accountDetails.user);
    }
    if (accountDetails?.settings) {
      const settingsObj = {};
      accountDetails.settings.forEach(setting => {
        const key = setting.key.split('_').slice(1).join('_'); // Remove account_id prefix
        settingsObj[key] = setting.value;
      });
      setEditedSettings(settingsObj);
    }
  }, [accountDetails]);

  const handleSave = async () => {
    setLoading(true);
    try {
      if (activeSubTab === 'account' && accountDetails?.user?.account_id) {
        // Update account information
        await fetch(`/api/admin/accounts/${accountDetails.user.account_id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editedAccount)
        });
      } else if (activeSubTab === 'settings') {
        // Update settings
        for (const [key, value] of Object.entries(editedSettings)) {
          await fetch(`/api/admin/accounts/${accountDetails.user.account_id}/settings/${key}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ value })
          });
        }
      }
      
      setIsEditing(false);
      alert('Update successful!');
      onClose(); // Refresh the parent data
    } catch (error) {
      console.error('Failed to update:', error);
      alert('Failed to update');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (accountDetails?.user) {
      setEditedAccount(accountDetails.user);
    }
    if (accountDetails?.settings) {
      const settingsObj = {};
      accountDetails.settings.forEach(setting => {
        const key = setting.key.split('_').slice(1).join('_');
        settingsObj[key] = setting.value;
      });
      setEditedSettings(settingsObj);
    }
    setIsEditing(false);
  };

  if (!accountDetails && loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading user details...</p>
        </div>
      </div>
    );
  }

  const subTabs = [
    { id: 'account', label: 'Account Info' },
    { id: 'settings', label: 'Settings' },
    { id: 'hours', label: 'Working Hours' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {accountDetails?.user ? 'User & Account Details' : 'User Profile - No Account'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Sub-tabs */}
        {accountDetails?.user?.account_id && (
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {subTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeSubTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        )}

        <div className="p-6">
          {accountDetails?.error ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading User Details</h3>
              <p className="text-red-600 mb-4">{accountDetails.error}</p>
            </div>
          ) : accountDetails?.user ? (
            <>
              {/* Account Information Tab */}
              {activeSubTab === 'account' && (
                <div className="grid grid-cols-2 gap-6">
                  {/* User Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">User Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedAccount.first_name || ''}
                            onChange={(e) => setEditedAccount({...editedAccount, first_name: e.target.value})}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{accountDetails.user.first_name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedAccount.last_name || ''}
                            onChange={(e) => setEditedAccount({...editedAccount, last_name: e.target.value})}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{accountDetails.user.last_name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="mt-1 text-sm text-gray-900">{accountDetails.user.email}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editedAccount.phone || ''}
                            onChange={(e) => setEditedAccount({...editedAccount, phone: e.target.value})}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{accountDetails.user.phone}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        {isEditing ? (
                          <select
                            value={editedAccount.role || ''}
                            onChange={(e) => setEditedAccount({...editedAccount, role: e.target.value})}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="super_admin">Super Admin</option>
                          </select>
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">{accountDetails.user.role}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Restaurant Information */}
                  {accountDetails.user.account_id && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Restaurant Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Restaurant Name</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedAccount.restaurant_name || ''}
                              onChange={(e) => setEditedAccount({...editedAccount, restaurant_name: e.target.value})}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          ) : (
                            <p className="mt-1 text-sm text-gray-900">{accountDetails.user.restaurant_name}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Restaurant Phone</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedAccount.restaurant_phone || ''}
                              onChange={(e) => setEditedAccount({...editedAccount, restaurant_phone: e.target.value})}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          ) : (
                            <p className="mt-1 text-sm text-gray-900">{accountDetails.user.restaurant_phone}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Address</label>
                          {isEditing ? (
                            <textarea
                              value={editedAccount.address || ''}
                              onChange={(e) => setEditedAccount({...editedAccount, address: e.target.value})}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                              rows={2}
                            />
                          ) : (
                            <p className="mt-1 text-sm text-gray-900">{accountDetails.user.address}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Cuisine Type</label>
                          {isEditing ? (
                            <select
                              value={editedAccount.cuisine_type || ''}
                              onChange={(e) => setEditedAccount({...editedAccount, cuisine_type: e.target.value})}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                              <option value="">Select cuisine type</option>
                              <option value="american">American</option>
                              <option value="italian">Italian</option>
                              <option value="chinese">Chinese</option>
                              <option value="mexican">Mexican</option>
                              <option value="indian">Indian</option>
                              <option value="japanese">Japanese</option>
                              <option value="thai">Thai</option>
                              <option value="mediterranean">Mediterranean</option>
                              <option value="french">French</option>
                              <option value="pizza">Pizza</option>
                              <option value="burger">Burger</option>
                              <option value="seafood">Seafood</option>
                              <option value="other">Other</option>
                            </select>
                          ) : (
                            <p className="mt-1 text-sm text-gray-900">{accountDetails.user.cuisine_type}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Subscription Plan</label>
                          {isEditing ? (
                            <select
                              value={editedAccount.subscription_plan || ''}
                              onChange={(e) => setEditedAccount({...editedAccount, subscription_plan: e.target.value})}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                              <option value="free">Free</option>
                              <option value="basic">Basic</option>
                              <option value="premium">Premium</option>
                              <option value="enterprise">Enterprise</option>
                            </select>
                          ) : (
                            <p className="mt-1 text-sm text-gray-900">{accountDetails.user.subscription_plan}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">Subscription Status</label>
                          {isEditing ? (
                            <select
                              value={editedAccount.subscription_status || ''}
                              onChange={(e) => setEditedAccount({...editedAccount, subscription_status: e.target.value})}
                              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                              <option value="trial">Trial</option>
                              <option value="expired">Expired</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          ) : (
                            <p className="mt-1 text-sm text-gray-900">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                accountDetails.user.subscription_status === 'active' 
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {accountDetails.user.subscription_status}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Settings Tab */}
              {activeSubTab === 'settings' && accountDetails.settings && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {accountDetails.settings.map((setting) => {
                      const key = setting.key.split('_').slice(1).join('_');
                      return (
                        <div key={setting.id}>
                          <label className="block text-sm font-medium text-gray-700">
                            {setting.description || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </label>
                          {isEditing ? (
                            setting.data_type === 'boolean' ? (
                              <select
                                value={editedSettings[key] || ''}
                                onChange={(e) => setEditedSettings({...editedSettings, [key]: e.target.value})}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                              >
                                <option value="true">True</option>
                                <option value="false">False</option>
                              </select>
                            ) : (
                              <input
                                type={setting.data_type === 'number' ? 'number' : 'text'}
                                value={editedSettings[key] || ''}
                                onChange={(e) => setEditedSettings({...editedSettings, [key]: e.target.value})}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                              />
                            )
                          ) : (
                            <p className="mt-1 text-sm text-gray-900">{setting.value}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Working Hours Tab */}
              {activeSubTab === 'hours' && accountDetails.working_hours && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Working Hours</h3>
                  <div className="space-y-4">
                    {accountDetails.working_hours.map((hours) => (
                      <div key={hours.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="w-24">
                          <span className="font-medium">{hours.day_of_week}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={hours.is_open}
                            readOnly={!isEditing}
                            className="rounded"
                          />
                          <span className="text-sm">Open</span>
                        </div>
                        {hours.is_open && (
                          <>
                            <div>
                              <input
                                type="time"
                                value={hours.open_time || ''}
                                readOnly={!isEditing}
                                className="px-3 py-1 border border-gray-300 rounded-md"
                              />
                            </div>
                            <span>to</span>
                            <div>
                              <input
                                type="time"
                                value={hours.close_time || ''}
                                readOnly={!isEditing}
                                className="px-3 py-1 border border-gray-300 rounded-md"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Account Found</h3>
              <p className="text-gray-600">This user does not have an associated restaurant account.</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Close
          </button>
          
          {accountDetails?.user && (
            <>
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Edit {activeSubTab === 'account' ? 'Account' : activeSubTab === 'settings' ? 'Settings' : 'Hours'}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;