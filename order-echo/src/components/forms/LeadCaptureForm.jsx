import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lead } from "@/api/entities";
import { CheckCircle, Phone, Mail, Building } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function LeadCaptureForm() {
  const [formData, setFormData] = useState({
    restaurant_name: '',
    contact_name: '',
    email: '',
    phone: '',
    monthly_order_volume: '',
    biggest_challenge: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await Lead.create(formData);
      setShowConfirm(true);
      setFormData({
        restaurant_name: '',
        contact_name: '',
        email: '',
        phone: '',
        monthly_order_volume: '',
        biggest_challenge: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting lead:', error);
    }
    
    setIsSubmitting(false);
  };

  return (
    <section id="get-started" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Modal */}
        <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </span>
                Submitted Successfully
              </DialogTitle>
              <DialogDescription>
                Thank you! We'll be in touch soon to schedule your personalized demo.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setShowConfirm(false)} className="bg-orange-500 hover:bg-orange-600">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Boost Your Restaurant Revenue?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get started with OrderEcho today. Fill out the form below and we'll set up a personalized demo for your restaurant.
          </p>
        </motion.div>

        <Card className="shadow-2xl border-0 bg-white">
          <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl text-center">Get Your Free Demo</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="restaurant_name" className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Restaurant Name *
                  </Label>
                  <Input
                    id="restaurant_name"
                    value={formData.restaurant_name}
                    onChange={(e) => handleInputChange('restaurant_name', e.target.value)}
                    placeholder="Mario's Pizza"
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact_name" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Your Name *
                  </Label>
                  <Input
                    id="contact_name"
                    value={formData.contact_name}
                    onChange={(e) => handleInputChange('contact_name', e.target.value)}
                    placeholder="John Smith"
                    required
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john@mariospizza.com"
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(555) 123-4567"
                    required
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="call_volume">Monthly Order Volume</Label>
                  <Select value={formData.monthly_order_volume} onValueChange={(value) => handleInputChange('monthly_order_volume', value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select order volume" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under_1000">Under $1,000</SelectItem>
                      <SelectItem value="1000_5000">$1,000 - $5,000</SelectItem>
                      <SelectItem value="5000_10000">$5,000 - $10,000</SelectItem>
                      <SelectItem value="over_10000">Over $10,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="challenge">Biggest Challenge</Label>
                  <Select value={formData.biggest_challenge} onValueChange={(value) => handleInputChange('biggest_challenge', value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select main challenge" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="missed_calls">Missed Calls</SelectItem>
                      <SelectItem value="peak_hour_overflow">Peak Hour Overflow</SelectItem>
                      <SelectItem value="staff_shortage">Staff Shortage</SelectItem>
                      <SelectItem value="order_accuracy">Order Accuracy</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Additional Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Tell us more about your restaurant and specific needs..."
                  rows={4}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white h-14 text-lg font-semibold"
              >
                {isSubmitting ? "Submitting..." : "Get My Free Demo"}
              </Button>

              <p className="text-sm text-gray-500 text-center">
                * Required fields. We respect your privacy and will never spam you.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
