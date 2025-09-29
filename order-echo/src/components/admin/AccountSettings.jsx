import React, { useState, useEffect } from 'react';
import { Settings, ToggleLeft, ToggleRight, Save, X } from 'lucide-react';

const AccountSettings = ({ accountId, onDataLoaded }) => {
  const [accountSettings, setAccountSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedSettings, setEditedSettings] = useState({});

  useEffect(() => {
    fetchAccountSettings();
  }, [accountId]);

  const fetchAccountSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/admin/account-settings/${accountId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAccountSettings(data);
        setEditedSettings(data || {});
        onDataLoaded && onDataLoaded(data ? 1 : 0);
      } else {
        throw new Error('Failed to fetch account settings');
      }
      
    } catch (error) {
      console.error('Error fetching account settings:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/admin/account-settings/${accountId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedSettings)
      });

      if (response.ok) {
        setAccountSettings(editedSettings);
        setEditing(false);
      } else {
        throw new Error('Failed to update settings');
      }
      
    } catch (error) {
      console.error('Failed to update settings:', error);
      alert('Failed to update settings');
    }
  };

  const handleCancel = () => {
    setEditedSettings(accountSettings || {});
    setEditing(false);
  };

  const handleToggle = (field) => {
    setEditedSettings(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Account Settings
          </h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading settings...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Account Settings
          </h3>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">Error loading settings: {error}</p>
            <button
              onClick={fetchAccountSettings}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Account Settings
          </h3>
          
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Edit Settings
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <X className="h-4 w-4 inline mr-2" />
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                <Save className="h-4 w-4 inline mr-2" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6">
        {!accountSettings ? (
          <div className="text-center py-8">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Settings Configured</h3>
            <p className="text-gray-600 mb-4">This account doesn't have any custom settings configured.</p>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Configure Settings
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Auto Order Processing */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">Auto Order Processing</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Automatically process orders when received via phone calls
                </p>
              </div>
              <div className="ml-4">
                {editing ? (
                  <button
                    onClick={() => handleToggle('auto_order_processing')}
                    className="flex items-center"
                  >
                    {editedSettings.auto_order_processing ? (
                      <ToggleRight className="h-6 w-6 text-blue-600" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-gray-400" />
                    )}
                  </button>
                ) : (
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    accountSettings.auto_order_processing 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {accountSettings.auto_order_processing ? 'Enabled' : 'Disabled'}
                  </span>
                )}
              </div>
            </div>

            {/* Business Hours Support */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">Business Hours Support</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Only accept orders during business hours
                </p>
              </div>
              <div className="ml-4">
                {editing ? (
                  <button
                    onClick={() => handleToggle('business_hours_support')}
                    className="flex items-center"
                  >
                    {editedSettings.business_hours_support ? (
                      <ToggleRight className="h-6 w-6 text-blue-600" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-gray-400" />
                    )}
                  </button>
                ) : (
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    accountSettings.business_hours_support 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {accountSettings.business_hours_support ? 'Enabled' : 'Disabled'}
                  </span>
                )}
              </div>
            </div>

            {/* Voice Assistant */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">Voice Assistant</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Enable AI voice assistant for order taking
                </p>
              </div>
              <div className="ml-4">
                {editing ? (
                  <button
                    onClick={() => handleToggle('voice_assistant_enabled')}
                    className="flex items-center"
                  >
                    {editedSettings.voice_assistant_enabled ? (
                      <ToggleRight className="h-6 w-6 text-blue-600" />
                    ) : (
                      <ToggleLeft className="h-6 w-6 text-gray-400" />
                    )}
                  </button>
                ) : (
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    accountSettings.voice_assistant_enabled 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {accountSettings.voice_assistant_enabled ? 'Enabled' : 'Disabled'}
                  </span>
                )}
              </div>
            </div>

            {/* Additional Settings */}
            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Additional Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Created:</span> {accountSettings.created_at ? new Date(accountSettings.created_at).toLocaleDateString() : 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span> {accountSettings.updated_at ? new Date(accountSettings.updated_at).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;
