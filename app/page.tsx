"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection"; 
import CTASection from "@/components/card/CTA";
import Footer from "@/components/Footer";
import ReviewSection from "@/components/ReviewSection";
import { featuredReviews, reviewStats } from "@/data/reviewData";
import FeaturedOffers from "@/components/FeaturedOffers";
import FoodOrderFlow from "@/components/card/FoodOrderFlow";
import { Loader2 } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  isDiscount: boolean;
  preparationTime: number;
  popularityTag: string | null;
  rating: number;
  isVeg: boolean;
  image: string | null;
  isAvailable: boolean;
  slug: string;
}

// Transform API menu item to match OfferItem expected format
const transformToOfferItem = (item: MenuItem) => {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    discountedPrice: item.discountedPrice,
    isDiscount: item.isDiscount,
    preparationTime: item.preparationTime,
    popularityTag: item.popularityTag?.toLowerCase() as "popular" | "chef-special" | "trending" | "bestseller" | "fan-favorite" | null || null,
    rating: item.rating,
    isVeg: item.isVeg,
    image: item.image || "/placeholder-food.jpg",
  };
};

export default function Home() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/menu");
      if (!response.ok) throw new Error("Failed to fetch menu");
      const data = await response.json();
      
      // Filter only available items
      const availableItems = data.filter((item: MenuItem) => item.isAvailable);
      setMenuItems(availableItems);
    } catch (error) {
      console.error("Error fetching menu:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get discounted items and transform them to match OfferItem type
  const discountedOffers = menuItems
    .filter(item => item.isDiscount === true && item.discountedPrice)
    .slice(0, 6)
    .map(transformToOfferItem);

  // Show loading state while fetching data
  if (loading) {
    return (
      <main className="bg-stone-50 min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-amber-600 mx-auto mb-4" />
            <p className="text-stone-600">Loading delicious food... 🍽️</p>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-stone-50 min-h-screen">
      <Navbar />
      <HeroSection />
      {/* Featured Offers Section - Show only discounted items, limit to 6 */}
      <FeaturedOffers offers={discountedOffers} />

      <FoodOrderFlow />
      {/* Review Section */}
      <ReviewSection 
        reviews={featuredReviews}
        totalReviews={reviewStats.totalReviews}
        averageRating={reviewStats.averageRating}
      />
        
      <CTASection />
      <Footer />
    </main>
  );
}