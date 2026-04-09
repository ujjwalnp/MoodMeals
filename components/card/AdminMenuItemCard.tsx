"use client"

import Image from "next/image"
import { Star, Clock, Edit, Trash2, EyeOff, Package } from "lucide-react"

interface AdminMenuItemCardProps {
  id: string
  name: string
  description: string
  price: number
  discountedPrice?: number
  isDiscount?: boolean
  preparationTime: number
  popularityTag: string | null
  rating: number
  isVeg: boolean
  image: string | null
  isAvailable: boolean
  index?: number
  onEdit: () => void
  onDelete: () => void
}

export default function AdminMenuItemCard({
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
  isAvailable,
  index = 0,
  onEdit,
  onDelete,
}: AdminMenuItemCardProps) {
  const getPopularityTagDetails = () => {
    switch (popularityTag) {
      case "POPULAR":
        return { emoji: "🔥", text: "Popular", color: "bg-orange-500" }
      case "CHEF_SPECIAL":
        return { emoji: "👨‍🍳", text: "Chef's Special", color: "bg-amber-600" }
      case "TRENDING":
        return { emoji: "📈", text: "Trending", color: "bg-blue-500" }
      case "BESTSELLER":
        return { emoji: "🏆", text: "Bestseller", color: "bg-yellow-600" }
      case "FAN_FAVORITE":
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

  return (
    <div
      className={`group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border ${
        isAvailable ? 'border-stone-100' : 'border-red-200 opacity-75'
      } opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards] relative`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Availability Badge */}
      {!isAvailable && (
        <div className="absolute top-3 left-3 z-20 bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
          <EyeOff className="h-3 w-3" />
          <span>Unavailable</span>
        </div>
      )}
      
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden bg-stone-100">
        <Image
          src={image || "/placeholder-food.jpg"}
          alt={name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
        />
        
        {tagDetails && isAvailable && (
          <div className={`absolute top-3 left-3 ${tagDetails.color} text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md z-10`}>
            <span>{tagDetails.emoji}</span>
            <span>{tagDetails.text}</span>
          </div>
        )}
        
        <div className={`absolute top-3 right-3 ${vegDetails.color} text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md z-10`}>
          <span>{vegDetails.emoji}</span>
          <span>{vegDetails.text}</span>
        </div>

        {/* Action Buttons Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-20">
          <button
            onClick={onEdit}
            className="bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110"
          >
            <Trash2 className="h-5 w-5" />
          </button>
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
            {!isAvailable && (
              <span className="text-xs text-red-500 flex items-center gap-1">
                <Package className="h-3 w-3" />
                Out of Stock
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}