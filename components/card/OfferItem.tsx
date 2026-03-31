
"use client";

import { useState } from "react";
import { ShoppingCart, Star, Clock, Gift, Plus, Minus } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface OfferItemProps {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  isDiscount?: boolean;
  image?: string;
  rating: number;
  preparationTime: number;
  description: string;
  isVeg: boolean;
  popularityTag?: string | null;
  index?: number;
}

export default function OfferItem(props: OfferItemProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const discountPercent = ((props.price - (props.discountedPrice || props.price)) / props.price) * 100;
  const savings = props.price - (props.discountedPrice || props.price);
  const finalPrice = props.isDiscount && props.discountedPrice ? props.discountedPrice : props.price;

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addToCart(props.id, props.name, quantity, finalPrice);
    setQuantity(1); // Reset quantity after adding to cart
  };

  return (
    <div className="relative group">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-stone-100">
        {/* Image Section */}
        <div className="relative h-56 overflow-hidden bg-stone-100">
          <img
            src={props.image || "/placeholder-food.jpg"}
            alt={props.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />

          {/* Discount Tag - Top Left */}
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-orange-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-lg">
            <span className="text-base">🏷️</span>
            <span>{discountPercent.toFixed(0)}% OFF</span>
          </div>

          {/* Savings Badge - Bottom Left */}
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-lg">
            <Gift className="h-3 w-3 text-amber-400" />
            <span>Save NPR {savings.toFixed(0)}</span>
          </div>

          {/* Veg/Non-Veg Tag */}
          <div className={`absolute top-3 right-3 ${props.isVeg ? "bg-green-600" : "bg-red-600"} text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md`}>
            <span>{props.isVeg ? "🥬" : "🍗"}</span>
            <span>{props.isVeg ? "Veg" : "Non-Veg"}</span>
          </div>
        </div>

        <div className="p-5">
          <h4 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-amber-600 transition-colors line-clamp-1">
            {props.name}
          </h4>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span className="text-sm font-semibold text-stone-900">{props.rating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-stone-400">•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-stone-400" />
              <span className="text-xs text-stone-500">{props.preparationTime} mins</span>
            </div>
          </div>

          <p className="text-stone-500 text-sm mb-4 line-clamp-2">
            {props.description}
          </p>

          {/* Price Section with Quantity Selector */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <div>
              {props.isDiscount && props.discountedPrice ? (
                <div>
                  <span className="text-xs text-stone-400 line-through block">
                    NPR {props.price.toFixed(2)}
                  </span>
                  <span className="text-2xl font-black text-amber-600">
                    NPR {finalPrice.toFixed(2)}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-black text-amber-600">
                  NPR {props.price.toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Quantity Selector */}
              <div className="flex items-center bg-stone-100 rounded-full">
                <button
                  onClick={decreaseQuantity}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-200 transition-colors text-stone-700"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-8 text-center text-sm font-semibold text-stone-900">
                  {quantity}
                </span>
                <button
                  onClick={increaseQuantity}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-200 transition-colors text-stone-700"
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="group relative w-10 h-10 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all duration-300 cursor-pointer shadow-md overflow-hidden"
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="absolute inset-0 rounded-full border-2 border-amber-300 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500"></div>
                <ShoppingCart className="h-4 w-4 text-white relative z-10 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 delay-100">
                  +
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}