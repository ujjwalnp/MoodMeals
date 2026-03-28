
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection"; 
import MenuItemCard from "@/components/MenuItemCard";
import { menuItems } from "@/data/menuData";

export default function Home() {

   const featuredMenu = menuItems.slice(0, 6)

  return (
    <main className="bg-stone-50 min-h-screen">
      <Navbar />
      <HeroSection />
      
      {/* Featured Offers Section */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-6">
          <div className="text-center md:text-left w-full md:w-auto">
            <h2 className="text-sm font-bold text-amber-700 uppercase tracking-widest mb-3">Limited Time Deals</h2>
            <h3 className="text-4xl font-bold text-stone-900">What's On Offer?</h3>
          </div>
          <Link
            href="/offers"
            className="flex items-center justify-center md:justify-end text-stone-600 font-bold hover:text-amber-700 transition-colors group w-full md:w-auto"
          >
            View all offers <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredMenu.map((item, index) => (
            <MenuItemCard
              key={item.id}
              id={item.id}
              name={item.name}
              description={item.description}
              price={item.price}
              discountedPrice={item.discountedPrice}
              isDiscount={item.isDiscount}
              preparationTime={item.preparationTime}
              popularityTag={item.popularityTag}
              rating={item.rating}
              isVeg={item.isVeg}
              image={item.image}
              index={index}
            />
          ))}
        </div>
      </section>
    </main>

  );
}
