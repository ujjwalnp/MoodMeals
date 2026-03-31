"use client";

import React from 'react';
import { 
  ShoppingBag, 
  CreditCard, 
  ChefHat, 
  Bike, 
  CheckCircle,
  Clock,
  Heart,
  Star
} from 'lucide-react';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FoodOrderFlow: React.FC = () => {
  const steps: Step[] = [
    {
      id: 1,
      title: "Browse & Select",
      description: "Choose your favorite dishes from our menu",
      icon: <ShoppingBag className="h-8 w-8" />,
    },
    {
      id: 2,
      title: "Secure Payment",
      description: "Fast & secure checkout options",
      icon: <CreditCard className="h-8 w-8" />,
    },
    {
      id: 3,
      title: "Chef Prepares",
      description: "Expert chefs craft your meal fresh",
      icon: <ChefHat className="h-8 w-8" />,
    },
    {
      id: 4,
      title: "Fast Delivery",
      description: "Track your order in real-time",
      icon: <Bike className="h-8 w-8" />,
    },
    {
      id: 5,
      title: "Enjoy Your Meal",
      description: "Savor every delicious bite",
      icon: <CheckCircle className="h-8 w-8" />,
    },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
            How It Works
            <span className="inline-block ml-2">🍽️</span>
          </h2>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto">
            From craving to delivery in 5 simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line (desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-200 via-orange-300 to-amber-200 transform -translate-y-1/2"></div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Step card */}
                <div className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-amber-100">
                  {/* Step number badge */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 text-white flex items-center justify-center text-sm font-bold shadow-md">
                      {step.id}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="mb-4 text-amber-600 flex justify-center">
                    {step.icon}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-lg text-stone-900 mb-2">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-stone-500">
                    {step.description}
                  </p>
                </div>

                {/* Arrow connector (mobile/tablet) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block lg:hidden absolute -right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm">
                      →
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default FoodOrderFlow;