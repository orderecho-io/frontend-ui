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
  DollarSign,
  X
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
          { key: 'id', label: 'User ID', sortable: true, type: 'link' },
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

  const handleUserClick = async (userId) => {
    setSelectedUser(userId);
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      console.log('🔍 Debug: Fetching accounts for user:', userId);
      
      // First find the account associated with this user
      const accountsResponse = await fetch('/api/admin/accounts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('🔍 Debug: Response status:', accountsResponse.status);
      
      if (!accountsResponse.ok) {
        const errorText = await accountsResponse.text();
        console.error('❌ Accounts fetch failed:', errorText);
        throw new Error(`Failed to fetch accounts: ${accountsResponse.status}`);
      }
      
      const allAccounts = await accountsResponse.json();
      console.log('🔍 Debug: Received accounts:', allAccounts.length, 'records');
      
      const userAccount = allAccounts.find(acc => acc.user_id === userId);
      
      if (userAccount) {
        console.log('✅ Found account for user:', userAccount);
        // Use the account data directly (the endpoint already has enough info)
        setAccountDetails({ account: userAccount });
        setShowAccountModal(true);
      } else {
        console.log('❌ No account found for user:', userId);
        // User has no account
        setAccountDetails({ account: null, user_id: userId });
        setShowAccountModal(true);
      }
    } catch (error) {
      console.error('Error fetching account details:', error);
      
      // Instead of showing alert, show modal with error state
      setAccountDetails({ 
        account: null, 
        user_id: userId,
        error: error.message || 'Failed to fetch account details'
      });
      setShowAccountModal(true);
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

// Account Details Modal Component
const AccountDetailsModal = ({ user, accountDetails, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAccount, setEditedAccount] = useState(accountDetails?.account || {});
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate(editedAccount);
      setIsEditing(false);
      onClose(); // Refresh the parent data
    } catch (error) {
      console.error('Failed to update account:', error);
      alert('Failed to update account');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedAccount(accountDetails?.account || {});
    setIsEditing(false);
  };

  if (!accountDetails && loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading account details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {accountDetails?.account ? 'Account Details' : 'User Profile - No Account'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {accountDetails?.error ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Account Details</h3>
              <p className="text-red-600 mb-4">{accountDetails.error}</p>
              <p className="text-sm text-gray-600">Please check the browser console for more details.</p>
            </div>
          ) : accountDetails?.account ? (
            <>
              {/* Account Information */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                <div className="grid grid-cols-2 gap-4">
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
                      <p className="mt-1 text-sm text-gray-900">{accountDetails.account.restaurant_name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Business Phone</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedAccount.business_phone || ''}
                        onChange={(e) => setEditedAccount({...editedAccount, business_phone: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{accountDetails.account.business_phone}</p>
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
                        <option value="basic">Basic</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{accountDetails.account.subscription_plan}</p>
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
                        <option value="suspended">Suspended</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          accountDetails.account.subscription_status === 'active' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {accountDetails.account.subscription_status}
                        </span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Business Address</label>
                    {isEditing ? (
                      <textarea
                        value={editedAccount.business_address || ''}
                        onChange={(e) => setEditedAccount({...editedAccount, business_address: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        rows={2}
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{accountDetails.account.business_address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Business Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedAccount.business_email || ''}
                        onChange={(e) => setEditedAccount({...editedAccount, business_email: e.target.value})}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{accountDetails.account.business_email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              {accountDetails.recent_orders && accountDetails.recent_orders.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {accountDetails.recent_orders.slice(0, 5).map((order, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer_name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.total_amount}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.order_status}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(order.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Call Summary */}
              {accountDetails.call_summary && accountDetails.call_summary.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">Call Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {accountDetails.call_summary.map((call, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900">{call.call_status}</h4>
                        <p className="text-sm text-gray-600">Count: {call.count}</p>
                        {call.avg_duration && <p className="text-sm text-gray-600">Avg Duration: {call.avg_duration.toFixed(1)} min</p>}
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
          
          {accountDetails?.account && (
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
                  Edit Account
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
