
"use client";

import { Star, CheckCircle, Calendar, Tag, ThumbsUp, Award, Clock, Coffee, Heart, Zap } from "lucide-react";

interface ReviewCardProps {
  id: string;
  name: string;
  rating: number;
  description: string;
  date: string;
  verified?: boolean;
  tags?: string[];
}

// Predefined tags with their icons and colors
const tagConfig: Record<string, { icon: any; color: string; label: string }> = {
  "tasty": { icon: Award, color: "bg-orange-100 text-orange-700", label: "Tasty" },
  "fast-delivery": { icon: Clock, color: "bg-green-100 text-green-700", label: "Fast Delivery" },
  "good-value": { icon: ThumbsUp, color: "bg-blue-100 text-blue-700", label: "Good Value" },
  "generous-portions": { icon: Heart, color: "bg-red-100 text-red-700", label: "Generous Portions" },
  "authentic": { icon: Award, color: "bg-amber-100 text-amber-700", label: "Authentic" },
  "fresh-ingredients": { icon: Coffee, color: "bg-emerald-100 text-emerald-700", label: "Fresh" },
  "spicy": { icon: Zap, color: "bg-rose-100 text-rose-700", label: "Spicy" },
  "packaging": { icon: CheckCircle, color: "bg-purple-100 text-purple-700", label: "Great Packaging" },
  "on-time": { icon: Clock, color: "bg-teal-100 text-teal-700", label: "On Time" },
  "friendly-service": { icon: Heart, color: "bg-pink-100 text-pink-700", label: "Friendly Service" },
  "value-for-money": { icon: ThumbsUp, color: "bg-lime-100 text-lime-700", label: "Value for Money" },
  "recommend": { icon: Award, color: "bg-indigo-100 text-indigo-700", label: "Highly Recommend" },
};

// Helper function to get initials from name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Helper function to generate consistent color based on name
const getAvatarColor = (name: string): string => {
  const colors = [
    'bg-red-100 text-red-700',
    'bg-orange-100 text-orange-700',
    'bg-amber-100 text-amber-700',
    'bg-yellow-100 text-yellow-700',
    'bg-lime-100 text-lime-700',
    'bg-green-100 text-green-700',
    'bg-emerald-100 text-emerald-700',
    'bg-teal-100 text-teal-700',
    'bg-cyan-100 text-cyan-700',
    'bg-sky-100 text-sky-700',
    'bg-blue-100 text-blue-700',
    'bg-indigo-100 text-indigo-700',
    'bg-violet-100 text-violet-700',
    'bg-purple-100 text-purple-700',
    'bg-fuchsia-100 text-fuchsia-700',
    'bg-pink-100 text-pink-700',
    'bg-rose-100 text-rose-700',
  ];
  
  // Use name to get consistent color index
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const ReviewCard = ({
  name,
  rating,
  description,
  date,
  verified = false,
  tags = [],
}: ReviewCardProps) => {
  const initials = getInitials(name);
  const avatarColorClass = getAvatarColor(name);

  return (
    <article className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar with Initials */}
          <div className={`w-12 h-12 rounded-full ${avatarColorClass} flex items-center justify-center font-semibold text-lg shadow-sm`}>
            {initials}
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-stone-900">{name}</h4>
              {verified && (
                <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                  <CheckCircle className="h-3 w-3" />
                  <span>Verified Purchase</span>
                </div>
              )}
            </div>
            
            {/* Rating Stars */}
            <div className="flex items-center gap-1 mt-1">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3.5 w-3.5 ${
                      star <= rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-stone-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-stone-500 ml-2">{rating}.0</span>
            </div>
          </div>
        </div>
        
        {/* Date */}
        <div className="flex items-center gap-1 text-xs text-stone-400">
          <Calendar className="h-3 w-3" />
          <span>{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>
      
      {/* Review Description */}
      <p className="text-stone-700 leading-relaxed mb-4 text-sm">
        {description}
      </p>
      
      {/* Tags Section */}
      {tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => {
              const tagInfo = tagConfig[tag] || {
                icon: Tag,
                color: "bg-stone-100 text-stone-700",
                label: tag.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
              };
              const IconComponent = tagInfo.icon;
              
              return (
                <div
                  key={tag}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${tagInfo.color}`}
                >
                  <IconComponent className="h-3 w-3" />
                  <span>{tagInfo.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Helpful Counter (optional - can be kept if needed) */}
      {/* Uncomment if you want to keep helpful count
      <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
        <button className="flex items-center gap-2 text-xs text-stone-500 hover:text-amber-700 transition-colors">
          <ThumbsUp className="h-3.5 w-3.5" />
          <span>Helpful ({helpfulCount})</span>
        </button>
      </div>
      */}
    </article>
  );
};

export default ReviewCard;