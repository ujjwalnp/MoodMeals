
export interface Review {
  id: string;
  name: string;
  rating: number;
  description: string;
  date: string;
  verified?: boolean;
  tags?: string[];
}

export const featuredReviews: Review[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    rating: 5,
    description: "Absolutely delicious! The butter chicken was perfectly spiced and the naan was fresh and fluffy. Best Indian food I've had in years!",
    date: "2024-02-15",
    verified: true,
    tags: ["tasty", "authentic", "generous-portions", "recommend"],
  },
  {
    id: "2",
    name: "Michael Chen",
    rating: 5,
    description: "Ordered the biryani and it was exceptional. The portion size was generous and the flavors were authentic. Will definitely order again!",
    date: "2024-02-14",
    verified: true,
    tags: ["authentic", "generous-portions", "value-for-money", "recommend"],
  },
  {
    id: "3",
    name: "Emma Williams",
    rating: 4,
    description: "Great food, fast delivery. The paneer tikka masala was creamy and delicious. Slightly on the expensive side but worth it for the quality.",
    date: "2024-02-13",
    verified: false,
    tags: ["fast-delivery", "tasty", "packaging"],
  },
  {
    id: "4",
    name: "David Rodriguez",
    rating: 5,
    description: "Hands down the best dal makhani I've ever had! The restaurant maintained great hygiene and packaging was spill-proof. Highly recommended!",
    date: "2024-02-12",
    verified: true,
    tags: ["packaging", "authentic", "fresh-ingredients", "recommend"],
  },
  {
    id: "5",
    name: "Lisa Thompson",
    rating: 5,
    description: "Amazing experience! The garlic naan was crispy and the chicken tikka was juicy. My new go-to place for Indian cuisine.",
    date: "2024-02-11",
    verified: true,
    tags: ["tasty", "fast-delivery", "friendly-service", "value-for-money"],
  },
  {
    id: "6",
    name: "James Wilson",
    rating: 4,
    description: "Really good food! The delivery was on time and everything was hot. Would recommend the lamb rogan josh.",
    date: "2024-02-10",
    verified: false,
    tags: ["on-time", "good-value", "tasty"],
  },
];

export const availableTags = [
  { id: "tasty", label: "Tasty", icon: "Award" },
  { id: "fast-delivery", label: "Fast Delivery", icon: "Clock" },
  { id: "good-value", label: "Good Value", icon: "ThumbsUp" },
  { id: "generous-portions", label: "Generous Portions", icon: "Heart" },
  { id: "authentic", label: "Authentic", icon: "Award" },
  { id: "fresh-ingredients", label: "Fresh Ingredients", icon: "Coffee" },
  { id: "spicy", label: "Spicy", icon: "Zap" },
  { id: "packaging", label: "Great Packaging", icon: "CheckCircle" },
  { id: "on-time", label: "On Time", icon: "Clock" },
  { id: "friendly-service", label: "Friendly Service", icon: "Heart" },
  { id: "value-for-money", label: "Value for Money", icon: "ThumbsUp" },
  { id: "recommend", label: "Highly Recommend", icon: "Award" },
];

export const reviewStats = {
  averageRating: 4.7,
  totalReviews: 128,
  ratingDistribution: {
    5: 85,
    4: 28,
    3: 10,
    2: 3,
    1: 2,
  },
};