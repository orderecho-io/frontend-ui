import React, { useState, useEffect } from 'react';
import { Phone, Edit, Save, X, Calendar, Clock, User, FileText, Star } from 'lucide-react';

const CallHistory = ({ accountId, isEditing, onEditToggle }) => {
  const [callHistory, setCallHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editedCalls, setEditedCalls] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCall, setSelectedCall] = useState(null);
  const [showTranscript, setShowTranscript] = useState(false);

  const callStatusOptions = ['completed', 'abandoned', 'failed', 'in_progress'];
  const callStatusColors = {
    completed: 'bg-green-100 text-green-800',
    abandoned: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800',
    in_progress: 'bg-blue-100 text-blue-800'
  };

  useEffect(() => {
    fetchCallHistory();
  }, [accountId, currentPage]);

  const fetchCallHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/admin/child-tables/call-history/${accountId}?page=${currentPage}&limit=20`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch call history');
      }

      const data = await response.json();
      setCallHistory(data.items || []);
      setTotalPages(data.total_pages || 1);
      
    } catch (error) {
      console.error('Error fetching call history:', error);
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
      
      const response = await fetch(`/api/admin/child-tables/call-history/${callId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          call_status: updatedCall.call_status,
          customer_satisfaction_rating: updatedCall.customer_satisfaction_rating,
          order_value: updatedCall.order_value,
          upsell_success: updatedCall.upsell_success,
          upsell_amount: updatedCall.upsell_amount,
          short_summary: updatedCall.short_summary
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update call history');
      }

      // Update local state
      setCallHistory(prev => 
        prev.map(call => 
          call.id === callId ? { ...call, ...updatedCall } : call
        )
      );

      // Remove from editing state
      const newEditedCalls = { ...editedCalls };
      delete newEditedCalls[callId];
      setEditedCalls(newEditedCalls);

    } catch (error) {
      console.error('Error updating call history:', error);
      alert('Failed to update call history');
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

  const formatCurrency = (amount) => {
    if (!amount) return '$0.00';
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const showTranscriptModal = (call) => {
    setSelectedCall(call);
    setShowTranscript(true);
  };

  const renderCallRow = (call) => {
    const isEditing = editedCalls[call.id];
    const currentCall = isEditing || call;

    return (
      <tr key={call.id} className="border-b hover:bg-gray-50">
        <td className="px-4 py-3">
          <button
            onClick={() => window.open(`/admin/call-history/${call.id}`, '_blank')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {call.id}
          </button>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center space-x-2">
            <Phone size={16} className="text-gray-400" />
            <span>{call.caller_phone}</span>
          </div>
        </td>
        <td className="px-4 py-3">
          {isEditing ? (
            <select
              value={currentCall.call_status}
              onChange={(e) => setEditedCalls({
                ...editedCalls,
                [call.id]: { ...currentCall, call_status: e.target.value }
              })}
              className="px-2 py-1 border rounded text-sm"
            >
              {callStatusOptions.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          ) : (
            <span className={`px-2 py-1 text-xs rounded-full ${callStatusColors[currentCall.call_status] || 'bg-gray-100 text-gray-800'}`}>
              {currentCall.call_status}
            </span>
          )}
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
            <input
              type="number"
              min="0"
              max="999999.99"
              step="0.01"
              value={currentCall.order_value || ''}
              onChange={(e) => setEditedCalls({
                ...editedCalls,
                [call.id]: { ...currentCall, order_value: e.target.value }
              })}
              className="px-2 py-1 border rounded text-sm w-24"
            />
          ) : (
            formatCurrency(call.order_value)
          )}
        </td>
        <td className="px-4 py-3">
          {isEditing ? (
            <select
              value={currentCall.customer_satisfaction_rating || ''}
              onChange={(e) => setEditedCalls({
                ...editedCalls,
                [call.id]: { ...currentCall, customer_satisfaction_rating: e.target.value }
              })}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value="">N/A</option>
              {[1, 2, 3, 4, 5].map(rating => (
                <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
              ))}
            </select>
          ) : (
            call.customer_satisfaction_rating ? (
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < call.customer_satisfaction_rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                  />
                ))}
              </div>
            ) : (
              <span className="text-gray-400">N/A</span>
            )
          )}
        </td>
        <td className="px-4 py-3">
          <div className="flex space-x-2">
            {call.conversation_transcript && (
              <button
                onClick={() => showTranscriptModal(call)}
                className="text-purple-600 hover:text-purple-800"
                title="View Transcript"
              >
                <FileText size={16} />
              </button>
            )}
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
          <Phone className="text-blue-600" size={20} />
          <h3 className="text-lg font-semibold">Call History</h3>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
            {callHistory.length} calls
          </span>
        </div>
      </div>

      {/* Call History Table */}
      {callHistory.length === 0 ? (
        <div className="text-center py-8">
          <Phone className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Call History Found</h3>
          <p className="text-gray-600">No calls have been recorded for this restaurant.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Caller</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {callHistory.map(renderCallRow)}
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

      {/* Transcript Modal */}
      {showTranscript && selectedCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Call Transcript</h3>
              <button
                onClick={() => setShowTranscript(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mb-4">
              <p><strong>Call ID:</strong> {selectedCall.id}</p>
              <p><strong>Caller:</strong> {selectedCall.caller_phone}</p>
              <p><strong>Date:</strong> {formatDate(selectedCall.call_start_time)}</p>
              <p><strong>Duration:</strong> {formatDuration(selectedCall.call_duration)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Transcript:</h4>
              <div className="whitespace-pre-wrap text-sm">
                {selectedCall.conversation_transcript || 'No transcript available'}
              </div>
            </div>
            {selectedCall.short_summary && (
              <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Summary:</h4>
                <p className="text-sm">{selectedCall.short_summary}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CallHistory;
