import React, { useState, useEffect } from 'react';
import { Settings, Edit, Save, X, Bot, Mic, Globe, DollarSign } from 'lucide-react';

const AccountSettings = ({ accountId, isEditing, onEditToggle }) => {
  const [accountSettings, setAccountSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editedSettings, setEditedSettings] = useState({});

  useEffect(() => {
    fetchAccountSettings();
  }, [accountId]);

  const fetchAccountSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/admin/child-tables/account-settings/${accountId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          // No settings found, create default
          setAccountSettings(null);
          return;
        }
        throw new Error('Failed to fetch account settings');
      }

      const data = await response.json();
      setAccountSettings(data);
      setEditedSettings(data);
      
    } catch (error) {
      console.error('Error fetching account settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const method = accountSettings ? 'PUT' : 'POST';
      const url = accountSettings 
        ? `/api/admin/child-tables/account-settings/${accountSettings.id}`
        : '/api/admin/child-tables/account-settings';
      
      const body = accountSettings 
        ? editedSettings
        : { ...editedSettings, account_id: accountId };

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error('Failed to save account settings');
      }

      // Refresh data
      await fetchAccountSettings();
      
    } catch (error) {
      console.error('Error saving account settings:', error);
      alert('Failed to save account settings');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!accountSettings && !isEditing) {
    return (
      <div className="text-center py-8">
        <Settings className="mx-auto text-gray-400 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Settings Found</h3>
        <p className="text-gray-600">No account settings are configured for this restaurant.</p>
        <button
          onClick={() => {
            setEditedSettings({
              ai_personality: 'friendly',
              agent_name: 'Assistant',
              temperature: 0.0,
              max_duration: 3600,
              voice_id: '91fa9bcf-93c8-467c-8b29-973720e3f167',
              recording_enabled: false,
              upsell_enabled: true,
              multi_language_enabled: false,
              preferred_language: 'en',
              order_confirmation_required: true,
              minimum_order_amount: 0.0,
              delivery_fee: 0.0,
              tax_rate: 0.0,
              pos_integration_enabled: false,
              ultravox_model: 'fixie-ai/ultravox',
              join_timeout: 30,
              language_hint: 'en',
              first_speaker: 'FIRST_SPEAKER_AGENT',
              initial_output_medium: 'MESSAGE_MEDIUM_VOICE',
              transcript_optional: true
            });
            onEditToggle(true);
          }}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Create Settings
        </button>
      </div>
    );
  }

  const currentSettings = accountSettings || editedSettings;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Settings className="text-blue-600" size={20} />
          <h3 className="text-lg font-semibold">Account Settings</h3>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <Save size={16} />
                <span>Save</span>
              </button>
              <button
                onClick={() => {
                  setEditedSettings(accountSettings || {});
                  onEditToggle(false);
                }}
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => onEditToggle(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Edit size={16} />
              <span>Edit</span>
            </button>
          )}
        </div>
      </div>

      {/* AI Configuration Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Bot className="text-purple-600" size={20} />
          <h4 className="text-md font-semibold">AI Configuration</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ultravox Agent ID
              <span className="text-xs text-gray-500 ml-2">(UUID from Ultravox platform)</span>
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedSettings.agent_id || ''}
                onChange={(e) => setEditedSettings({...editedSettings, agent_id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                placeholder="dcb81b9a-24e5-4eb3-a727-9e83562dacf9"
              />
            ) : (
              <p className="text-gray-900 font-mono text-sm bg-gray-50 p-3 rounded-md">
                {currentSettings.agent_id || 'dcb81b9a-24e5-4eb3-a727-9e83562dacf9'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Agent Name</label>
            {isEditing ? (
              <input
                type="text"
                value={editedSettings.agent_name || ''}
                onChange={(e) => setEditedSettings({...editedSettings, agent_name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Assistant"
              />
            ) : (
              <p className="text-gray-900">{currentSettings.agent_name || 'Assistant'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">AI Personality</label>
            {isEditing ? (
              <select
                value={editedSettings.ai_personality || 'friendly'}
                onChange={(e) => setEditedSettings({...editedSettings, ai_personality: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="friendly">Friendly</option>
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="enthusiastic">Enthusiastic</option>
              </select>
            ) : (
              <p className="text-gray-900">{currentSettings.ai_personality || 'Friendly'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (0.0 - 1.0)</label>
            {isEditing ? (
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={editedSettings.temperature || 0.0}
                onChange={(e) => setEditedSettings({...editedSettings, temperature: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{currentSettings.temperature || 0.0}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Max Duration (seconds)</label>
            {isEditing ? (
              <input
                type="number"
                min="60"
                max="7200"
                value={editedSettings.max_duration || 3600}
                onChange={(e) => setEditedSettings({...editedSettings, max_duration: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{currentSettings.max_duration || 3600} seconds</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Greeting Message</label>
            {isEditing ? (
              <textarea
                value={editedSettings.greeting_message || ''}
                onChange={(e) => setEditedSettings({...editedSettings, greeting_message: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Welcome to our restaurant! How can I help you today?"
              />
            ) : (
              <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                {currentSettings.greeting_message || 'No greeting message set'}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              System Prompt 
              <span className="text-xs text-gray-500 ml-2">(30 lines available for detailed instructions)</span>
            </label>
            {isEditing ? (
              <textarea
                value={editedSettings.system_prompt || ''}
                onChange={(e) => setEditedSettings({...editedSettings, system_prompt: e.target.value})}
                rows={30}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                placeholder="Enter detailed system prompt for the AI agent..."
              />
            ) : (
              <div className="bg-gray-50 p-4 rounded-md max-h-96 overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap text-gray-900">
                  {currentSettings.system_prompt || 'No system prompt configured'}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Voice & Audio Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Mic className="text-green-600" size={20} />
          <h4 className="text-md font-semibold">Voice & Audio</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Voice ID</label>
            {isEditing ? (
              <input
                type="text"
                value={editedSettings.voice_id || ''}
                onChange={(e) => setEditedSettings({...editedSettings, voice_id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="91fa9bcf-93c8-467c-8b29-973720e3f167"
              />
            ) : (
              <p className="text-gray-900 font-mono text-sm">{currentSettings.voice_id || 'Default'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Recording Enabled</label>
            {isEditing ? (
              <select
                value={editedSettings.recording_enabled || false}
                onChange={(e) => setEditedSettings({...editedSettings, recording_enabled: e.target.value === 'true'})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={false}>Disabled</option>
                <option value={true}>Enabled</option>
              </select>
            ) : (
              <span className={`px-2 py-1 text-xs rounded-full ${
                currentSettings.recording_enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {currentSettings.recording_enabled ? 'Enabled' : 'Disabled'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Business Configuration Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <DollarSign className="text-yellow-600" size={20} />
          <h4 className="text-md font-semibold">Business Configuration</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Order Amount</label>
            {isEditing ? (
              <input
                type="number"
                min="0"
                step="0.01"
                value={editedSettings.minimum_order_amount || 0}
                onChange={(e) => setEditedSettings({...editedSettings, minimum_order_amount: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">${(currentSettings.minimum_order_amount || 0).toFixed(2)}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Fee</label>
            {isEditing ? (
              <input
                type="number"
                min="0"
                step="0.01"
                value={editedSettings.delivery_fee || 0}
                onChange={(e) => setEditedSettings({...editedSettings, delivery_fee: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">${(currentSettings.delivery_fee || 0).toFixed(2)}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
            {isEditing ? (
              <input
                type="number"
                min="0"
                max="50"
                step="0.01"
                value={editedSettings.tax_rate || 0}
                onChange={(e) => setEditedSettings({...editedSettings, tax_rate: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-gray-900">{(currentSettings.tax_rate || 0).toFixed(2)}%</p>
            )}
          </div>
        </div>
      </div>

      {/* Language & Localization Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <Globe className="text-blue-600" size={20} />
          <h4 className="text-md font-semibold">Language & Localization</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Language</label>
            {isEditing ? (
              <select
                value={editedSettings.preferred_language || 'en'}
                onChange={(e) => setEditedSettings({...editedSettings, preferred_language: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
              </select>
            ) : (
              <p className="text-gray-900">{currentSettings.preferred_language || 'English'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Multi-language Support</label>
            {isEditing ? (
              <select
                value={editedSettings.multi_language_enabled || false}
                onChange={(e) => setEditedSettings({...editedSettings, multi_language_enabled: e.target.value === 'true'})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={false}>Disabled</option>
                <option value={true}>Enabled</option>
              </select>
            ) : (
              <span className={`px-2 py-1 text-xs rounded-full ${
                currentSettings.multi_language_enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {currentSettings.multi_language_enabled ? 'Enabled' : 'Disabled'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Toggle Settings */}
      <div className="mb-8">
        <h4 className="text-md font-semibold mb-4">Quick Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h5 className="font-medium text-blue-900">Upselling</h5>
            <p className="text-sm text-blue-700 mb-2">Enable upselling suggestions</p>
            {isEditing ? (
              <select
                value={editedSettings.upsell_enabled || true}
                onChange={(e) => setEditedSettings({...editedSettings, upsell_enabled: e.target.value === 'true'})}
                className="w-full px-2 py-1 border rounded text-sm"
              >
                <option value={true}>Enabled</option>
                <option value={false}>Disabled</option>
              </select>
            ) : (
              <span className={`px-2 py-1 text-xs rounded-full ${
                currentSettings.upsell_enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {currentSettings.upsell_enabled ? 'On' : 'Off'}
              </span>
            )}
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h5 className="font-medium text-green-900">Order Confirmation</h5>
            <p className="text-sm text-green-700 mb-2">Require order confirmation</p>
            {isEditing ? (
              <select
                value={editedSettings.order_confirmation_required || true}
                onChange={(e) => setEditedSettings({...editedSettings, order_confirmation_required: e.target.value === 'true'})}
                className="w-full px-2 py-1 border rounded text-sm"
              >
                <option value={true}>Required</option>
                <option value={false}>Optional</option>
              </select>
            ) : (
              <span className={`px-2 py-1 text-xs rounded-full ${
                currentSettings.order_confirmation_required ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {currentSettings.order_confirmation_required ? 'Required' : 'Optional'}
              </span>
            )}
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <h5 className="font-medium text-purple-900">POS Integration</h5>
            <p className="text-sm text-purple-700 mb-2">Connect to POS system</p>
            {isEditing ? (
              <select
                value={editedSettings.pos_integration_enabled || false}
                onChange={(e) => setEditedSettings({...editedSettings, pos_integration_enabled: e.target.value === 'true'})}
                className="w-full px-2 py-1 border rounded text-sm"
              >
                <option value={false}>Disabled</option>
                <option value={true}>Enabled</option>
              </select>
            ) : (
              <span className={`px-2 py-1 text-xs rounded-full ${
                currentSettings.pos_integration_enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {currentSettings.pos_integration_enabled ? 'On' : 'Off'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;