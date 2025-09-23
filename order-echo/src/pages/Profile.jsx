import React, { useState, useEffect } from 'react';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, CheckCircle } from 'lucide-react';
import WorkingHoursEditor from '../components/profile/WorkingHoursEditor';
import PhoneInput from '../components/profile/PhoneInput';

export default function Profile() {
  // TODO: When implementing real authentication, replace this mock data with actual user fetch
  // const [user, setUser] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);
  
  // Mock user data for now - replace with real authentication
  const [user] = useState({
    id: 'mock-user-id',
    full_name: 'Restaurant Owner',
    email: 'owner@restaurant.com',
    restaurant_name: '',
    phone: '',
    address: { street: '', city: '', state: '', zip: '' },
    working_hours: [],
    time_zone: ''
  });
  const [isLoading] = useState(false);

  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    // TODO: When implementing real authentication, uncomment this:
    // User.me()
    //   .then(userData => {
    //     setUser(userData);
    //     setFormData({
    //       full_name: userData.full_name || '',
    //       email: userData.email || '',
    //       restaurant_name: userData.restaurant_name || '',
    //       phone: userData.phone || '',
    //       address: userData.address || { street: '', city: '', state: '', zip: '' },
    //       working_hours: userData.working_hours,
    //       time_zone: userData.time_zone || '',
    //     });
    //   })
    //   .catch(error => {
    //     console.error("Failed to fetch user data:", error);
    //   })
    //   .finally(() => setIsLoading(false));

    // Mock data initialization for now
    setFormData({
      full_name: user.full_name || '',
      email: user.email || '',
      restaurant_name: user.restaurant_name || '',
      phone: user.phone || '',
      address: user.address || { street: '', city: '', state: '', zip: '' },
      working_hours: user.working_hours || [],
      time_zone: user.time_zone || '',
    });
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: { ...prev.address, [name]: value }
    }));
  };

  const handlePhoneChange = (value) => {
    setFormData(prev => ({ ...prev, phone: value }));
  };

  const handleHoursChange = (newHours) => {
    setFormData(prev => ({ ...prev, working_hours: newHours }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      // TODO: When implementing real authentication, uncomment this:
      // await User.updateMyUserData(formData);
      
      // Mock save success for now
      console.log('Saving profile data:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8"><Loader2 className="animate-spin" /></div>;
  }

  if (!user) {
    return <div className="p-8">Could not load user profile. Please try logging in again.</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
          <p className="text-gray-600">Update your restaurant and contact information.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {saveSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center">
          <CheckCircle className="w-5 h-5 mr-3" />
          <span className="font-medium">Profile saved successfully!</span>
        </div>
      )}

      <Card>
        <CardHeader><CardTitle>Restaurant Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="restaurant_name">Restaurant Name</Label>
              <Input id="restaurant_name" name="restaurant_name" value={formData.restaurant_name || ''} onChange={handleInputChange} />
            </div>
          </div>
          <div>
            <Label>Address</Label>
            <div className="grid md:grid-cols-2 gap-4 mt-2">
              <Input name="street" placeholder="Street Address" value={formData.address?.street || ''} onChange={handleAddressChange} />
              <Input name="city" placeholder="City" value={formData.address?.city || ''} onChange={handleAddressChange} />
              <Input name="state" placeholder="Province" value={formData.address?.state || ''} onChange={handleAddressChange} />
              <Input name="zip" placeholder="Postal Code" value={formData.address?.zip || ''} onChange={handleAddressChange} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader><CardTitle>Contact Details</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" name="email" type="email" value={formData.email || ''} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <PhoneInput value={formData.phone || ''} onChange={handlePhoneChange} />
          </div>
        </CardContent>
      </Card>

      <WorkingHoursEditor initialHours={formData.working_hours} onHoursChange={handleHoursChange} />

      <CardFooter className="px-0 pt-6 flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardFooter>
    </div>
  );
}

