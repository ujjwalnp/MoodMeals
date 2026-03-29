// app/about/page.tsx
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  ChefHat, Clock, Award, Users, Heart, Coffee, 
  Truck, MapPin, Phone, Mail, Globe, Star 
} from "lucide-react";

export default function AboutPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    
    const navbar = document.querySelector('nav');
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
  }, []);

  const stats = [
    { icon: Users, value: "1,000+", label: "Happy Customers", color: "from-amber-600 to-orange-600" },
    { icon: ChefHat, value: "15+", label: "Expert Chefs", color: "from-amber-600 to-orange-600" },
    { icon: Clock, value: "30min", label: "Avg. Delivery", color: "from-amber-600 to-orange-600" },
    { icon: Award, value: "10+", label: "Awards Won", color: "from-amber-600 to-orange-600" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Quality First",
      description: "We use only the freshest ingredients sourced from local farms.",
      color: "text-amber-600"
    },
    {
      icon: Coffee,
      title: "Passion for Food",
      description: "Every dish is crafted with love and attention to detail.",
      color: "text-amber-600"
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Hot and fresh food delivered right to your doorstep.",
      color: "text-amber-600"
    },
    {
      icon: Star,
      title: "Customer Satisfaction",
      description: "Your happiness is our top priority. We guarantee it.",
      color: "text-amber-600"
    },
  ];

  return (
    <>
      <Navbar />
      <div 
        className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50"
        style={{ paddingTop: navbarHeight > 0 ? `${navbarHeight}px` : '80px' }}
      >
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-amber-900 via-orange-800 to-red-900 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 text-center">
            <div className={`transition-all duration-1000 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
              <h1 className="text-5xl md:text-6xl font-black mb-4">Our Story</h1>
              <p className="text-xl text-amber-100 max-w-2xl mx-auto">
                Crafting delicious memories since 2024
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          {/* Our Story Section */}
          <div className={`max-w-4xl mx-auto mb-20 text-center transition-all duration-1000 delay-200 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            <h2 className="text-4xl font-bold text-stone-800 mb-6">Who We Are</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto mb-8"></div>
            <p className="text-stone-600 text-lg leading-relaxed mb-6">
              Welcome to <span className="font-semibold text-amber-600">Mood</span><span className="font-semibold text-green-600">Meals</span>, where passion meets flavor. 
              We started with a simple idea: to bring authentic, delicious, and high-quality food to 
              food lovers who appreciate the art of cooking.
            </p>
            <p className="text-stone-600 text-lg leading-relaxed mb-6">
              Our team of expert chefs works tirelessly to create mouthwatering dishes that combine 
              traditional recipes with modern twists. Every ingredient is carefully selected to ensure 
              the highest quality and freshest taste.
            </p>
            <p className="text-stone-600 text-lg leading-relaxed">
              Whether you're craving comfort food or exploring new flavors, we're here to make every 
              meal a memorable experience. Join us on this delicious journey!
            </p>
          </div>

          {/* Stats Section */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 transition-all duration-1000 delay-300 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${stat.color} rounded-full mb-4`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-black text-stone-800">{stat.value}</div>
                  <div className="text-stone-500 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Our Values Section */}
          <div className={`mb-20 transition-all duration-1000 delay-400 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            <h2 className="text-4xl font-bold text-stone-800 text-center mb-6">Our Values</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto mb-12"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, idx) => {
                const Icon = value.icon;
                return (
                  <div key={idx} className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 group">
                    <div className={`${value.color} mb-4 flex justify-center`}>
                      <div className="p-3 bg-amber-50 rounded-full group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-8 w-8" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-stone-800 mb-3">{value.title}</h3>
                    <p className="text-stone-500">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chef's Section */}
          <div className={`bg-white rounded-3xl p-8 md:p-12 shadow-xl transition-all duration-1000 delay-500 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">Meet Our Master Chef</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto md:mx-0 mb-6"></div>
                <p className="text-stone-600 text-lg leading-relaxed mb-4">
                  Chef <span className="font-semibold text-amber-600">Rajesh Sharma</span> brings over 20 years of culinary 
                  experience from top restaurants around the world.
                </p>
                <p className="text-stone-600 leading-relaxed mb-6">
                  His philosophy is simple: use the finest ingredients, respect traditional techniques, 
                  and add a touch of innovation to create unforgettable dining experiences.
                </p>
                <div className="flex items-center gap-2 text-amber-600">
                  <Star className="h-5 w-5 fill-amber-600" />
                  <span className="font-semibold">Michelin Star Rated Chef</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl blur-xl opacity-30"></div>
                  <div className="relative bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-8 text-center">
                    <div className="text-8xl mb-4">👨‍🍳</div>
                    <h3 className="text-2xl font-bold text-stone-800">Rajesh Sharma</h3>
                    <p className="text-amber-600 font-medium">Executive Chef</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}