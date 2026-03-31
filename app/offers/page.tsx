// app/offers/page.tsx - Discount Tag Next to Price
"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { menuItems } from "@/data/menuData";
import OfferItem from "@/components/card/OfferItem";
import { ArrowUpDown } from "lucide-react";

export default function OffersPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    
    const navbar = document.querySelector('nav');
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
  }, []);

  // Filter only items with discount
  const offerItems = useMemo(() => {
    return menuItems.filter(item => item.isDiscount === true && item.discountedPrice);
  }, []);

  const categories = [
    { id: "all", name: "All Offers", emoji: "🎁" },
    { id: "popular", name: "Popular", emoji: "🔥" },
    { id: "chef-special", name: "Chef's Special", emoji: "👨‍🍳" },
    { id: "trending", name: "Trending", emoji: "📈" },
    { id: "bestseller", name: "Bestseller", emoji: "🏆" },
    { id: "fan-favorite", name: "Fan Favorite", emoji: "❤️" },
  ];

  const sortOptions = [
    { value: "default", label: "Default", emoji: "📌" },
    { value: "savings", label: "Biggest Saving First", emoji: "💰" },
    { value: "rating-desc", label: "Top Rated Deals", emoji: "⭐" },
    { value: "price-asc", label: "Price: Low to High", emoji: "📈" },
    { value: "price-desc", label: "Price: High to Low", emoji: "📉" },
  ];

  const filteredAndSortedItems = useMemo(() => {
    let filtered = offerItems.filter((item) => {
      // Category filter
      if (selectedCategory !== "all" && item.popularityTag !== selectedCategory) {
        return false;
      }
      return true;
    });

    // Sorting
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
        break;
      case "price-desc":
        filtered.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
        break;
      case "rating-desc":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "savings":
        filtered.sort((a, b) => {
          const savingsA = a.price - (a.discountedPrice || a.price);
          const savingsB = b.price - (b.discountedPrice || b.price);
          return savingsB - savingsA;
        });
        break;
      default:
        // Default sorting by popularity and rating
        filtered.sort((a, b) => {
          if (a.popularityTag && !b.popularityTag) return -1;
          if (!a.popularityTag && b.popularityTag) return 1;
          return b.rating - a.rating;
        });
    }

    return filtered;
  }, [selectedCategory, sortBy, offerItems]);

  const getTotalSavings = () => {
    return offerItems.reduce((total, item) => {
      return total + (item.price - (item.discountedPrice || item.price));
    }, 0);
  };

  const getAverageDiscount = () => {
    if (offerItems.length === 0) return 0;
    const totalDiscountPercent = offerItems.reduce((total, item) => {
      return total + ((item.price - (item.discountedPrice || item.price)) / item.price) * 100;
    }, 0);
    return (totalDiscountPercent / offerItems.length).toFixed(1);
  };

  return (
    <>
      <Navbar />
      <div 
        className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 overflow-hidden"
        style={{ paddingTop: navbarHeight > 0 ? `${navbarHeight}px` : '80px' }}
      >
        {/* Decorative Background Elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 text-6xl animate-bounce-slow">🎁</div>
          <div className="absolute top-40 right-20 text-5xl animate-spin-slow">🏷️</div>
          <div className="absolute bottom-20 left-20 text-7xl animate-pulse-slow">💰</div>
          <div className="absolute bottom-40 right-10 text-6xl animate-bounce-slow">✨</div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className={`text-center mb-12 transition-all duration-1000 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-full px-6 py-3 shadow-lg mb-6">
              <span className="text-3xl animate-bounce">🎉</span>
              <span className="text-3xl animate-pulse">🏷️</span>
              <span className="text-3xl animate-bounce">💸</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
              Hot Offers & Deals! 🔥
            </h1>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Limited time discounts <span className="inline-block animate-wave">⚡</span> Save big on your favorites
            </p>
            
            {/* Offer Stats */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 shadow-lg">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-lg">🎁</span>
                  <span className="font-bold text-stone-800">{offerItems.length}</span>
                  <span className="text-stone-600">Offers</span>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 shadow-lg">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-lg">💸</span>
                  <span className="font-bold text-stone-800">{getAverageDiscount()}%</span>
                  <span className="text-stone-600">Off</span>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-full px-5 py-2 shadow-lg">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-lg">💰</span>
                  <span className="font-bold text-stone-800">NPR {getTotalSavings()}</span>
                  <span className="text-stone-600">Saved</span>
                </div>
              </div>
            </div>
          </div>

          {/* Category and Sort Row */}
          <div className={`transition-all duration-1000 delay-200 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            
            {/* Category Pills with Sort Dropdown */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
              <div className="flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md"
                        : "bg-white/80 text-stone-600 hover:bg-white"
                    }`}
                  >
                    <span className="mr-1">{category.emoji}</span>
                    {category.name}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-1.5 pr-8 bg-white/80 backdrop-blur-sm border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-xs appearance-none cursor-pointer"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.emoji} {option.label}
                    </option>
                  ))}
                </select>
                <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-3 w-3 pointer-events-none" />
              </div>
            </div>

            {/* Results Count */}
            <div className="text-center mb-6 text-stone-500 text-sm">
              🎁 {filteredAndSortedItems.length} amazing {filteredAndSortedItems.length === 1 ? "offer" : "offers"} waiting for you!
            </div>
          </div>

          {/* Offer Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedItems.map((item, index) => (
              <div
                key={item.id}
                className={`transition-all duration-700 transform ${
                  isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <OfferItem {...item} index={index} />
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredAndSortedItems.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <div className="text-5xl mb-3">😢</div>
              <p className="text-stone-500">No offers found in this category</p>
              <button
                onClick={() => setSelectedCategory("all")}
                className="mt-3 text-orange-600 text-sm font-semibold hover:underline"
              >
                View all offers ✨
              </button>
            </div>
          )}

          {/* Limited Time Banner */}
          {filteredAndSortedItems.length > 0 && (
            <div className="mt-12 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 rounded-2xl p-5 text-center text-white shadow-xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-xl animate-pulse">⏰</span>
                <h3 className="text-lg font-bold">Limited Time Offers!</h3>
                <span className="text-xl animate-pulse">⚡</span>
              </div>
              <p className="text-white/90 text-sm">
                Hurry up! These amazing discounts won't last forever. Order now and save big! 🏃‍♂️
              </p>
            </div>
          )}

          {/* Floating Action Button */}
          <div className="fixed bottom-6 right-6 animate-bounce z-50">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-all duration-300"
            >
              <span className="text-xl">🏷️</span>
            </button>
          </div>
        </div>

        <Footer />
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-20deg); }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
        .animate-wave { animation: wave 1s ease-in-out infinite; display: inline-block; }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
      `}</style>
    </>
  );
}