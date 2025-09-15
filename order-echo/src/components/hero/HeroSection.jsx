import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Star, Users, CheckCircle as CheckIcon } from "lucide-react";
import { motion } from "framer-motion";
import OrderEchoLogo from "@/components/ui/OrderEchoLogo";

export default function HeroSection({ onGetStarted }) {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute top-60 -left-32 w-64 h-64 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <Badge className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 text-sm font-medium border border-orange-200">
              <Star className="w-4 h-4" />
              #1 AI Voice Agent for Restaurants
            </Badge>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Never Miss Another
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600"> Order</span>
                <br />Again
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                OrderEcho's AI voice agent handles your restaurant calls 24/7, taking orders, answering questions, and converting missed calls into revenue.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-shadow"
                onClick={onGetStarted}
              >
                Get Started Free
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-4 text-lg"
              >
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center flex flex-col items-center">
                <Users className="w-6 h-6 text-orange-500 mb-2" />
                <div className="text-3xl font-bold text-gray-900">99.99%</div>
                <div className="text-sm text-gray-600">Call Answer Rate</div>
              </div>
              <div className="text-center flex flex-col items-center">
                <TrendingUp className="w-6 h-6 text-red-500 mb-2" />
                <div className="text-3xl font-bold text-gray-900">+35%</div>
                <div className="text-sm text-gray-600">Revenue Increase</div>
              </div>
              <div className="text-center flex flex-col items-center">
                <Clock className="w-6 h-6 text-orange-500 mb-2" />
                <div className="text-3xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">Always Available</div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Interactive Demo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <OrderEchoLogo size="large" className="text-gray-800" />
                <div>
                  <h3 className="font-semibold text-gray-900">OrderEcho AI</h3>
                  <p className="text-sm text-gray-600">Now Taking Your Call</p>
                </div>
                <div className="ml-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping absolute"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 font-medium">Live</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">AI</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">"Hi! Thanks for calling Mario's Pizza. How can I help you today?"</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">C</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">"I'd like to order a large pepperoni pizza for delivery."</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-medium">AI</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">"Great choice! That's $16.99. Can I get your address for delivery?"</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center py-4">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckIcon className="w-5 h-5" />
                    <span className="font-medium">Order Captured Successfully</span>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                +$16.99
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-lg">
                <Clock className="w-3 h-3" />
                30s
              </div>
            </div>

            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-500/20 rounded-3xl blur-3xl -z-10 scale-110"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}