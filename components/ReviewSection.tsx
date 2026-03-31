
"use client";

import { useState } from "react";
import { 
  Star, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  Award, 
  Users, 
  Clock, 
  Tag,
  ThumbsUp,
  Heart,
  Zap,
  Coffee,
  CheckCircle
} from "lucide-react";
import ReviewCard from "./card/Review";
import { Review, reviewStats, availableTags } from "@/data/reviewData";

// Tag configuration for icons and colors
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

interface ReviewSectionProps {
  reviews: Review[];
  totalReviews?: number;
  averageRating?: number;
}

const ReviewSection = ({ 
  reviews, 
  totalReviews = reviewStats.totalReviews,
  averageRating = reviewStats.averageRating 
}: ReviewSectionProps) => {
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [sortBy, setSortBy] = useState<"newest" | "highest" | "lowest">("newest");
  const [showStats, setShowStats] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Filter reviews by selected tag
  const getFilteredReviews = () => {
    if (!selectedTag) return reviews;
    return reviews.filter(review => review.tags?.includes(selectedTag));
  };

  // Sort reviews based on selected option
  const getSortedReviews = () => {
    const filtered = getFilteredReviews();
    const sorted = [...filtered];
    switch (sortBy) {
      case "newest":
        return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case "highest":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "lowest":
        return sorted.sort((a, b) => a.rating - b.rating);
      default:
        return sorted;
    }
  };

  const sortedReviews = getSortedReviews();
  const displayedReviews = sortedReviews.slice(0, visibleReviews);
  const hasMore = visibleReviews < sortedReviews.length;

  // Calculate rating distribution percentages
  const getPercentage = (count: number) => (count / totalReviews) * 100;

  // Get star rating breakdown
  const ratingBreakdown = [
    { stars: 5, count: reviewStats.ratingDistribution[5], label: "5 stars" },
    { stars: 4, count: reviewStats.ratingDistribution[4], label: "4 stars" },
    { stars: 3, count: reviewStats.ratingDistribution[3], label: "3 stars" },
    { stars: 2, count: reviewStats.ratingDistribution[2], label: "2 stars" },
    { stars: 1, count: reviewStats.ratingDistribution[1], label: "1 star" },
  ];

  // Calculate average rating from actual reviews if available
  const displayAverageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : averageRating;

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-stone-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-sm font-bold text-amber-700 uppercase tracking-widest mb-3">
            Customer Love
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4">
            What Our Food Lovers Say
          </h3>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have made us their favorite dining destination
          </p>
        </div>

        {/* Stats and Reviews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Side - Stats & Rating Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 sticky top-24">
              {/* Overall Rating */}
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-stone-900 mb-2">{displayAverageRating}</div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Number(displayAverageRating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-stone-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-stone-600">Based on {reviews.length || totalReviews} reviews</p>
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-3 mb-6">
                {ratingBreakdown.map(({ stars, count, label }) => (
                  <div key={stars} className="flex items-center gap-3">
                    <div className="text-sm text-stone-600 w-16">{label}</div>
                    <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${getPercentage(count)}%` }}
                      />
                    </div>
                    <div className="text-sm text-stone-500 w-12">{count}</div>
                  </div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="text-center p-3 bg-amber-50 rounded-xl">
                  <TrendingUp className="h-5 w-5 text-amber-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-stone-900">98%</div>
                  <div className="text-xs text-stone-600">Would order again</div>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-xl">
                  <Clock className="h-5 w-5 text-amber-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-stone-900">&lt;30min</div>
                  <div className="text-xs text-stone-600">Avg. delivery time</div>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-xl">
                  <Award className="h-5 w-5 text-amber-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-stone-900">4.8★</div>
                  <div className="text-xs text-stone-600">Food quality rating</div>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-xl">
                  <Users className="h-5 w-5 text-amber-600 mx-auto mb-1" />
                  <div className="text-lg font-bold text-stone-900">1.2k+</div>
                  <div className="text-xs text-stone-600">Happy customers</div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Side - Reviews List */}
          <div className="lg:col-span-2">
            {/* Sort Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-stone-600">Sort by:</span>
                <div className="flex gap-2">
                  {[
                    { value: "newest", label: "Newest" },
                    { value: "highest", label: "Highest Rated" },
                    { value: "lowest", label: "Lowest Rated" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value as any)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                        sortBy === option.value
                          ? "bg-amber-700 text-white"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => setShowStats(!showStats)}
                className="lg:hidden flex items-center gap-1 text-sm text-amber-700"
              >
                {showStats ? "Hide Stats" : "Show Stats"}
                {showStats ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-stone-500">
                Showing {displayedReviews.length} of {sortedReviews.length} review{sortedReviews.length !== 1 ? 's' : ''}
                {selectedTag && <span> with tag <span className="font-medium text-amber-700">{tagConfig[selectedTag]?.label || selectedTag}</span></span>}
              </p>
            </div>

            {/* Reviews Grid */}
            <div className="space-y-4">
              {displayedReviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  id={review.id}
                  name={review.name}
                  rating={review.rating}
                  description={review.description}
                  date={review.date}
                  verified={review.verified}
                  tags={review.tags}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setVisibleReviews(prev => Math.min(prev + 3, sortedReviews.length))}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-amber-700 text-amber-700 font-semibold hover:bg-amber-700 hover:text-white transition-all duration-300"
                >
                  Load More Reviews
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Empty State */}
            {sortedReviews.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
                <p className="text-stone-500 mb-2">No reviews found</p>
                {selectedTag && (
                  <button
                    onClick={() => setSelectedTag(null)}
                    className="text-sm text-amber-700 hover:text-amber-800 font-medium"
                  >
                    Clear tag filter
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Call to Action - Write Review */}
        <div className="mt-12 text-center">
          <button className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-amber-700 to-amber-800 text-white font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
            Write a Review
            <Star className="h-5 w-5" />
          </button>
          <p className="text-sm text-stone-500 mt-3">
            Share your dining experience with our community
          </p>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;