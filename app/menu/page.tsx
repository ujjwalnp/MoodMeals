"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { menuItems } from "@/data/menuData";
import MenuItemCard from "@/components/MenuItemCard";
import { 
  Sparkles, Flame, Crown, TrendingUp, Heart, Star, 
  Search, X, Filter, ArrowUpDown, DollarSign, Star as StarIcon,
  Clock, Zap, ChefHat, Award, ThumbsUp, SlidersHorizontal
} from "lucide-react";

export default function MenuPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showVegOnly, setShowVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>("default");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [maxPrepTime, setMaxPrepTime] = useState<number>(60);
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    
    // Get navbar height to add proper padding
    const navbar = document.querySelector('nav');
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
  }, []);

  const categories = [
    { id: "all", name: "All Items", emoji: "✨" },
    { id: "popular", name: "Popular", emoji: "🔥" },
    { id: "chef-special", name: "Chef's Special", emoji: "👨‍🍳" },
    { id: "trending", name: "Trending", emoji: "📈" },
    { id: "bestseller", name: "Bestseller", emoji: "🏆" },
    { id: "fan-favorite", name: "Fan Favorite", emoji: "❤️" },
  ];

  const sortOptions = [
    { value: "default", label: "Default", icon: ArrowUpDown, emoji: "📌" },
    { value: "price-asc", label: "Price: Low to High", icon: DollarSign, emoji: "💰⬆️" },
    { value: "price-desc", label: "Price: High to Low", icon: DollarSign, emoji: "💰⬇️" },
    { value: "rating-desc", label: "Rating: High to Low", icon: StarIcon, emoji: "⭐⬇️" },
    { value: "rating-asc", label: "Rating: Low to High", icon: StarIcon, emoji: "⭐⬆️" },
    { value: "prep-asc", label: "Prep Time: Fastest First", icon: Clock, emoji: "⏱️⬆️" },
    { value: "prep-desc", label: "Prep Time: Slowest First", icon: Clock, emoji: "⏱️⬇️" },
    { value: "popularity", label: "Most Popular", icon: Zap, emoji: "🔥" },
  ];

  const ratingOptions = [0, 4, 4.5, 5];

  const filteredAndSortedItems = useMemo(() => {
    let filtered = menuItems.filter((item) => {
      // Category filter
      if (selectedCategory !== "all" && item.popularityTag !== selectedCategory) {
        return false;
      }
      
      // Search filter
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Veg filter
      const matchesVeg = showVegOnly ? item.isVeg : true;
      
      // Price range filter
      const itemPrice = item.isDiscount && item.discountedPrice ? item.discountedPrice : item.price;
      const matchesPrice = itemPrice >= priceRange[0] && itemPrice <= priceRange[1];
      
      // Rating filter
      const matchesRating = item.rating >= selectedRating;
      
      // Prep time filter
      const matchesPrepTime = item.preparationTime <= maxPrepTime;
      
      return matchesSearch && matchesVeg && matchesPrice && matchesRating && matchesPrepTime;
    });

    // Sorting
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => {
          const priceA = a.isDiscount && a.discountedPrice ? a.discountedPrice : a.price;
          const priceB = b.isDiscount && b.discountedPrice ? b.discountedPrice : b.price;
          return priceA - priceB;
        });
        break;
      case "price-desc":
        filtered.sort((a, b) => {
          const priceA = a.isDiscount && a.discountedPrice ? a.discountedPrice : a.price;
          const priceB = b.isDiscount && b.discountedPrice ? b.discountedPrice : b.price;
          return priceB - priceA;
        });
        break;
      case "rating-desc":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "rating-asc":
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case "prep-asc":
        filtered.sort((a, b) => a.preparationTime - b.preparationTime);
        break;
      case "prep-desc":
        filtered.sort((a, b) => b.preparationTime - a.preparationTime);
        break;
      case "popularity":
        const popularityWeight = {
          "bestseller": 5,
          "popular": 4,
          "chef-special": 4,
          "trending": 3,
          "fan-favorite": 3,
          null: 1
        };
        filtered.sort((a, b) => {
          const weightA = a.popularityTag ? popularityWeight[a.popularityTag] : 1;
          const weightB = b.popularityTag ? popularityWeight[b.popularityTag] : 1;
          return weightB - weightA;
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
  }, [selectedCategory, searchTerm, showVegOnly, sortBy, priceRange, selectedRating, maxPrepTime]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setShowVegOnly(false);
    setSelectedCategory("all");
    setSortBy("default");
    setPriceRange([0, 5000]);
    setSelectedRating(0);
    setMaxPrepTime(60);
  };

  const getMaxPrice = () => {
    return Math.max(...menuItems.map(item => 
      item.isDiscount && item.discountedPrice ? item.discountedPrice : item.price
    ));
  };

  return (
    <>
      <Navbar />
      <div 
        className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 overflow-hidden"
        style={{ paddingTop: navbarHeight > 0 ? `${navbarHeight}px` : '80px' }}
      >
        {/* Decorative Background Elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 text-6xl animate-bounce-slow">🍕</div>
          <div className="absolute top-40 right-20 text-5xl animate-spin-slow">🍔</div>
          <div className="absolute bottom-20 left-20 text-7xl animate-pulse-slow">🍜</div>
          <div className="absolute bottom-40 right-10 text-6xl animate-bounce-slow">🥗</div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12">
          {/* Hero Section with Emojis */}
          <div className={`text-center mb-16 transition-all duration-1000 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg mb-6">
              <span className="text-3xl animate-bounce">🍽️</span>
              <span className="text-3xl animate-pulse">✨</span>
              <span className="text-3xl animate-bounce">😋</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
              Taste the Magic! ✨
            </h1>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto">
              Every dish tells a story 🎭 <span className="inline-block animate-wave">👨‍🍳</span>
            </p>
          </div>

          {/* Advanced Search and Filters Section */}
          <div className={`transition-all duration-1000 delay-200 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            
            {/* Main Search Bar with Filter Toggle */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search by name or description... 🔍"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <X className="h-4 w-4 text-stone-400 hover:text-stone-600" />
                    </button>
                  )}
                </div>

                {/* Sort Dropdown */}
                <div className="relative min-w-[200px]">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white appearance-none cursor-pointer"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.emoji} {option.label}
                      </option>
                    ))}
                  </select>
                  <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-4 w-4 pointer-events-none" />
                </div>

                {/* Filter Toggle Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                    showFilters
                      ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md"
                      : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                  {!showFilters && (showVegOnly || selectedRating > 0 || priceRange[0] > 0 || priceRange[1] < getMaxPrice() || maxPrepTime < 60) && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </button>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 animate-slide-down">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-stone-800 flex items-center gap-2">
                    <Filter className="h-5 w-5 text-amber-600" />
                    Advanced Filters
                  </h3>
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Clear All
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Veg Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-1">
                      🥬 Diet Type
                    </label>
                    <button
                      onClick={() => setShowVegOnly(!showVegOnly)}
                      className={`w-full px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                        showVegOnly
                          ? "bg-green-600 text-white shadow-md"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {showVegOnly ? "🌱 Veg Only" : "🥩 All Items"}
                    </button>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-1">
                      ⭐ Minimum Rating
                    </label>
                    <div className="flex gap-2">
                      {ratingOptions.map(rating => (
                        <button
                          key={rating}
                          onClick={() => setSelectedRating(rating)}
                          className={`flex-1 px-3 py-2 rounded-xl font-semibold transition-all duration-300 ${
                            selectedRating === rating
                              ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md"
                              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                          }`}
                        >
                          {rating === 0 ? "Any" : `${rating}+`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-1">
                      💰 Price Range (NPR)
                    </label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                          placeholder="Min"
                          className="w-1/2 px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                          placeholder="Max"
                          className="w-1/2 px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={getMaxPrice()}
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Prep Time Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-1">
                      ⏱️ Max Prep Time (minutes)
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="5"
                        max="60"
                        step="5"
                        value={maxPrepTime}
                        onChange={(e) => setMaxPrepTime(Number(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-center text-sm font-semibold text-amber-600">
                        {maxPrepTime} minutes or less
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Filters Display */}
                {(showVegOnly || selectedRating > 0 || priceRange[0] > 0 || priceRange[1] < getMaxPrice() || maxPrepTime < 60 || searchTerm) && (
                  <div className="mt-4 pt-4 border-t border-stone-200">
                    <div className="flex flex-wrap gap-2">
                      {showVegOnly && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                          🌱 Veg Only
                          <button onClick={() => setShowVegOnly(false)} className="ml-1 hover:text-green-900">×</button>
                        </span>
                      )}
                      {selectedRating > 0 && (
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm flex items-center gap-1">
                          ⭐ {selectedRating}+ Stars
                          <button onClick={() => setSelectedRating(0)} className="ml-1 hover:text-amber-900">×</button>
                        </span>
                      )}
                      {(priceRange[0] > 0 || priceRange[1] < getMaxPrice()) && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                          💰 NPR {priceRange[0]} - {priceRange[1]}
                          <button onClick={() => setPriceRange([0, getMaxPrice()])} className="ml-1 hover:text-blue-900">×</button>
                        </span>
                      )}
                      {maxPrepTime < 60 && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1">
                          ⏱️ Under {maxPrepTime} mins
                          <button onClick={() => setMaxPrepTime(60)} className="ml-1 hover:text-purple-900">×</button>
                        </span>
                      )}
                      {searchTerm && (
                        <span className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-sm flex items-center gap-1">
                          🔍 "{searchTerm}"
                          <button onClick={() => setSearchTerm("")} className="ml-1 hover:text-stone-900">×</button>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Results Count */}
            <div className="text-center mb-4 text-stone-500 font-medium">
              Found {filteredAndSortedItems.length} delicious {filteredAndSortedItems.length === 1 ? "item" : "items"} 🍽️
              {sortBy !== "default" && (
                <span className="ml-2 text-amber-600">
                  {sortOptions.find(opt => opt.value === sortBy)?.emoji} Sorted
                </span>
              )}
            </div>

            {/* Animated Category Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category, idx) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`group relative px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 transform hover:scale-110 ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-2xl scale-110"
                      : "bg-white text-stone-700 hover:shadow-xl hover:bg-amber-50"
                  }`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{category.emoji}</span>
                    {category.name}
                  </span>
                  {selectedCategory === category.id && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Grid with Staggered Animation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedItems.map((item, index) => (
              <div
                key={item.id}
                className={`transition-all duration-700 transform ${
                  isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <MenuItemCard {...item} index={index} />
              </div>
            ))}
          </div>

          {/* No Results Message */}
          {filteredAndSortedItems.length === 0 && (
            <div className="text-center py-20 animate-fade-in">
              <div className="text-6xl mb-4">😢</div>
              <p className="text-stone-500 text-lg mb-2">No dishes found matching your criteria</p>
              <p className="text-stone-400 text-sm">Try adjusting your search or filters</p>
              <button
                onClick={clearAllFilters}
                className="mt-4 text-amber-600 font-semibold hover:underline inline-flex items-center gap-2"
              >
                Clear all filters ✨
              </button>
            </div>
          )}

          {/* Floating Action Button */}
          <div className="fixed bottom-8 right-8 animate-bounce z-50">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300"
            >
              <span className="text-2xl">🎉</span>
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
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
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
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animate-slide-down { animation: slide-down 0.4s ease-out forwards; }
      `}</style>
    </>
  );
}

// API Call Code (commented for now - uncomment when backend is ready)
/*
"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MenuItemCard from "@/components/MenuItemCard";
import { 
  Sparkles, Flame, Crown, TrendingUp, Heart, Star, 
  Search, X, Filter, ArrowUpDown, DollarSign, Star as StarIcon,
  Clock, Zap, ChefHat, Award, ThumbsUp, SlidersHorizontal
} from "lucide-react";

export default function MenuPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showVegOnly, setShowVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>("default");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [maxPrepTime, setMaxPrepTime] = useState<number>(60);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    
    // Get navbar height
    const navbar = document.querySelector('nav');
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
    
    // Fetch menu items from API
    fetch("/api/menu")
      .then(res => res.json())
      .then(data => {
        setMenuItems(data);
        // Set max price range based on actual data
        const maxPrice = Math.max(...data.map(item => 
          item.isDiscount && item.discountedPrice ? item.discountedPrice : item.price
        ));
        setPriceRange([0, maxPrice]);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching menu:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl animate-bounce mb-4">🍽️</div>
            <p className="text-stone-600 text-lg">Loading our delicious menu...</p>
          </div>
        </div>
      </>
    );
  }

  // ... rest of the component logic (same as above with menuItems from state)
  
  // Note: Make sure to use menuItems from state instead of imported menuItems
}
*/