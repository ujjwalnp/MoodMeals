"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Minus, ShoppingCart, Star, Clock } from "lucide-react"
import { useCart } from "@/context/CartContext"

interface MenuItemCardProps {
  id: string
  name: string
  description: string
  price: number
  discountedPrice?: number
  isDiscount?: boolean
  preparationTime: number
  popularityTag: "popular" | "chef-special" | "trending" | "bestseller" | "fan-favorite" | null
  rating: number
  isVeg: boolean
  image: string
  index?: number
}

export default function MenuItemCard({
  id,
  name,
  description,
  price,
  discountedPrice,
  isDiscount = false,
  preparationTime,
  popularityTag,
  rating,
  isVeg,
  image,
  index = 0,
}: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  const getPopularityTagDetails = () => {
    switch (popularityTag) {
      case "popular":
        return { emoji: "🔥", text: "Popular", color: "bg-orange-500" }
      case "chef-special":
        return { emoji: "👨‍🍳", text: "Chef's Special", color: "bg-amber-600" }
      case "trending":
        return { emoji: "📈", text: "Trending", color: "bg-blue-500" }
      case "bestseller":
        return { emoji: "🏆", text: "Bestseller", color: "bg-yellow-600" }
      case "fan-favorite":
        return { emoji: "❤️", text: "Fan Favorite", color: "bg-rose-500" }
      default:
        return null
    }
  }

  const getVegDetails = () => {
    return isVeg 
      ? { emoji: "🥬", text: "Veg", color: "bg-green-600" }
      : { emoji: "🍗", text: "Non-Veg", color: "bg-red-600" }
  }

  const tagDetails = getPopularityTagDetails()
  const vegDetails = getVegDetails()
  const finalPrice = isDiscount && discountedPrice ? discountedPrice : price

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const handleAddToCart = () => {
    addToCart(id, name, quantity, finalPrice)
    setQuantity(1)
  }

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-stone-100 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden bg-stone-100">
        <Image
          src={image || "/placeholder-food.jpg"}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
        />
        
        {tagDetails && (
          <div className={`absolute top-3 left-3 ${tagDetails.color} text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md`}>
            <span>{tagDetails.emoji}</span>
            <span>{tagDetails.text}</span>
          </div>
        )}
        
        <div className={`absolute top-3 right-3 ${vegDetails.color} text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md`}>
          <span>{vegDetails.emoji}</span>
          <span>{vegDetails.text}</span>
        </div>
      </div>

      <div className="p-5">
        <h4 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-amber-600 transition-colors line-clamp-1">
          {name}
        </h4>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span className="text-sm font-semibold text-stone-900">{rating.toFixed(1)}</span>
          </div>
          <span className="text-xs text-stone-400">•</span>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-stone-400" />
            <span className="text-xs text-stone-500">{preparationTime} mins</span>
          </div>
        </div>

        <p className="text-stone-500 text-sm mb-4 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <div>
            {isDiscount && discountedPrice ? (
              <div>
                <span className="text-xs text-stone-400 line-through block">
                  NPR {price.toFixed(2)}
                </span>
                <span className="text-2xl font-black text-amber-600">
                  NPR {finalPrice.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-2xl font-black text-amber-600">
                NPR {price.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
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

            <button
              onClick={handleAddToCart}
              className="group relative w-10 h-10 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all duration-300 cursor-pointer shadow-md overflow-hidden"
            >
              {/* Ripple effect background */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              
              {/* Animated ring pulse */}
              <div className="absolute inset-0 rounded-full border-2 border-amber-300 opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500"></div>
              
              {/* Cart icon with bounce effect */}
              <ShoppingCart className="h-4 w-4 text-white relative z-10 transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
              
              {/* Plus indicator for "add" action */}
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 delay-100">
                +
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}