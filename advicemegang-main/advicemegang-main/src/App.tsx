import React from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from "@react-three/drei";
import CarSceneContent from './scenes/CarScene';
import AppNavBar from './components/AppNavBar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import CarRecommendationSection from './components/CarRecommendationSection';
import Footer from './components/Footer';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="cyberdrive-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        {/* 3D Canvas with ScrollControls */}
        <div className="fixed inset-0 z-0">
          <Canvas 
            gl={{ antialias: true }} 
            camera={{ position: [10, 5, 10], fov: 35 }}
            shadows
          >
            <ScrollControls pages={4} damping={0.25}>
              <CarSceneContent />
            </ScrollControls>
          </Canvas>
        </div>

        {/* HTML content in the foreground */}
        <div className="relative z-10">
          <AppNavBar />
          <HeroSection />
          <FeaturesSection />
          <CarRecommendationSection />
          <Footer />
        </div>
      </TooltipProvider>
    </ThemeProvider>
  );
}
