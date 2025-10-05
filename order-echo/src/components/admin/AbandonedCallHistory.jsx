import React, { useState, useEffect } from 'react';
import { PhoneOff, Edit, Save, X, Clock, User, AlertTriangle } from 'lucide-react';

const AbandonedCallHistory = ({ accountId, isEditing, onEditToggle }) => {
  const [abandonedCalls, setAbandonedCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editedCalls, setEditedCalls] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const abandonReasonOptions = [
    'customer_hangup',
    'system_timeout',
    'technical_issue',
    'agent_unavailable',
    'call_quality_issue',
    'customer_request',
    'other'
  ];

  const abandonReasonColors = {
    customer_hangup: 'bg-yellow-100 text-yellow-800',
    system_timeout: 'bg-red-100 text-red-800',
    technical_issue: 'bg-orange-100 text-orange-800',
    agent_unavailable: 'bg-purple-100 text-purple-800',
    call_quality_issue: 'bg-pink-100 text-pink-800',
    customer_request: 'bg-blue-100 text-blue-800',
    other: 'bg-gray-100 text-gray-800'
  };

  useEffect(() => {
    fetchAbandonedCalls();
  }, [accountId, currentPage]);

  const fetchAbandonedCalls = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/admin/child-tables/abandoned-call-history/${accountId}?page=${currentPage}&limit=20`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch abandoned call history');
      }

      const data = await response.json();
      setAbandonedCalls(data.items || []);
      setTotalPages(data.total_pages || 1);
      
    } catch (error) {
      console.error('Error fetching abandoned call history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (call) => {
    setEditedCalls({
      ...editedCalls,
      [call.id]: { ...call }
    });
  };

  const handleSave = async (callId) => {
    try {
      const token = localStorage.getItem('token');
      const updatedCall = editedCalls[callId];
      
      const response = await fetch(`/api/admin/child-tables/abandoned-call-history/${callId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          abandon_reason: updatedCall.abandon_reason,
          follow_up_required: updatedCall.follow_up_required,
          follow_up_notes: updatedCall.follow_up_notes,
          customer_callback_requested: updatedCall.customer_callback_requested
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update abandoned call history');
      }

      // Update local state
      setAbandonedCalls(prev => 
        prev.map(call => 
          call.id === callId ? { ...call, ...updatedCall } : call
        )
      );

      // Remove from editing state
      const newEditedCalls = { ...editedCalls };
      delete newEditedCalls[callId];
      setEditedCalls(newEditedCalls);

    } catch (error) {
      console.error('Error updating abandoned call history:', error);
      alert('Failed to update abandoned call history');
    }
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const formatReasonLabel = (reason) => {
    return reason?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown';
  };

  const renderCallRow = (call) => {
    const isEditing = editedCalls[call.id];
    const currentCall = isEditing || call;

    return (
      <tr key={call.id} className="border-b hover:bg-gray-50">
        <td className="px-4 py-3">
          <button
            onClick={() => window.open(`/admin/abandoned-call-history/${call.id}`, '_blank')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {call.id}
          </button>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center space-x-2">
            <User size={16} className="text-gray-400" />
            <span>{call.caller_phone}</span>
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center space-x-2">
            <Clock size={16} className="text-gray-400" />
            <span>{formatDuration(call.call_duration)}</span>
          </div>
        </td>
        <td className="px-4 py-3">
          {formatDate(call.call_start_time)}
        </td>
        <td className="px-4 py-3">
          {isEditing ? (
            <select
              value={currentCall.abandon_reason || ''}
              onChange={(e) => setEditedCalls({
                ...editedCalls,
                [call.id]: { ...currentCall, abandon_reason: e.target.value }
              })}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="">Select reason...</option>
              {abandonReasonOptions.map(reason => (
                <option key={reason} value={reason}>
                  {formatReasonLabel(reason)}
                </option>
              ))}
            </select>
          ) : (
            <span className={`px-2 py-1 text-xs rounded-full ${
              abandonReasonColors[call.abandon_reason] || 'bg-gray-100 text-gray-800'
            }`}>
              {formatReasonLabel(call.abandon_reason)}
            </span>
          )}
        </td>
        <td className="px-4 py-3">
          {isEditing ? (
            <select
              value={currentCall.follow_up_required || false}
              onChange={(e) => setEditedCalls({
                ...editedCalls,
                [call.id]: { ...currentCall, follow_up_required: e.target.value === 'true' }
              })}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value={false}>No</option>
              <option value={true}>Yes</option>
            </select>
          ) : (
            <span className={`px-2 py-1 text-xs rounded-full ${
              call.follow_up_required ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
            }`}>
              {call.follow_up_required ? 'Required' : 'Not Required'}
            </span>
          )}
        </td>
        <td className="px-4 py-3">
          {isEditing ? (
            <select
              value={currentCall.customer_callback_requested || false}
              onChange={(e) => setEditedCalls({
                ...editedCalls,
                [call.id]: { ...currentCall, customer_callback_requested: e.target.value === 'true' }
              })}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value={false}>No</option>
              <option value={true}>Yes</option>
            </select>
          ) : (
            <span className={`px-2 py-1 text-xs rounded-full ${
              call.customer_callback_requested ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {call.customer_callback_requested ? 'Requested' : 'Not Requested'}
            </span>
          )}
        </td>
        <td className="px-4 py-3">
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => handleSave(call.id)}
                  className="text-green-600 hover:text-green-800"
                  title="Save"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={() => {
                    const newEditedCalls = { ...editedCalls };
                    delete newEditedCalls[call.id];
                    setEditedCalls(newEditedCalls);
                  }}
                  className="text-red-600 hover:text-red-800"
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <button
                onClick={() => handleEdit(call)}
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
          <PhoneOff className="text-red-600" size={20} />
          <h3 className="text-lg font-semibold">Abandoned Call History</h3>
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
            {abandonedCalls.length} abandoned calls
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="text-red-600" size={20} />
            <div>
              <p className="text-sm text-red-700">Total Abandoned</p>
              <p className="text-2xl font-bold text-red-900">{abandonedCalls.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <Clock className="text-orange-600" size={20} />
            <div>
              <p className="text-sm text-orange-700">Follow-up Required</p>
              <p className="text-2xl font-bold text-orange-900">
                {abandonedCalls.filter(call => call.follow_up_required).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <PhoneOff className="text-blue-600" size={20} />
            <div>
              <p className="text-sm text-blue-700">Callback Requested</p>
              <p className="text-2xl font-bold text-blue-900">
                {abandonedCalls.filter(call => call.customer_callback_requested).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <User className="text-purple-600" size={20} />
            <div>
              <p className="text-sm text-purple-700">Avg Duration</p>
              <p className="text-2xl font-bold text-purple-900">
                {abandonedCalls.length > 0 
                  ? formatDuration(Math.round(abandonedCalls.reduce((sum, call) => sum + (call.call_duration || 0), 0) / abandonedCalls.length))
                  : '0:00'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Abandoned Calls Table */}
      {abandonedCalls.length === 0 ? (
        <div className="text-center py-8">
          <PhoneOff className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Abandoned Calls Found</h3>
          <p className="text-gray-600">No abandoned calls have been recorded for this restaurant.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Caller</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Follow-up</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Callback</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {abandonedCalls.map(renderCallRow)}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Follow-up Notes Section */}
      {abandonedCalls.some(call => editedCalls[call.id]) && (
        <div className="mt-8">
          <h4 className="text-md font-semibold mb-4">Follow-up Notes</h4>
          {Object.entries(editedCalls).map(([callId, call]) => (
            <div key={callId} className="bg-gray-50 p-4 rounded-lg mb-4">
              <h5 className="font-medium mb-2">Call ID: {callId}</h5>
              <textarea
                value={call.follow_up_notes || ''}
                onChange={(e) => setEditedCalls({
                  ...editedCalls,
                  [callId]: { ...call, follow_up_notes: e.target.value }
                })}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Add follow-up notes..."
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AbandonedCallHistory;
