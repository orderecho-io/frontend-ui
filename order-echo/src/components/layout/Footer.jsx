import React from 'react';
import { Mail, Phone } from 'lucide-react';
import OrderEchoLogo from "@/components/ui/OrderEchoLogo";

export default function Footer() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <OrderEchoLogo size="default" className="text-white" />
              <span className="text-2xl font-bold">OrderEcho</span>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
              The AI voice agent that transforms restaurant phone ordering. Never miss a call, never lose an order.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>hello@orderecho.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>1-800-ORDER-AI</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Product</h3>
            <ul className="space-y-3">
              <li><button onClick={() => scrollToSection('how-it-works')} className="text-gray-400 hover:text-orange-400 transition-colors">How It Works</button></li>
              <li><button onClick={() => scrollToSection('benefits')} className="text-gray-400 hover:text-orange-400 transition-colors">Benefits</button></li>
              <li><button onClick={() => scrollToSection('get-started')} className="text-gray-400 hover:text-orange-400 transition-colors">Get Started</button></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-orange-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © 2024 OrderEcho. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-orange-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-orange-400 transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}