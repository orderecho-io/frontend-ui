import React, { useState, useEffect } from 'react';
import { X, User, Settings, Clock, Save, Edit, AlertCircle, Key } from 'lucide-react';
import AccountInfo from './AccountInfo';
import AccountSettings from './AccountSettings';
import WorkingHours from './WorkingHours';
import PasswordReset from './PasswordReset';

const UserDetailsModal = ({ user, accountDetails, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAccount, setEditedAccount] = useState({});
  const [editedSettings, setEditedSettings] = useState({});
  const [editedHours, setEditedHours] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('account');
  const [error, setError] = useState(null);
  const [showPasswordReset, setShowPasswordReset] = useState(false);

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
    if (accountDetails?.working_hours) {
      const hoursObj = {};
      accountDetails.working_hours.forEach(hours => {
        hoursObj[hours.day_of_week] = {
          is_open: hours.is_open,
          open_time: hours.open_time,
          close_time: hours.close_time
        };
      });
      setEditedHours(hoursObj);
    }
  }, [accountDetails]);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (activeSubTab === 'account' && accountDetails?.user?.account_id) {
        // Update account information
        const response = await fetch(`/api/admin/accounts/${accountDetails.user.account_id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editedAccount)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to update account');
        }
      } else if (activeSubTab === 'settings' && accountDetails?.user?.account_id) {
        // Update settings
        const updatePromises = [];
        for (const [key, value] of Object.entries(editedSettings)) {
          updatePromises.push(
            fetch(`/api/admin/accounts/${accountDetails.user.account_id}/settings/${key}`, {
              method: 'PUT',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ value })
            })
          );
        }
        
        const responses = await Promise.all(updatePromises);
        const failedUpdates = responses.filter(r => !r.ok);
        if (failedUpdates.length > 0) {
          throw new Error(`Failed to update ${failedUpdates.length} settings`);
        }
      } else if (activeSubTab === 'hours' && accountDetails?.user?.account_id) {
        // Update working hours
        const hoursArray = Object.entries(editedHours).map(([day, hours]) => ({
          day_of_week: day,
          ...hours
        }));

        const response = await fetch(`/api/admin/accounts/${accountDetails.user.account_id}/working-hours`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(hoursArray)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to update working hours');
        }
      }
      
      setIsEditing(false);
      
      // Show success message
      if (window.toast) {
        window.toast.success('Changes saved successfully!');
      } else {
        alert('Changes saved successfully!');
      }
      
      // Refresh the data by closing and reopening (or call a refresh function)
      onClose();
      
    } catch (error) {
      console.error('Failed to update:', error);
      setError(error.message);
      
      if (window.toast) {
        window.toast.error(`Failed to save changes: ${error.message}`);
      } else {
        alert(`Failed to save changes: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset all edited data
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
    if (accountDetails?.working_hours) {
      const hoursObj = {};
      accountDetails.working_hours.forEach(hours => {
        hoursObj[hours.day_of_week] = {
          is_open: hours.is_open,
          open_time: hours.open_time,
          close_time: hours.close_time
        };
      });
      setEditedHours(hoursObj);
    }
    setIsEditing(false);
    setError(null);
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
    { id: 'account', label: 'Account Info', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'hours', label: 'Working Hours', icon: Clock },
    { id: 'password', label: 'Reset Password', icon: Key }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {accountDetails?.user ? 'User & Account Details' : 'User Profile - No Account'}
            </h2>
            {accountDetails?.user && (
              <p className="text-gray-600 mt-1">
                {accountDetails.user.first_name} {accountDetails.user.last_name} • {accountDetails.user.email}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Sub-tabs */}
        {accountDetails?.user?.account_id && (
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {subTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveSubTab(tab.id);
                    setError(null);
                  }}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeSubTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {accountDetails?.error ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading User Details</h3>
              <p className="text-red-600 mb-4">{accountDetails.error}</p>
              <p className="text-sm text-gray-600">Please check the browser console for more details.</p>
            </div>
          ) : (
            <>
              {/* Account Information Tab */}
              {activeSubTab === 'account' && (
                <AccountInfo
                  accountDetails={accountDetails}
                  isEditing={isEditing}
                  editedAccount={editedAccount}
                  setEditedAccount={setEditedAccount}
                />
              )}

              {/* Settings Tab */}
              {activeSubTab === 'settings' && accountDetails?.settings && (
                <AccountSettings
                  accountDetails={accountDetails}
                  isEditing={isEditing}
                  editedSettings={editedSettings}
                  setEditedSettings={setEditedSettings}
                />
              )}

              {/* Working Hours Tab */}
              {activeSubTab === 'hours' && accountDetails?.working_hours && (
                <WorkingHours
                  accountDetails={accountDetails}
                  isEditing={isEditing}
                  editedHours={editedHours}
                  setEditedHours={setEditedHours}
                />
              )}

              {/* Password Reset Tab */}
              {activeSubTab === 'password' && (
                <PasswordReset
                  user={accountDetails?.user || user}
                  onPasswordReset={() => {
                    // Refresh the modal after password reset
                    if (onUpdate) {
                      onUpdate();
                    }
                  }}
                />
              )}
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          
          {accountDetails?.user && (
            <>
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                    disabled={loading}
                  >
                    <Save className="h-4 w-4" />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Edit className="h-4 w-4" />
                  <span>
                    Edit {activeSubTab === 'account' ? 'Account' : 
                          activeSubTab === 'settings' ? 'Settings' : 'Hours'}
                  </span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
