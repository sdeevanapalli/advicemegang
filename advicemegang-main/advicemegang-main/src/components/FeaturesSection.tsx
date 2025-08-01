import React from 'react';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { 
  Zap, 
  Shield, 
  Cpu, 
  Battery, 
  Wifi, 
  Eye 
} from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      title: "Lightning Fast Acceleration",
      description: "0-60 mph in just 2.1 seconds with instant torque delivery",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 items-center justify-center">
          <Zap className="h-12 w-12 text-primary" />
        </div>
      ),
      icon: <Zap className="h-4 w-4 text-primary" />,
    },
    {
      title: "Advanced Safety Systems",
      description: "AI-powered collision avoidance and autonomous emergency braking",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 items-center justify-center">
          <Shield className="h-12 w-12 text-accent" />
        </div>
      ),
      icon: <Shield className="h-4 w-4 text-accent" />,
    },
    {
      title: "Neural Processing Unit",
      description: "Quantum-enhanced AI for predictive driving and real-time optimization",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 items-center justify-center">
          <Cpu className="h-12 w-12 text-primary" />
        </div>
      ),
      icon: <Cpu className="h-4 w-4 text-primary" />,
    },
    {
      title: "Extended Range Battery",
      description: "300+ mile range with rapid 15-minute charging capability",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 items-center justify-center">
          <Battery className="h-12 w-12 text-accent" />
        </div>
      ),
      icon: <Battery className="h-4 w-4 text-accent" />,
    },
    {
      title: "5G Connectivity",
      description: "Always connected with real-time traffic and entertainment streaming",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 items-center justify-center">
          <Wifi className="h-12 w-12 text-primary" />
        </div>
      ),
      icon: <Wifi className="h-4 w-4 text-primary" />,
    },
    {
      title: "Augmented Reality HUD",
      description: "Immersive AR display with navigation and vehicle diagnostics",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 items-center justify-center">
          <Eye className="h-12 w-12 text-accent" />
        </div>
      ),
      icon: <Eye className="h-4 w-4 text-accent" />,
    },
  ];

  return (
    <section id="features" className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Revolutionary Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Cutting-edge technology meets unparalleled performance in every aspect of the CyberDrive experience
          </p>
        </div>
        
        <BentoGrid className="max-w-4xl mx-auto">
          {features.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              icon={item.icon}
              className={i === 3 || i === 6 ? "md:col-span-2" : ""}
            />
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}