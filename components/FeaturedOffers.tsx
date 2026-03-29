
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MenuItemCard from "@/components/MenuItemCard";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  isDiscount: boolean;
  preparationTime: number;
  popularityTag?: "popular" | "chef-special" | "trending" | "bestseller" | "fan-favorite" | null;
  rating: number;
  isVeg: boolean;
  image: string;
}

interface FeaturedOffersProps {
  offers: MenuItem[];
}

const FeaturedOffers = ({ offers }: FeaturedOffersProps) => {
  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-sm font-bold text-amber-700 uppercase tracking-widest mb-3">Limited Time Deals</h2>
        <h3 className="text-4xl font-bold text-stone-900 mb-6">What's On Offer?</h3>
        <Link
          href="/offers"
          className="inline-flex items-center text-stone-600 font-bold hover:text-amber-700 transition-colors group"
        >
          View all offers <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {offers.map((item, index) => (
          <MenuItemCard
            key={item.id}
            id={item.id}
            name={item.name}
            description={item.description}
            price={item.price}
            discountedPrice={item.discountedPrice}
            isDiscount={item.isDiscount}
            preparationTime={item.preparationTime}
            popularityTag={item.popularityTag || null}
            rating={item.rating}
            isVeg={item.isVeg}
            image={item.image}
            index={index}
          />
        ))}
      </div>

      {/* Load More Button */}
    <div className="mt-8 text-center">
        <Link href="/offers">
        <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-amber-700 text-amber-700 font-semibold hover:bg-amber-700 hover:text-white transition-all duration-300">
            Load More Offers
            <ArrowRight className="h-4 w-4" />
        </button>
        </Link>
    </div>
    </section>
  );
};

export default FeaturedOffers;