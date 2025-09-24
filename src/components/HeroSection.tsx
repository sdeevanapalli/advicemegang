'use client'

import React from 'react';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Bot, Users, Shield, Star } from 'lucide-react';

export default function HeroSection() {
  const heroText = "AI-Powered Car Recommendations Designed for Senior Buyers in India";
  
  const scrollToRecommendation = () => {
    const element = document.getElementById('recommendation');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToChat = () => {
    const element = document.getElementById('chat');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-primary/20 rounded-full text-sm">
            <Bot className="h-4 w-4 mr-2 text-primary" />
            <span className="text-primary font-medium">AI-Powered • Senior-Friendly • India-Focused</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
            Smart Car
            <br />
            <span className="text-4xl md:text-6xl">Advisor</span>
          </h1>
          
          <TextGenerateEffect 
            words={heroText}
            className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed senior-friendly"
          />

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
              <Bot className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">AI Expert</h3>
              <p className="text-sm text-gray-600">Knows every car in India</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Senior-Focused</h3>
              <p className="text-sm text-gray-600">Designed for 55+ buyers</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
              <Shield className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Safety First</h3>
              <p className="text-sm text-gray-600">Prioritizes safety & comfort</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-lg px-8 py-4 senior-friendly"
              onClick={scrollToRecommendation}
            >
              Get My Car Recommendations
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-4 senior-friendly border-2"
              onClick={scrollToChat}
            >
              <Bot className="mr-2 h-5 w-5" />
              Chat with AI Expert
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">All Brands</div>
              <div className="text-sm text-gray-600">Maruti to Mercedes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">₹3L - ₹2Cr+</div>
              <div className="text-sm text-gray-600">Every Budget Range</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">Real-time</div>
              <div className="text-sm text-gray-600">Current Prices</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">Expert AI</div>
              <div className="text-sm text-gray-600">GPT-4 Powered</div>
            </div>
          </div>

          {/* Senior-friendly features highlight */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 max-w-3xl mx-auto border">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-medium text-gray-800">Why Seniors Love Our AI Advisor</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                Simple, jargon-free explanations
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                Focuses on comfort & safety
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                Considers physical accessibility
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                Local dealer networks & service
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}