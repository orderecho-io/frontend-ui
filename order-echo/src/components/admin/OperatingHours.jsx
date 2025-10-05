import React, { useState, useEffect } from 'react';
import { Clock, Edit, Save, X, Plus, Calendar } from 'lucide-react';

const OperatingHours = ({ accountId, isEditing, onEditToggle }) => {
  const [operatingHours, setOperatingHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editedHours, setEditedHours] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHour, setNewHour] = useState({
    day_of_week: 0,
    is_open: true,
    open_time: '09:00',
    close_time: '17:00',
    break_start_time: '',
    break_end_time: ''
  });

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    fetchOperatingHours();
  }, [accountId]);

  const fetchOperatingHours = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/admin/child-tables/operating-hours/${accountId}?page=1&limit=50`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch operating hours');
      }

      const data = await response.json();
      setOperatingHours(data.items || []);
      
    } catch (error) {
      console.error('Error fetching operating hours:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hour) => {
    setEditedHours({
      ...editedHours,
      [hour.id]: { ...hour }
    });
  };

  const handleSave = async (hourId) => {
    try {
      const token = localStorage.getItem('token');
      const updatedHour = editedHours[hourId];
      
      const response = await fetch(`/api/admin/child-tables/operating-hours/${hourId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedHour)
      });

      if (!response.ok) {
        throw new Error('Failed to update operating hours');
      }

      // Update local state
      setOperatingHours(prev => 
        prev.map(hour => 
          hour.id === hourId ? { ...hour, ...updatedHour } : hour
        )
      );

      // Remove from editing state
      const newEditedHours = { ...editedHours };
      delete newEditedHours[hourId];
      setEditedHours(newEditedHours);

    } catch (error) {
      console.error('Error updating operating hours:', error);
      alert('Failed to update operating hours');
    }
  };

  const handleAddNew = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/admin/child-tables/operating-hours', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...newHour,
          account_id: accountId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create operating hours');
      }

      // Refresh the list
      await fetchOperatingHours();
      
      // Reset form
      setNewHour({
        day_of_week: 0,
        is_open: true,
        open_time: '09:00',
        close_time: '17:00',
        break_start_time: '',
        break_end_time: ''
      });
      setShowAddForm(false);

    } catch (error) {
      console.error('Error creating operating hours:', error);
      alert('Failed to create operating hours');
    }
  };

  const renderHourRow = (hour) => {
    const isEditing = editedHours[hour.id];
    const currentHour = isEditing || hour;

    return (
      <tr key={hour.id} className="border-b hover:bg-gray-50">
        <td className="px-4 py-3">
          <button
            onClick={() => window.open(`/admin/operating-hours/${hour.id}`, '_blank')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {hour.id}
          </button>
        </td>
        <td className="px-4 py-3">
          {dayNames[currentHour.day_of_week]}
        </td>
        <td className="px-4 py-3">
          {isEditing ? (
            <select
              value={currentHour.is_open}
              onChange={(e) => setEditedHours({
                ...editedHours,
                [hour.id]: { ...currentHour, is_open: e.target.value === 'true' }
              })}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value={true}>Open</option>
              <option value={false}>Closed</option>
            </select>
          ) : (
            <span className={`px-2 py-1 text-xs rounded-full ${
              currentHour.is_open ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {currentHour.is_open ? 'Open' : 'Closed'}
            </span>
          )}
        </td>
        <td className="px-4 py-3">
          {isEditing ? (
            <input
              type="time"
              value={currentHour.open_time || ''}
              onChange={(e) => setEditedHours({
                ...editedHours,
                [hour.id]: { ...currentHour, open_time: e.target.value }
              })}
              className="px-2 py-1 border rounded text-sm"
            />
          ) : (
            currentHour.open_time || 'N/A'
          )}
        </td>
        <td className="px-4 py-3">
          {isEditing ? (
            <input
              type="time"
              value={currentHour.close_time || ''}
              onChange={(e) => setEditedHours({
                ...editedHours,
                [hour.id]: { ...currentHour, close_time: e.target.value }
              })}
              className="px-2 py-1 border rounded text-sm"
            />
          ) : (
            currentHour.close_time || 'N/A'
          )}
        </td>
        <td className="px-4 py-3">
          {isEditing ? (
            <input
              type="time"
              value={currentHour.break_start_time || ''}
              onChange={(e) => setEditedHours({
                ...editedHours,
                [hour.id]: { ...currentHour, break_start_time: e.target.value }
              })}
              className="px-2 py-1 border rounded text-sm"
            />
          ) : (
            currentHour.break_start_time || 'N/A'
          )}
        </td>
        <td className="px-4 py-3">
          {isEditing ? (
            <input
              type="time"
              value={currentHour.break_end_time || ''}
              onChange={(e) => setEditedHours({
                ...editedHours,
                [hour.id]: { ...currentHour, break_end_time: e.target.value }
              })}
              className="px-2 py-1 border rounded text-sm"
            />
          ) : (
            currentHour.break_end_time || 'N/A'
          )}
        </td>
        <td className="px-4 py-3">
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => handleSave(hour.id)}
                  className="text-green-600 hover:text-green-800"
                  title="Save"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={() => {
                    const newEditedHours = { ...editedHours };
                    delete newEditedHours[hour.id];
                    setEditedHours(newEditedHours);
                  }}
                  className="text-red-600 hover:text-red-800"
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <button
                onClick={() => handleEdit(hour)}
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
          <Clock className="text-blue-600" size={20} />
          <h3 className="text-lg font-semibold">Operating Hours</h3>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
            {operatingHours.length} days configured
          </span>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          <span>Add Hours</span>
        </button>
      </div>

      {/* Add New Form */}
      {showAddForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 className="font-medium mb-4">Add New Operating Hours</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Day</label>
              <select
                value={newHour.day_of_week}
                onChange={(e) => setNewHour({...newHour, day_of_week: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {dayNames.map((day, index) => (
                  <option key={index} value={index}>{day}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={newHour.is_open}
                onChange={(e) => setNewHour({...newHour, is_open: e.target.value === 'true'})}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value={true}>Open</option>
                <option value={false}>Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Open Time</label>
              <input
                type="time"
                value={newHour.open_time}
                onChange={(e) => setNewHour({...newHour, open_time: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Close Time</label>
              <input
                type="time"
                value={newHour.close_time}
                onChange={(e) => setNewHour({...newHour, close_time: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
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
              Add Hours
            </button>
          </div>
        </div>
      )}

      {/* Operating Hours Table */}
      {operatingHours.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Operating Hours Found</h3>
          <p className="text-gray-600">No operating hours are configured for this restaurant.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Open Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Close Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Break Start</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Break End</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {operatingHours.map(renderHourRow)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OperatingHours;
