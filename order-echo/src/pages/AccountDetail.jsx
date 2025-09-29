import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Store, 
  Phone, 
  Mail, 
  MapPin, 
  Settings, 
  ShoppingCart, 
  Edit,
  Save,
  X,
  Activity
} from 'lucide-react';

// Import subtab components
import AccountOrders from '../components/admin/AccountOrders';
import AccountCalls from '../components/admin/AccountCalls';
import AccountSettings from '../components/admin/AccountSettings';

const AccountDetail = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [accountDetails, setAccountDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState('orders');
  const [editing, setEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  
  // Data for different subtabs (now handled by individual components)
  const [ordersCount, setOrdersCount] = useState(0);
  const [callsCount, setCallsCount] = useState(0);
  const [settingsCount, setSettingsCount] = useState(0);

  useEffect(() => {
    fetchAccountDetails();
  }, [accountId]);

  // Remove the useEffect for fetching subtab data - now handled by individual components

  const fetchAccountDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/admin/account/${accountId}/details`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch account details');
      }

      const data = await response.json();
      setAccountDetails(data);
      setEditedData(data.account || {});
      
    } catch (error) {
      console.error('Error fetching account details:', error);
      alert('Failed to fetch account details');
    } finally {
      setLoading(false);
    }
  };

  // Remove individual fetch functions - now handled by subtab components

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/admin/accounts/${accountId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedData)
      });

      if (response.ok) {
        setAccountDetails(prev => ({
          ...prev,
          account: { ...prev.account, ...editedData }
        }));
        setEditing(false);
      } else {
        throw new Error('Failed to update account');
      }
      
    } catch (error) {
      console.error('Failed to update account:', error);
      alert('Failed to update account');
    }
  };

  const handleCancel = () => {
    setEditedData(accountDetails?.account || {});
    setEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg">Loading account details...</span>
      </div>
    );
  }

  if (!accountDetails) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Account Not Found</h2>
        <p className="text-gray-600 mb-4">The requested account could not be found.</p>
        <button
          onClick={() => navigate('/admin')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Admin Dashboard
        </button>
      </div>
    );
  }

  const account = accountDetails.account;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Admin Dashboard
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              {editing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    <X className="h-4 w-4 inline mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveChanges}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    <Save className="h-4 w-4 inline mr-2" />
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  <Edit className="h-4 w-4 inline mr-2" />
                  Edit Account
                </button>
              )}
            </div>
          </div>
          
          {/* Account Basic Info */}
          <div className="pb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-shrink-0">
                <Store className="h-12 w-12 text-blue-600" />
              </div>
              <div>
                {editing ? (
                  <input
                    type="text"
                    value={editedData.restaurant_name || ''}
                    onChange={(e) => handleInputChange('restaurant_name', e.target.value)}
                    className="text-2xl font-bold text-gray-900 border border-gray-300 rounded-md px-3 py-1"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900">{account.restaurant_name}</h1>
                )}
                <p className="text-gray-600">Account ID: {account.id}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Contact Information */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    {editing ? (
                      <input
                        type="text"
                        value={editedData.business_phone || ''}
                        onChange={(e) => handleInputChange('business_phone', e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <span className="text-gray-900">{account.business_phone || 'Not provided'}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    {editing ? (
                      <input
                        type="email"
                        value={editedData.business_email || ''}
                        onChange={(e) => handleInputChange('business_email', e.target.value)}
                        className="flex-1 px-3 py-1 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <span className="text-gray-900">{account.business_email || 'Not provided'}</span>
                    )}
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      {editing ? (
                        <textarea
                          value={editedData.business_address || ''}
                          onChange={(e) => handleInputChange('business_address', e.target.value)}
                          className="w-full px-3 py-1 border border-gray-300 rounded-md"
                          rows={2}
                        />
                      ) : (
                        <span className="text-gray-900">{account.business_address || 'Not provided'}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscription Information */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Plan</label>
                    {editing ? (
                      <select
                        value={editedData.subscription_plan || ''}
                        onChange={(e) => handleInputChange('subscription_plan', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="basic">Basic</option>
                        <option value="premium">Premium</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    ) : (
                      <p className="mt-1 text-sm text-gray-900 font-medium">{account.subscription_plan}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    {editing ? (
                      <select
                        value={editedData.subscription_status || ''}
                        onChange={(e) => handleInputChange('subscription_status', e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended"> Suspended</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span className={`mt-1 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        account.subscription_status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : account.subscription_status === 'inactive'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {account.subscription_status}
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Owner</label>
                    <p className="mt-1 text-sm text-gray-900">{accountDetails.owner_name}</p>
                    <p className="text-sm text-gray-600">{accountDetails.owner_email}</p>
                    <p className="text-sm text-gray-600">{accountDetails.owner_phone}</p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Orders</span>
                    <span className="text-sm font-semibold text-gray-900">{account.total_orders || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Revenue</span>
                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(account.total_revenue || 0)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Average Order</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {account.total_orders > 0 ? formatCurrency((account.total_revenue || 0) / account.total_orders) : '$0.00'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'orders', label: 'Orders', icon: ShoppingCart, count: ordersCount },
              { id: 'calls', label: 'Call History', icon: Activity, count: callsCount },
              { id: 'settings', label: 'Settings', icon: Settings, count: settingsCount }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeSubTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Subtab Content */}
        <div className="mt-8">
          {activeSubTab === 'orders' && (
            <AccountOrders 
              accountId={accountId} 
              onDataLoaded={(count) => setOrdersCount(count)}
            />
          )}

          {activeSubTab === 'calls' && (
            <AccountCalls 
              accountId={accountId} 
              onDataLoaded={(count) => setCallsCount(count)}
            />
          )}

          {activeSubTab === 'settings' && (
            <AccountSettings 
              accountId={accountId} 
              onDataLoaded={(count) => setSettingsCount(count)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountDetail;
