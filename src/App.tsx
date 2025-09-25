import React from 'react';
import { AIChat } from './components/AIChat';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="car-advice-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        <div className="min-h-screen bg-background p-4">
          <div className="container mx-auto max-w-4xl">
            <header className="text-center py-6 mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Car Advice AI
              </h1>
              <p className="text-muted-foreground">
                Get instant, personalized car buying advice from our AI expert
              </p>
            </header>
            
            <AIChat />
          </div>
        </div>
      </TooltipProvider>
    </ThemeProvider>
  );
}
