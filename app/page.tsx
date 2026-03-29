
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection"; 
import MenuItemCard from "@/components/MenuItemCard";
import { menuItems } from "@/data/menuData";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import ReviewSection from "@/components/ReviewSection";
import { featuredReviews, reviewStats } from "@/data/reviewData";
import FeaturedOffers from "@/components/FeaturedOffers";

export default function Home() {

  return (
    <main className="bg-stone-50 min-h-screen">
      <Navbar />
      <HeroSection />
      
      {/* Featured Offers Section */}
      <FeaturedOffers offers={menuItems.slice(0, 6)} />

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
