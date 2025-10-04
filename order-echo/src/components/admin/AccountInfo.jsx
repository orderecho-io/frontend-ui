import React, { useState } from 'react';

const AccountInfo = ({ accountDetails, isEditing, editedAccount, setEditedAccount }) => {
  if (!accountDetails?.user) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Account Found</h3>
        <p className="text-gray-600">This user does not have an associated restaurant account.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* User Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4">User Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            {isEditing ? (
              <input
                type="text"
                value={editedAccount.first_name || ''}
                onChange={(e) => setEditedAccount({...editedAccount, first_name: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{accountDetails.user.first_name}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            {isEditing ? (
              <input
                type="text"
                value={editedAccount.last_name || ''}
                onChange={(e) => setEditedAccount({...editedAccount, last_name: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{accountDetails.user.last_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-sm text-gray-900">{accountDetails.user.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            {isEditing ? (
              <input
                type="text"
                value={editedAccount.phone || ''}
                onChange={(e) => setEditedAccount({...editedAccount, phone: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="mt-1 text-sm text-gray-900">{accountDetails.user.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            {isEditing ? (
              <select
                value={editedAccount.role || ''}
                onChange={(e) => setEditedAccount({...editedAccount, role: e.target.value})}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
              </select>
            ) : (
              <p className="mt-1 text-sm text-gray-900">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  accountDetails.user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                  accountDetails.user.role === 'admin' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {accountDetails.user.role}
                </span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <p className="mt-1 text-sm text-gray-900">
              <span className={`px-2 py-1 text-xs rounded-full ${
                accountDetails.user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {accountDetails.user.is_active ? 'Active' : 'Inactive'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Restaurant Information */}
      {accountDetails.user.account_id && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Restaurant Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Restaurant Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedAccount.restaurant_name || ''}
                  onChange={(e) => setEditedAccount({...editedAccount, restaurant_name: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{accountDetails.user.restaurant_name}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Restaurant Phone</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedAccount.restaurant_phone || ''}
                  onChange={(e) => setEditedAccount({...editedAccount, restaurant_phone: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{accountDetails.user.restaurant_phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              {isEditing ? (
                <textarea
                  value={editedAccount.address || ''}
                  onChange={(e) => setEditedAccount({...editedAccount, address: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900">{accountDetails.user.address}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Cuisine Type</label>
              {isEditing ? (
                <select
                  value={editedAccount.cuisine_type || ''}
                  onChange={(e) => setEditedAccount({...editedAccount, cuisine_type: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select cuisine type</option>
                  <option value="american">American</option>
                  <option value="italian">Italian</option>
                  <option value="chinese">Chinese</option>
                  <option value="mexican">Mexican</option>
                  <option value="indian">Indian</option>
                  <option value="japanese">Japanese</option>
                  <option value="thai">Thai</option>
                  <option value="mediterranean">Mediterranean</option>
                  <option value="french">French</option>
                  <option value="pizza">Pizza</option>
                  <option value="burger">Burger</option>
                  <option value="seafood">Seafood</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <p className="mt-1 text-sm text-gray-900">{accountDetails.user.cuisine_type}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Restaurant Type</label>
              {isEditing ? (
                <select
                  value={editedAccount.restaurant_type || ''}
                  onChange={(e) => setEditedAccount({...editedAccount, restaurant_type: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select restaurant type</option>
                  <option value="fast_food">Fast Food</option>
                  <option value="casual_dining">Casual Dining</option>
                  <option value="fine_dining">Fine Dining</option>
                  <option value="cafe">Cafe</option>
                  <option value="bakery">Bakery</option>
                  <option value="food_truck">Food Truck</option>
                  <option value="catering">Catering</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <p className="mt-1 text-sm text-gray-900">{accountDetails.user.restaurant_type}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Subscription Plan</label>
              {isEditing ? (
                <select
                  value={editedAccount.subscription_plan || ''}
                  onChange={(e) => setEditedAccount({...editedAccount, subscription_plan: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="free">Free</option>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              ) : (
                <p className="mt-1 text-sm text-gray-900">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    accountDetails.user.subscription_plan === 'enterprise' ? 'bg-purple-100 text-purple-800' :
                    accountDetails.user.subscription_plan === 'premium' ? 'bg-blue-100 text-blue-800' :
                    accountDetails.user.subscription_plan === 'basic' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {accountDetails.user.subscription_plan}
                  </span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Subscription Status</label>
              {isEditing ? (
                <select
                  value={editedAccount.subscription_status || ''}
                  onChange={(e) => setEditedAccount({...editedAccount, subscription_status: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="trial">Trial</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              ) : (
                <p className="mt-1 text-sm text-gray-900">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    accountDetails.user.subscription_status === 'active' ? 'bg-green-100 text-green-800' :
                    accountDetails.user.subscription_status === 'trial' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {accountDetails.user.subscription_status}
                  </span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Method</label>
              {isEditing ? (
                <select
                  value={editedAccount.payment_method || ''}
                  onChange={(e) => setEditedAccount({...editedAccount, payment_method: e.target.value})}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select payment method</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <p className="mt-1 text-sm text-gray-900">{accountDetails.user.payment_method || 'Not set'}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountInfo;
