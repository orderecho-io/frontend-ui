import React from 'react';

const AccountSettings = ({ accountDetails, isEditing, editedSettings, setEditedSettings }) => {
  if (!accountDetails?.settings || accountDetails.settings.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Settings Found</h3>
        <p className="text-gray-600">No account settings are configured for this user.</p>
      </div>
    );
  }

  const formatSettingKey = (key) => {
    // Remove account_id prefix and format nicely
    const cleanKey = key.split('_').slice(1).join('_');
    return cleanKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const renderSettingValue = (setting, key) => {
    if (isEditing) {
      if (setting.data_type === 'boolean') {
        return (
          <select
            value={editedSettings[key] || setting.value}
            onChange={(e) => setEditedSettings({...editedSettings, [key]: e.target.value})}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        );
      } else if (setting.data_type === 'number') {
        return (
          <input
            type="number"
            value={editedSettings[key] || setting.value}
            onChange={(e) => setEditedSettings({...editedSettings, [key]: e.target.value})}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );
      } else if (key === 'currency') {
        return (
          <select
            value={editedSettings[key] || setting.value}
            onChange={(e) => setEditedSettings({...editedSettings, [key]: e.target.value})}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="CAD">CAD - Canadian Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="JPY">JPY - Japanese Yen</option>
          </select>
        );
      } else if (key === 'timezone') {
        return (
          <select
            value={editedSettings[key] || setting.value}
            onChange={(e) => setEditedSettings({...editedSettings, [key]: e.target.value})}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="America/Toronto">Toronto</option>
            <option value="America/Vancouver">Vancouver</option>
            <option value="UTC">UTC</option>
          </select>
        );
      } else {
        return (
          <input
            type="text"
            value={editedSettings[key] || setting.value}
            onChange={(e) => setEditedSettings({...editedSettings, [key]: e.target.value})}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );
      }
    } else {
      // Display mode
      if (setting.data_type === 'boolean') {
        return (
          <span className={`px-2 py-1 text-xs rounded-full ${
            setting.value === 'true' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {setting.value === 'true' ? 'Enabled' : 'Disabled'}
          </span>
        );
      } else if (setting.data_type === 'number' && key.includes('amount')) {
        return `$${parseFloat(setting.value).toFixed(2)}`;
      } else {
        return setting.value;
      }
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
      <div className="grid grid-cols-2 gap-4">
        {accountDetails.settings.map((setting) => {
          const key = setting.key.split('_').slice(1).join('_');
          return (
            <div key={setting.id} className="p-4 border rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {setting.description || formatSettingKey(setting.key)}
              </label>
              <div className="mb-2">
                {renderSettingValue(setting, key)}
              </div>
              <div className="text-xs text-gray-500">
                Type: {setting.data_type} | Key: {key}
              </div>
              {setting.description && (
                <div className="text-xs text-gray-600 mt-1">
                  {setting.description}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Settings Section */}
      <div className="mt-8">
        <h4 className="text-md font-semibold mb-4">Quick Settings</h4>
        <div className="grid grid-cols-3 gap-4">
          {/* AI Voice Toggle */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h5 className="font-medium text-blue-900">AI Voice Agent</h5>
            <p className="text-sm text-blue-700 mb-2">Enable voice ordering</p>
            {isEditing ? (
              <select
                value={editedSettings['ai_voice_enabled'] || 'true'}
                onChange={(e) => setEditedSettings({...editedSettings, ai_voice_enabled: e.target.value})}
                className="w-full px-2 py-1 border rounded text-sm"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            ) : (
              <span className={`px-2 py-1 text-xs rounded-full ${
                accountDetails.settings.find(s => s.key.includes('ai_voice_enabled'))?.value === 'true' 
                  ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {accountDetails.settings.find(s => s.key.includes('ai_voice_enabled'))?.value === 'true' ? 'On' : 'Off'}
              </span>
            )}
          </div>

          {/* Order Confirmation */}
          <div className="p-4 bg-green-50 rounded-lg">
            <h5 className="font-medium text-green-900">Order Confirmation</h5>
            <p className="text-sm text-green-700 mb-2">Require order confirmation</p>
            {isEditing ? (
              <select
                value={editedSettings['order_confirmation_required'] || 'true'}
                onChange={(e) => setEditedSettings({...editedSettings, order_confirmation_required: e.target.value})}
                className="w-full px-2 py-1 border rounded text-sm"
              >
                <option value="true">Required</option>
                <option value="false">Optional</option>
              </select>
            ) : (
              <span className={`px-2 py-1 text-xs rounded-full ${
                accountDetails.settings.find(s => s.key.includes('order_confirmation_required'))?.value === 'true' 
                  ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {accountDetails.settings.find(s => s.key.includes('order_confirmation_required'))?.value === 'true' ? 'Required' : 'Optional'}
              </span>
            )}
          </div>

          {/* Auto Print */}
          <div className="p-4 bg-purple-50 rounded-lg">
            <h5 className="font-medium text-purple-900">Auto Print Orders</h5>
            <p className="text-sm text-purple-700 mb-2">Print orders automatically</p>
            {isEditing ? (
              <select
                value={editedSettings['auto_print_orders'] || 'false'}
                onChange={(e) => setEditedSettings({...editedSettings, auto_print_orders: e.target.value})}
                className="w-full px-2 py-1 border rounded text-sm"
              >
                <option value="true">Enabled</option>
                <option value="false">Disabled</option>
              </select>
            ) : (
              <span className={`px-2 py-1 text-xs rounded-full ${
                accountDetails.settings.find(s => s.key.includes('auto_print_orders'))?.value === 'true' 
                  ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {accountDetails.settings.find(s => s.key.includes('auto_print_orders'))?.value === 'true' ? 'On' : 'Off'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;