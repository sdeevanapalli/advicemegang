import React from 'react';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { 
  Search, 
  DollarSign, 
  Brain, 
  Clock, 
  Award, 
  CheckCircle 
} from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      title: "Smart Car Search",
      description: "Advanced filtering system that matches cars to your exact preferences and budget",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 items-center justify-center">
          <Search className="h-12 w-12 text-primary" />
        </div>
      ),
      icon: <Search className="h-4 w-4 text-primary" />,
    },
    {
      title: "Budget Optimization",
      description: "Find the best value cars within your price range, including financing options",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 items-center justify-center">
          <DollarSign className="h-12 w-12 text-accent" />
        </div>
      ),
      icon: <DollarSign className="h-4 w-4 text-accent" />,
    },
    {
      title: "AI-Powered Recommendations",
      description: "Machine learning algorithms analyze thousands of factors to suggest perfect matches",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 items-center justify-center">
          <Brain className="h-12 w-12 text-primary" />
        </div>
      ),
      icon: <Brain className="h-4 w-4 text-primary" />,
    },
    {
      title: "Save Time & Effort",
      description: "No more reading hundreds of brochures - get personalized recommendations instantly",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 items-center justify-center">
          <Clock className="h-12 w-12 text-accent" />
        </div>
      ),
      icon: <Clock className="h-4 w-4 text-accent" />,
    },
    {
      title: "Expert Reviews & Ratings",
      description: "Comprehensive analysis of safety, reliability, and owner satisfaction scores",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 items-center justify-center">
          <Award className="h-12 w-12 text-primary" />
        </div>
      ),
      icon: <Award className="h-4 w-4 text-primary" />,
    },
    {
      title: "Personalized Match Score",
      description: "Each recommendation comes with a compatibility score based on your specific needs",
      header: (
        <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-accent/20 to-primary/20 items-center justify-center">
          <CheckCircle className="h-12 w-12 text-accent" />
        </div>
      ),
      icon: <CheckCircle className="h-4 w-4 text-accent" />,
    },
  ];

  return (
    <section id="features" className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Why Choose Car Advisor?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Smart technology meets expert knowledge to revolutionize your car buying experience
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