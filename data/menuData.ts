export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  discountedPrice?: number
  isDiscount: boolean
  preparationTime: number
  popularityTag: "popular" | "chef-special" | "trending" | "bestseller" | "fan-favorite" | null
  rating: number
  slug: string
  isVeg: boolean
  image: string
}

export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Butter Chicken",
    description: "Tender chicken in creamy tomato gravy with aromatic spices and a hint of fenugreek.",
    price: 14.99,
    discountedPrice: 11.99,
    isDiscount: true,
    preparationTime: 25,
    popularityTag: "bestseller",
    rating: 4.8,
    slug: "butter-chicken",
    isVeg: false,
    image: "/uploads/butter-chicken.png",
  },
  {
    id: "2",
    name: "Paneer Tikka",
    description: "Grilled cottage cheese marinated in yogurt and Indian spices, served with mint chutney.",
    price: 12.99,
    discountedPrice: undefined,
    isDiscount: false,
    preparationTime: 20,
    popularityTag: "popular",
    rating: 4.7,
    slug: "paneer-tikka",
    isVeg: true,
    image: "/uploads/paneer-tikka.png",
  },
  {
    id: "3",
    name: "Biryani",
    description: "Fragrant basmati rice cooked with aromatic spices, herbs, and your choice of meat or vegetables.",
    price: 13.99,
    discountedPrice: 10.99,
    isDiscount: true,
    preparationTime: 30,
    popularityTag: "chef-special",
    rating: 4.9,
    slug: "biryani",
    isVeg: false,
    image: "/uploads/biryani.png",
  },
  {
    id: "4",
    name: "Veg Thali",
    description: "Complete meal with dal, sabzi, roti, rice, raita, and dessert.",
    price: 11.99,
    discountedPrice: undefined,
    isDiscount: false,
    preparationTime: 20,
    popularityTag: "fan-favorite",
    rating: 4.6,
    slug: "veg-thali",
    isVeg: true,
    image: "/uploads/veg-thali.png",
  },
  {
    id: "5",
    name: "Garlic Naan",
    description: "Soft bread topped with fresh garlic and butter, baked in tandoor.",
    price: 3.99,
    discountedPrice: undefined,
    isDiscount: false,
    preparationTime: 10,
    popularityTag: "trending",
    rating: 4.8,
    slug: "garlic-naan",
    isVeg: true,
    image: "/uploads/garlic-naan.png",
  },
  {
    id: "6",
    name: "Chicken Tikka Masala",
    description: "Grilled chicken chunks in a rich, creamy tomato-based curry.",
    price: 15.99,
    discountedPrice: 13.99,
    isDiscount: true,
    preparationTime: 25,
    popularityTag: "popular",
    rating: 4.7,
    slug: "chicken-tikka-masala",
    isVeg: false,
    image: "/uploads/chicken-tikka-masala.png",
  },
]