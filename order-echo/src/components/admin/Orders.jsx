import React, { useState, useEffect } from 'react';
import { ShoppingCart, Edit, Save, X, Package, DollarSign, Clock, User, MapPin } from 'lucide-react';

const Orders = ({ accountId, isEditing, onEditToggle }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editedOrders, setEditedOrders] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const orderTypeOptions = ['delivery', 'pickup', 'dine_in'];
  const orderStatusOptions = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
  const paymentStatusOptions = ['pending', 'paid', 'failed', 'refunded'];

  const orderStatusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    preparing: 'bg-orange-100 text-orange-800',
    ready: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  const paymentStatusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800'
  };

  useEffect(() => {
    fetchOrders();
  }, [accountId, currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/admin/child-tables/orders/${accountId}?page=${currentPage}&limit=20`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.items || []);
      setTotalPages(data.total_pages || 1);
      
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (order) => {
    setEditedOrders({
      ...editedOrders,
      [order.id]: { ...order }
    });
  };

  const handleSave = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const updatedOrder = editedOrders[orderId];
      
      const response = await fetch(`/api/admin/child-tables/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer_name: updatedOrder.customer_name,
          order_type: updatedOrder.order_type,
          order_status: updatedOrder.order_status,
          payment_status: updatedOrder.payment_status,
          delivery_address: updatedOrder.delivery_address,
          delivery_instructions: updatedOrder.delivery_instructions,
          estimated_delivery_time: updatedOrder.estimated_delivery_time,
          actual_delivery_time: updatedOrder.actual_delivery_time,
          special_requests: updatedOrder.special_requests
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      // Update local state
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, ...updatedOrder } : order
        )
      );

      // Remove from editing state
      const newEditedOrders = { ...editedOrders };
      delete newEditedOrders[orderId];
      setEditedOrders(newEditedOrders);

    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order');
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '$0.00';
    return `$${parseFloat(amount).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const showOrderDetailsModal = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const renderOrderRow = (order) => {
    const isEditing = editedOrders[order.id];
    const currentOrder = isEditing || order;

    return (
      <tr key={order.id} className="border-b hover:bg-gray-50">
        <td className="px-4 py-3">
          <button
            onClick={() => window.open(`/admin/orders/${order.id}`, '_blank')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {order.id}
          </button>
        </td>
        <td className="px-4 py-3">
          {isEditing ? (
            <input
              type="text"
              value={currentOrder.customer_name || ''}
              onChange={(e) => setEditedOrders({
                ...editedOrders,
                [order.id]: { ...currentOrder, customer_name: e.target.value }
              })}
              className="px-2 py-1 border rounded text-sm w-full"
            />
          ) : (
            <div className="flex items-center space-x-2">
              <User size={16} className="text-gray-400" />
              <span>{order.customer_name || 'N/A'}</span>
            </div>
          )}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center space-x-2">
            <ShoppingCart size={16} className="text-gray-400" />
            <span>{order.customer_phone}</span>
          </div>
        </td>
        <td className="px-4 py-3">
          {isEditing ? (
            <select
              value={currentOrder.order_type}
              onChange={(e) => setEditedOrders({
                ...editedOrders,
                [order.id]: { ...currentOrder, order_type: e.target.value }
              })}
              className="px-2 py-1 border rounded text-sm"
            >
              {orderTypeOptions.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
          ) : (
            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
              {order.order_type?.replace('_', ' ')}
            </span>
          )}
        </td>
        <td className="px-4 py-3">
          {isEditing ? (
            <select
              value={currentOrder.order_status}
              onChange={(e) => setEditedOrders({
                ...editedOrders,
                [order.id]: { ...currentOrder, order_status: e.target.value }
              })}
              className="px-2 py-1 border rounded text-sm"
            >
              {orderStatusOptions.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          ) : (
            <span className={`px-2 py-1 text-xs rounded-full ${orderStatusColors[order.order_status] || 'bg-gray-100 text-gray-800'}`}>
              {order.order_status}
            </span>
          )}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center space-x-2">
            <DollarSign size={16} className="text-gray-400" />
            <span>{formatCurrency(order.total_amount)}</span>
          </div>
        </td>
        <td className="px-4 py-3">
          {isEditing ? (
            <select
              value={currentOrder.payment_status}
              onChange={(e) => setEditedOrders({
                ...editedOrders,
                [order.id]: { ...currentOrder, payment_status: e.target.value }
              })}
              className="px-2 py-1 border rounded text-sm"
            >
              {paymentStatusOptions.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          ) : (
            <span className={`px-2 py-1 text-xs rounded-full ${paymentStatusColors[order.payment_status] || 'bg-gray-100 text-gray-800'}`}>
              {order.payment_status}
            </span>
          )}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center space-x-2">
            <Clock size={16} className="text-gray-400" />
            <span className="text-sm">{formatDate(order.created_at)}</span>
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="flex space-x-2">
            <button
              onClick={() => showOrderDetailsModal(order)}
              className="text-purple-600 hover:text-purple-800"
              title="View Details"
            >
              <Package size={16} />
            </button>
            {isEditing ? (
              <>
                <button
                  onClick={() => handleSave(order.id)}
                  className="text-green-600 hover:text-green-800"
                  title="Save"
                >
                  <Save size={16} />
                </button>
                <button
                  onClick={() => {
                    const newEditedOrders = { ...editedOrders };
                    delete newEditedOrders[order.id];
                    setEditedOrders(newEditedOrders);
                  }}
                  className="text-red-600 hover:text-red-800"
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <button
                onClick={() => handleEdit(order)}
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
          <ShoppingCart className="text-blue-600" size={20} />
          <h3 className="text-lg font-semibold">Orders</h3>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
            {orders.length} orders
          </span>
        </div>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div className="text-center py-8">
          <ShoppingCart className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
          <p className="text-gray-600">No orders have been placed for this restaurant.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(renderOrderRow)}
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

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Order Details</h3>
              <button
                onClick={() => setShowOrderDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Order Information */}
              <div>
                <h4 className="font-medium mb-3">Order Information</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                  <p><strong>Customer:</strong> {selectedOrder.customer_name || 'N/A'}</p>
                  <p><strong>Phone:</strong> {selectedOrder.customer_phone}</p>
                  <p><strong>Type:</strong> {selectedOrder.order_type?.replace('_', ' ')}</p>
                  <p><strong>Status:</strong> 
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${orderStatusColors[selectedOrder.order_status]}`}>
                      {selectedOrder.order_status}
                    </span>
                  </p>
                  <p><strong>Payment:</strong> 
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${paymentStatusColors[selectedOrder.payment_status]}`}>
                      {selectedOrder.payment_status}
                    </span>
                  </p>
                </div>
              </div>

              {/* Financial Information */}
              <div>
                <h4 className="font-medium mb-3">Financial Details</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Subtotal:</strong> {formatCurrency(selectedOrder.subtotal)}</p>
                  <p><strong>Tax:</strong> {formatCurrency(selectedOrder.tax_amount)}</p>
                  <p><strong>Delivery Fee:</strong> {formatCurrency(selectedOrder.delivery_fee)}</p>
                  <p><strong>Discount:</strong> {formatCurrency(selectedOrder.discount_amount)}</p>
                  <p><strong>Tip:</strong> {formatCurrency(selectedOrder.tip_amount)}</p>
                  <p className="font-medium"><strong>Total:</strong> {formatCurrency(selectedOrder.total_amount)}</p>
                </div>
              </div>

              {/* Delivery Information */}
              {selectedOrder.order_type === 'delivery' && (
                <div className="col-span-2">
                  <h4 className="font-medium mb-3">Delivery Information</h4>
                  <div className="space-y-2 text-sm">
                    <p><strong>Address:</strong> {selectedOrder.delivery_address || 'N/A'}</p>
                    <p><strong>City:</strong> {selectedOrder.delivery_city || 'N/A'}</p>
                    <p><strong>State:</strong> {selectedOrder.delivery_state || 'N/A'}</p>
                    <p><strong>ZIP:</strong> {selectedOrder.delivery_zip || 'N/A'}</p>
                    <p><strong>Instructions:</strong> {selectedOrder.delivery_instructions || 'N/A'}</p>
                    <p><strong>Estimated Time:</strong> {formatDate(selectedOrder.estimated_delivery_time)}</p>
                    <p><strong>Actual Time:</strong> {formatDate(selectedOrder.actual_delivery_time)}</p>
                  </div>
                </div>
              )}

              {/* Special Requests */}
              {selectedOrder.special_requests && (
                <div className="col-span-2">
                  <h4 className="font-medium mb-3">Special Requests</h4>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm">
                    {selectedOrder.special_requests}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="col-span-2">
                <h4 className="font-medium mb-3">Timestamps</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p><strong>Created:</strong> {formatDate(selectedOrder.created_at)}</p>
                  <p><strong>Updated:</strong> {formatDate(selectedOrder.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
