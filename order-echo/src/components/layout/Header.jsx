import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import OrderEchoLogo from "@/components/ui/OrderEchoLogo";

export default function Header({ onGetStarted }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <OrderEchoLogo size="default" className="text-gray-800" />
            <span className="text-2xl font-bold text-gray-900">OrderEcho</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-600 hover:text-orange-600 font-medium transition-colors"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('benefits')}
              className="text-gray-600 hover:text-orange-600 font-medium transition-colors"
            >
              Benefits
            </button>
            <button 
              onClick={() => scrollToSection('get-started')}
              className="text-gray-600 hover:text-orange-600 font-medium transition-colors"
            >
              Get Started
            </button>
            <Button 
              onClick={onGetStarted}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
            >
              Free Demo
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-white border-t border-gray-100 py-4"
          >
            <nav className="flex flex-col space-y-4">
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-left text-gray-600 hover:text-orange-600 font-medium py-2"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('benefits')}
                className="text-left text-gray-600 hover:text-orange-600 font-medium py-2"
              >
                Benefits
              </button>
              <button 
                onClick={() => scrollToSection('get-started')}
                className="text-left text-gray-600 hover:text-orange-600 font-medium py-2"
              >
                Get Started
              </button>
              <Button 
                onClick={() => {
                  onGetStarted();
                  setIsMobileMenuOpen(false);
                }}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white w-full"
              >
                Free Demo
              </Button>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}