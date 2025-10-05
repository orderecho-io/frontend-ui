import React, { useState, useEffect } from 'react';
import { Database, Edit, Save, X, Plus, Settings2, Code } from 'lucide-react';

const TableConfiguration = ({ accountId, isEditing, onEditToggle }) => {
  const [configurations, setConfigurations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editedConfigs, setEditedConfigs] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newConfig, setNewConfig] = useState({
    table_key: '',
    table_value: {},
    description: '',
    is_system_config: false
  });

  useEffect(() => {
    fetchConfigurations();
  }, [accountId]);

  const fetchConfigurations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/admin/child-tables/table-configuration/${accountId}?page=1&limit=50`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch table configurations');
      }

      const data = await response.json();
      setConfigurations(data.items || []);
      
    } catch (error) {
      console.error('Error fetching table configurations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (config) => {
    setEditedConfigs({
      ...editedConfigs,
      [config.id]: { 
        ...config,
        table_value: typeof config.table_value === 'string' 
          ? config.table_value 
          : JSON.stringify(config.table_value, null, 2)
      }
    });
  };

  const handleSave = async (configId) => {
    try {
      const token = localStorage.getItem('token');
      const updatedConfig = editedConfigs[configId];
      
      // Parse JSON value
      let parsedValue;
      try {
        parsedValue = JSON.parse(updatedConfig.table_value);
      } catch (e) {
        alert('Invalid JSON format in table value');
        return;
      }

      const response = await fetch(`/api/admin/child-tables/table-configuration/${configId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          table_key: updatedConfig.table_key,
          table_value: parsedValue,
          description: updatedConfig.description,
          is_system_config: updatedConfig.is_system_config
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update table configuration');
      }

      // Update local state
      setConfigurations(prev => 
        prev.map(config => 
          config.id === configId ? { ...config, ...updatedConfig, table_value: parsedValue } : config
        )
      );

      // Remove from editing state
      const newEditedConfigs = { ...editedConfigs };
      delete newEditedConfigs[configId];
      setEditedConfigs(newEditedConfigs);

    } catch (error) {
      console.error('Error updating table configuration:', error);
      alert('Failed to update table configuration');
    }
  };

  const handleAddNew = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Parse JSON value
      let parsedValue;
      try {
        parsedValue = typeof newConfig.table_value === 'string' 
          ? JSON.parse(newConfig.table_value)
          : newConfig.table_value;
      } catch (e) {
        alert('Invalid JSON format in table value');
        return;
      }

      const response = await fetch('/api/admin/child-tables/table-configuration', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newConfig,
          table_value: parsedValue,
          account_id: accountId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create table configuration');
      }

      // Refresh the list
      await fetchConfigurations();
      
      // Reset form
      setNewConfig({
        table_key: '',
        table_value: {},
        description: '',
        is_system_config: false
      });
      setShowAddForm(false);

    } catch (error) {
      console.error('Error creating table configuration:', error);
      alert('Failed to create table configuration');
    }
  };

  const formatJsonValue = (value) => {
    try {
      return JSON.stringify(value, null, 2);
    } catch (e) {
      return String(value);
    }
  };

  const renderConfigRow = (config) => {
    const isEditing = editedConfigs[config.id];
    const currentConfig = isEditing || config;

    return (
      <tr key={config.id} className="border-b hover:bg-gray-50">
        <td className="px-4 py-3">
          <button
            onClick={() => window.open(`/admin/table-configuration/${config.id}`, '_blank')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {config.id}
          </button>
        </td>
        <td className="px-4 py-3">
          {isEditing ? (
            <input
              type="text"
              value={currentConfig.table_key || ''}
              onChange={(e) => setEditedConfigs({
                ...editedConfigs,
                [config.id]: { ...currentConfig, table_key: e.target.value }
              })}
              className="px-2 py-1 border rounded text-sm w-full"
            />
          ) : (
            <span className="font-mono text-sm">{config.table_key}</span>
          )}
        </td>
        <td className="px-4 py-3">
          {isEditing ? (
            <textarea
              value={currentConfig.table_value || ''}
              onChange={(e) => setEditedConfigs({
                ...editedConfigs,
                [config.id]: { ...currentConfig, table_value: e.target.value }
              })}
              rows={4}
              className="px-2 py-1 border rounded text-sm w-full font-mono"
            />
          ) : (
            <div className="max-w-xs">
              <pre className="text-xs bg-gray-50 p-2 rounded overflow-x-auto">
                {formatJsonValue(config.table_value)}
              </pre>
            </div>
          )}
        </td>
        <td className="px-4 py-3">
          {isEditing ? (
            <input
              type="text"
              value={currentConfig.description || ''}
              onChange={(e) => setEditedConfigs({
                ...editedConfigs,
                [config.id]: { ...currentConfig, description: e.target.value }
              })}
              className="px-2 py-1 border rounded text-sm w-full"
            />
          ) : (
            <span className="text-sm">{config.description || 'N/A'}</span>
          )}
        </td>
        <td className="px-4 py-3">
          {isEditing ? (
            <select
              value={currentConfig.is_system_config}
              onChange={(e) => setEditedConfigs({
                ...editedConfigs,
                [config.id]: { ...currentConfig, is_system_config: e.target.value === 'true' }
              })}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value={false}>User Config</option>
              <option value={true}>System Config</option>
            </select>
          ) : (
            <span className={`px-2 py-1 text-xs rounded-full ${
              config.is_system_config ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {config.is_system_config ? 'System' : 'User'}
            </span>
          )}
        </td>
        <td className="px-4 py-3">
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => handleSave(config.id)}
                  className="text-green-600 hover:text-green-800"
                  title="Save"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={() => {
                    const newEditedConfigs = { ...editedConfigs };
                    delete newEditedConfigs[config.id];
                    setEditedConfigs(newEditedConfigs);
                  }}
                  className="text-red-600 hover:text-red-800"
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <button
                onClick={() => handleEdit(config)}
                className="text-blue-600 hover:text-blue-800"
                title="Edit"
              >
                <Edit size={16} />
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Database className="text-blue-600" size={20} />
          <h3 className="text-lg font-semibold">Table Configuration</h3>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
            {configurations.length} configs
          </span>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          <span>Add Configuration</span>
        </button>
      </div>

      {/* Add New Form */}
      {showAddForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="font-medium mb-4">Add New Configuration</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Table Key</label>
              <input
                type="text"
                value={newConfig.table_key}
                onChange={(e) => setNewConfig({...newConfig, table_key: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="config_key"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={newConfig.is_system_config}
                onChange={(e) => setNewConfig({...newConfig, is_system_config: e.target.value === 'true'})}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value={false}>User Configuration</option>
                <option value={true}>System Configuration</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <input
                type="text"
                value={newConfig.description}
                onChange={(e) => setNewConfig({...newConfig, description: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Configuration description"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">
                Table Value (JSON)
                <span className="text-xs text-gray-500 ml-2">Enter valid JSON</span>
              </label>
              <textarea
                value={typeof newConfig.table_value === 'string' ? newConfig.table_value : JSON.stringify(newConfig.table_value, null, 2)}
                onChange={(e) => setNewConfig({...newConfig, table_value: e.target.value})}
                rows={6}
                className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                placeholder='{"key": "value", "enabled": true}'
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddNew}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Configuration
            </button>
          </div>
        </div>
      )}

      {/* Configurations Table */}
      {configurations.length === 0 ? (
        <div className="text-center py-8">
          <Settings2 className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Configurations Found</h3>
          <p className="text-gray-600">No table configurations are set up for this restaurant.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {configurations.map(renderConfigRow)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TableConfiguration;
