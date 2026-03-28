import React from 'react';
import Link from 'next/link';
import { UtensilsCrossed, ChefHat, Pizza, Sparkles } from 'lucide-react';

const CTASection: React.FC = () => {
  return (
    <section className="py-24 px-4 bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto text-center">
        {/* Animated food icon with sparkle effect */}
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 animate-ping rounded-full bg-amber-300 opacity-20"></div>
          <div className="relative bg-gradient-to-r from-amber-600 to-orange-600 rounded-full p-4 shadow-lg">
            <UtensilsCrossed className="h-12 w-12 text-white" />
          </div>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-6">
          Ready to Satisfy Your Cravings?
          <span className="inline-block ml-2 animate-bounce">🍽️</span>
        </h2>
        
        <p className="text-xl text-stone-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Order with confidence. Our kitchen ensures every dish is fresh, flavorful, and delivered fast 
          to your doorstep. Experience culinary excellence today!
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/menu"
            className="group relative px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">Browse Our Menu</span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-800 to-orange-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </Link>
          
          <Link
            href="/contact"
            className="px-8 py-4 bg-white text-stone-900 rounded-full font-bold text-lg hover:bg-stone-100 hover:scale-105 transition-all shadow-md border-2 border-amber-200 hover:border-amber-300"
          >
            Contact Us
          </Link>
        </div>

        {/* Optional: Add trust indicators */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-stone-500">
          <div className="flex items-center gap-2">
            <ChefHat className="h-4 w-4 text-amber-600" />
            <span>Expert Chefs</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span>Fresh Ingredients</span>
          </div>
          <div className="flex items-center gap-2">
            <Pizza className="h-4 w-4 text-amber-600" />
            <span>Fast Delivery</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;