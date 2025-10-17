import React, { useState } from 'react';
import { Plus, Save, X, User, Building, Settings, Clock } from 'lucide-react';
import { toast } from 'sonner';

const AddAccount = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: User & Account, 2: Settings, 3: Operating Hours
  const [errors, setErrors] = useState({});
  
  // Helper function to format phone to E.164
  const formatPhoneE164 = (phone) => {
    if (!phone) return '';
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    // If it doesn't start with +, add it
    if (!phone.startsWith('+')) {
      return `+${digits}`;
    }
    return `+${digits}`;
  };
  
  const [formData, setFormData] = useState({
    // User Info
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    role: 'user',
    
    // Account Info
    restaurant_name: '',
    business_phone: '',
    business_email: '',
    business_address: '',
    website_url: '',
    cuisine_type: '',
    restaurant_type: '',
    timezone: 'America/New_York',
    subscription_plan: 'basic',
    subscription_status: 'trial',
    billing_cycle: 'monthly',
    
    // Account Settings
    agent_name: 'Assistant',
    agent_id: 'dcb81b9a-24e5-4eb3-a727-9e83562dacf9',
    ai_personality: 'friendly',
    greeting_message: '',
    system_prompt: '',
    temperature: 0.0,
    max_duration: 3600,
    voice_id: '91fa9bcf-93c8-467c-8b29-973720e3f167',
    recording_enabled: false,
    tax_rate: 0.0,
    delivery_fee: 0.0,
    minimum_order_amount: 0.0,
    upsell_enabled: true,
    multi_language_enabled: false,
    preferred_language: 'en',
    order_confirmation_required: true,
    
    // Operating Hours (array of 7 days)
    operating_hours: [
      { day_of_week: 0, is_open: true, open_time: '09:00', close_time: '22:00' }, // Sunday
      { day_of_week: 1, is_open: true, open_time: '09:00', close_time: '22:00' }, // Monday
      { day_of_week: 2, is_open: true, open_time: '09:00', close_time: '22:00' }, // Tuesday
      { day_of_week: 3, is_open: true, open_time: '09:00', close_time: '22:00' }, // Wednesday
      { day_of_week: 4, is_open: true, open_time: '09:00', close_time: '22:00' }, // Thursday
      { day_of_week: 5, is_open: true, open_time: '09:00', close_time: '22:00' }, // Friday
      { day_of_week: 6, is_open: true, open_time: '09:00', close_time: '22:00' }, // Saturday
    ]
  });
  
  const [loading, setLoading] = useState(false);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    // User validation
    if (!formData.first_name?.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name?.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    // Restaurant validation
    if (!formData.restaurant_name?.trim()) newErrors.restaurant_name = 'Restaurant name is required';
    if (!formData.business_phone?.trim()) {
      newErrors.business_phone = 'Business phone is required';
    } else {
      const digits = formData.business_phone.replace(/\D/g, '');
      if (digits.length < 10 || digits.length > 15) {
        newErrors.business_phone = 'Phone number must be 10-15 digits (e.g., +13062160665 or 3062160665)';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (formData.temperature < 0 || formData.temperature > 1) {
      newErrors.temperature = 'Temperature must be between 0 and 1';
    }
    if (formData.tax_rate < 0 || formData.tax_rate > 50) {
      newErrors.tax_rate = 'Tax rate must be between 0 and 50';
    }
    if (formData.delivery_fee < 0) {
      newErrors.delivery_fee = 'Delivery fee cannot be negative';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    // Clear previous errors
    setErrors({});
    
    let isValid = false;
    
    if (step === 1) {
      isValid = validateStep1();
    } else if (step === 2) {
      isValid = validateStep2();
    } else {
      isValid = true;
    }
    
    if (isValid) {
      setStep(step + 1);
    }
  };

  const handleOperatingHourChange = (dayIndex, field, value) => {
    const updatedHours = [...formData.operating_hours];
    updatedHours[dayIndex] = { ...updatedHours[dayIndex], [field]: value };
    setFormData({ ...formData, operating_hours: updatedHours });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('Starting account creation...');
      console.log('Form data:', formData);
      
      // Validate required fields
      if (!formData.email || !formData.password || !formData.first_name || !formData.last_name || !formData.restaurant_name || !formData.business_phone) {
        throw new Error('Please fill in all required fields (marked with *)');
      }
      
      // Step 1: Create user and account
      console.log('Step 1: Creating user and account...');
      const signupPayload = {
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone ? formatPhoneE164(formData.phone) : undefined,
        role: formData.role,
        restaurant_name: formData.restaurant_name,
        phone_number: formatPhoneE164(formData.business_phone),
        address: formData.business_address,
        cuisine_type: formData.cuisine_type,
        restaurant_type: formData.restaurant_type
      };
      
      console.log('Signup payload:', signupPayload);
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signupPayload)
      });

      console.log('Signup response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Signup error response:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          throw new Error(errorText || 'Failed to create account');
        }
        throw new Error(errorData.detail || errorData.message || 'Failed to create account');
      }

      const result = await response.json();
      console.log('Signup result:', result);
      
      const accountId = result.user?.account_id || result.account_id;
      
      if (!accountId) {
        console.error('No account ID in response:', result);
        throw new Error('Account created but no account ID returned');
      }

      console.log('✅ Account created with ID:', accountId);

      // Step 2: Update account with additional fields
      console.log('Step 2: Updating account with additional fields...');
      const updateResponse = await fetch(`/api/admin/accounts/${accountId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          business_email: formData.business_email,
          website_url: formData.website_url,
          timezone: formData.timezone,
          subscription_plan: formData.subscription_plan,
          subscription_status: formData.subscription_status,
          billing_cycle: formData.billing_cycle
        })
      });
      
      if (!updateResponse.ok) {
        console.warn('Failed to update account fields, but continuing...');
      } else {
        console.log('✅ Account fields updated');
      }

      // Step 3: Create or update account settings
      console.log('Step 3: Creating account settings...');
      const settingsPayload = {
        account_id: accountId,
        agent_name: formData.agent_name,
        agent_id: formData.agent_id,
        ai_personality: formData.ai_personality,
        greeting_message: formData.greeting_message || '',
        system_prompt: formData.system_prompt || '',
        temperature: parseFloat(formData.temperature),
        max_duration: parseInt(formData.max_duration),
        voice_id: formData.voice_id,
        recording_enabled: formData.recording_enabled,
        tax_rate: parseFloat(formData.tax_rate),
        delivery_fee: parseFloat(formData.delivery_fee),
        minimum_order_amount: parseFloat(formData.minimum_order_amount),
        upsell_enabled: formData.upsell_enabled,
        multi_language_enabled: formData.multi_language_enabled,
        preferred_language: formData.preferred_language,
        order_confirmation_required: formData.order_confirmation_required
      };
      
      console.log('Settings payload:', settingsPayload);
      
      const settingsResponse = await fetch('/api/admin/child-tables/account-settings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settingsPayload)
      });

      if (!settingsResponse.ok) {
        const settingsError = await settingsResponse.text();
        console.error('Failed to create account settings:', settingsError);
        console.warn('Account was created but settings failed');
      } else {
        console.log('✅ Account settings created');
      }

      // Step 4: Create operating hours
      console.log('Step 4: Creating operating hours...');
      let hoursCreated = 0;
      for (const hours of formData.operating_hours) {
        const hoursPayload = {
          account_id: accountId,
          ...hours
        };
        console.log(`Creating hours for day ${hours.day_of_week}:`, hoursPayload);
        
        const hoursResponse = await fetch('/api/admin/child-tables/operating-hours', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(hoursPayload)
        });
        
        if (hoursResponse.ok) {
          hoursCreated++;
        } else {
          const errorText = await hoursResponse.text();
          console.error(`Failed to create hours for day ${hours.day_of_week}:`, errorText);
        }
      }
      
      console.log(`✅ Created ${hoursCreated}/${formData.operating_hours.length} operating hours`);

      toast.success('Account created successfully!', {
        description: `${formData.restaurant_name} has been added to the system.`,
        duration: 4000
      });

      if (onSuccess) {
        onSuccess(accountId);
      }
      
      onClose();
      
    } catch (error) {
      console.error('Error creating account:', error);
      console.error('Error stack:', error.stack);
      toast.error('Failed to create account', {
        description: error.message,
        duration: 5000
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      {/* User Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <User size={20} className="text-blue-600" />
          <span>User Information</span>
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {errors.first_name && (
              <p className="text-red-600 text-sm mt-1">{errors.first_name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) => handleInputChange('last_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {errors.last_name && (
              <p className="text-red-600 text-sm mt-1">{errors.last_name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="+1234567890"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              minLength={8}
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>
        </div>
      </div>

      {/* Restaurant Information */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Building size={20} className="text-green-600" />
          <span>Restaurant Information</span>
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name *</label>
            <input
              type="text"
              value={formData.restaurant_name}
              onChange={(e) => handleInputChange('restaurant_name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
            {errors.restaurant_name && (
              <p className="text-red-600 text-sm mt-1">{errors.restaurant_name}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Phone *</label>
            <input
              type="tel"
              value={formData.business_phone}
              onChange={(e) => handleInputChange('business_phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="+1234567890"
            />
            {errors.business_phone && (
              <p className="text-red-600 text-sm mt-1">{errors.business_phone}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
            <input
              type="email"
              value={formData.business_email}
              onChange={(e) => handleInputChange('business_email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              value={formData.business_address}
              onChange={(e) => handleInputChange('business_address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
            <input
              type="url"
              value={formData.website_url}
              onChange={(e) => handleInputChange('website_url', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="https://restaurant.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <select
              value={formData.timezone}
              onChange={(e) => handleInputChange('timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="America/Phoenix">Arizona (MST)</option>
              <option value="America/Anchorage">Alaska (AKT)</option>
              <option value="Pacific/Honolulu">Hawaii (HST)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine Type</label>
            <select
              value={formData.cuisine_type}
              onChange={(e) => handleInputChange('cuisine_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select cuisine</option>
              <option value="american">American</option>
              <option value="italian">Italian</option>
              <option value="chinese">Chinese</option>
              <option value="mexican">Mexican</option>
              <option value="indian">Indian</option>
              <option value="japanese">Japanese</option>
              <option value="thai">Thai</option>
              <option value="mediterranean">Mediterranean</option>
              <option value="pizza">Pizza</option>
              <option value="burger">Burger</option>
              <option value="seafood">Seafood</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Type</label>
            <select
              value={formData.restaurant_type}
              onChange={(e) => handleInputChange('restaurant_type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select type</option>
              <option value="fast_food">Fast Food</option>
              <option value="casual_dining">Casual Dining</option>
              <option value="fine_dining">Fine Dining</option>
              <option value="cafe">Cafe</option>
              <option value="bakery">Bakery</option>
              <option value="food_truck">Food Truck</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Plan</label>
            <select
              value={formData.subscription_plan}
              onChange={(e) => handleInputChange('subscription_plan', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="free">Free</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Billing Cycle</label>
            <select
              value={formData.billing_cycle}
              onChange={(e) => handleInputChange('billing_cycle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
        <Settings size={20} className="text-purple-600" />
        <span>AI & Business Settings</span>
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
          <input
            type="text"
            value={formData.agent_name}
            onChange={(e) => handleInputChange('agent_name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">AI Personality</label>
          <select
            value={formData.ai_personality}
            onChange={(e) => handleInputChange('ai_personality', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="friendly">Friendly</option>
            <option value="professional">Professional</option>
            <option value="enthusiastic">Enthusiastic</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
          <input
            type="number"
            min="0"
            max="1"
            step="0.1"
            value={formData.temperature}
            onChange={(e) => handleInputChange('temperature', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {errors.temperature && (
            <p className="text-red-600 text-sm mt-1">{errors.temperature}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Duration (seconds)</label>
          <input
            type="number"
            value={formData.max_duration}
            onChange={(e) => handleInputChange('max_duration', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
          <input
            type="number"
            min="0"
            max="50"
            step="0.01"
            value={formData.tax_rate}
            onChange={(e) => handleInputChange('tax_rate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {errors.tax_rate && (
            <p className="text-red-600 text-sm mt-1">{errors.tax_rate}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Fee ($)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.delivery_fee}
            onChange={(e) => handleInputChange('delivery_fee', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          {errors.delivery_fee && (
            <p className="text-red-600 text-sm mt-1">{errors.delivery_fee}</p>
          )}
        </div>
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Greeting Message</label>
          <textarea
            value={formData.greeting_message}
            onChange={(e) => handleInputChange('greeting_message', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={3}
            placeholder="Hi! Thanks for calling..."
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
        <Clock size={20} className="text-orange-600" />
        <span>Operating Hours</span>
      </h3>
      
      {formData.operating_hours.map((hours, index) => (
        <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
          <div className="w-24 font-medium">{dayNames[hours.day_of_week]}</div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={hours.is_open}
              onChange={(e) => handleOperatingHourChange(index, 'is_open', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Open</span>
          </label>
          {hours.is_open && (
            <>
              <input
                type="time"
                value={hours.open_time}
                onChange={(e) => handleOperatingHourChange(index, 'open_time', e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded"
              />
              <span>to</span>
              <input
                type="time"
                value={hours.close_time}
                onChange={(e) => handleOperatingHourChange(index, 'close_time', e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded"
              />
            </>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4 shadow-2xl">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900">Creating Account...</h3>
              <p className="text-sm text-gray-600 mt-2">Please wait while we set up the account</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <Plus className="text-blue-600" size={24} />
            <span>Add New Account</span>
            <span className="text-sm text-gray-500 ml-2">Step {step} of 3</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex justify-between border-t">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1 || loading}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          {step < 3 ? (
            <button
              onClick={handleNextStep}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50 transition-colors"
            >
              <span>Next</span>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-2 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Create Account</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default AddAccount;

