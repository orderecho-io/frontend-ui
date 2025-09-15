import React from 'react';
import { TrendingUp, Clock, Users, Shield, Zap, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
  {
    icon: TrendingUp,
    title: "Increase Revenue",
    description: "Convert missed calls into orders. Our AI captures every opportunity, even during peak hours.",
    stats: "Average 35% revenue boost",
    color: "from-green-500 to-emerald-600"
  },
  {
    icon: Clock,
    title: "24/7 Availability", 
    description: "Never miss another call. OrderEcho works around the clock, handling orders when you're closed.",
    stats: "100% uptime guaranteed",
    color: "from-blue-500 to-cyan-600"
  },
  {
    icon: Users,
    title: "Reduce Staff Workload",
    description: "Free up your team to focus on cooking and in-person service instead of answering phones.",
    stats: "Save 4+ hours daily",
    color: "from-purple-500 to-violet-600"
  },
  {
    icon: Shield,
    title: "Perfect Order Accuracy",
    description: "AI eliminates human error in order taking. Every detail is captured correctly, every time.",
    stats: "99.8% accuracy rate",
    color: "from-orange-500 to-red-600"
  }
];

const features = [
  "Natural conversation flow",
  "Full menu integration",
  "Multiple language support", 
  "Real-time analytics",
  "Custom voice training",
  "Daily call reports"
];

export default function BenefitsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Restaurant Owners Choose OrderEcho
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI voice agent doesn't just answer calls—it transforms your entire phone ordering experience.
          </p>
        </motion.div>

        {/* Main Benefits Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden h-full">
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${benefit.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {benefit.description}
                  </p>
                  <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${benefit.color} text-white rounded-full text-sm font-semibold`}>
                    <Zap className="w-4 h-4 mr-2" />
                    {benefit.stats}
                  </div>
                </div>
                
                {/* Background decoration */}
                <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r ${benefit.color} opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity duration-300`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-gray-50 to-orange-50 rounded-3xl p-12 text-center"
        >
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            Enterprise-Grade Features
          </h3>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            OrderEcho comes packed with advanced features designed specifically for restaurant operations.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center gap-3 text-left"
              >
                <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}