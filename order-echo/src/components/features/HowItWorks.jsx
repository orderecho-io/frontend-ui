import React from 'react';
import { Phone, MessageSquare, CheckCircle, Tablet } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    icon: Phone,
    title: "Customer Calls",
    description: "Your customers call your restaurant number as usual.",
    color: "bg-blue-500"
  },
  {
    icon: MessageSquare,
    title: "AI Responds Instantly",
    description: "OrderEcho AI answers in seconds, with a natural, friendly voice.",
    color: "bg-purple-500"
  },
  {
    icon: CheckCircle,
    title: "Takes Complete Order",
    description: "The AI handles menu questions, takes complex orders, and confirms all details.",
    color: "bg-green-500"
  },
  {
    icon: Tablet,
    title: "Order Sent for Prep",
    description: "The confirmed order is sent to your kitchen via a dedicated tablet app or printer.",
    color: "bg-orange-500"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How OrderEcho Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI voice agent seamlessly integrates with your restaurant operations, handling calls like your best employee.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection lines */}
          <div className="hidden lg:block absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
            <svg className="w-full h-8" viewBox="0 0 800 32" fill="none">
              <path
                d="M100 16 L700 16"
                stroke="url(#gradient)"
                strokeWidth="2"
                strokeDasharray="8 8"
                className="animate-pulse"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="33%" stopColor="#a855f7" />
                  <stop offset="66%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center group h-full">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${step.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {index + 1}
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl p-12 text-white shadow-2xl">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Transform Your Restaurant?
            </h3>
            <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
              Join hundreds of restaurants already using OrderEcho to increase revenue and never miss a call again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-orange-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg">
                Start Free Trial
              </button>
              <button className="border-2 border-white/50 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-orange-600 transition-colors">
                Schedule Demo
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}