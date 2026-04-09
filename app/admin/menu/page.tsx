"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Search, X, Filter, ArrowUpDown, DollarSign, Star as StarIcon,
  Clock, SlidersHorizontal, Plus, Trash2, Edit, Image as ImageIcon,
  Loader2, AlertCircle, CheckCircle
} from "lucide-react";
import AdminMenuItemCard from "@/components/card/AdminMenuItemCard";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  discountedPrice?: number;
  isDiscount: boolean;
  preparationTime: number;
  popularityTag: string | null;
  rating: number;
  isVeg: boolean;
  image: string | null;
  isAvailable: boolean;
  slug: string;
}

export default function AdminMenuPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showVegOnly, setShowVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>("default");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<MenuItem | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [navbarHeight, setNavbarHeight] = useState(0);

  const router = useRouter();

  useEffect(() => {
    // Check if user is admin
    const checkAdminAuth = async () => {
      try {
        const response = await fetch("/api/auth/check-admin");
        if (!response.ok) {
          router.push("/login?redirect=/admin/menu");
        }
      } catch (error) {
        router.push("/login?redirect=/admin/menu");
      }
    };
    
    checkAdminAuth();
    setIsLoaded(true);
    fetchMenuItems();
    
    const navbar = document.querySelector('nav');
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
  }, [router]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/menu");
      if (!response.ok) throw new Error("Failed to fetch menu");
      const data = await response.json();
      setMenuItems(data);
      
      // Set max price range
      const maxPrice = Math.max(...data.map((item: MenuItem) => 
        item.isDiscount && item.discountedPrice ? item.discountedPrice : item.price
      ));
      setPriceRange([0, maxPrice]);
    } catch (error) {
      showToast("error", "Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeleteItem = async (item: MenuItem) => {
    try {
      const response = await fetch(`/api/admin/menu/${item.id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to delete");
      
      showToast("success", `${item.name} deleted successfully`);
      fetchMenuItems();
    } catch (error) {
      showToast("error", "Failed to delete item");
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const categories = [
    { id: "all", name: "All Items", emoji: "✨" },
    { id: "POPULAR", name: "Popular", emoji: "🔥" },
    { id: "CHEF_SPECIAL", name: "Chef's Special", emoji: "👨‍🍳" },
    { id: "TRENDING", name: "Trending", emoji: "📈" },
    { id: "BESTSELLER", name: "Bestseller", emoji: "🏆" },
    { id: "FAN_FAVORITE", name: "Fan Favorite", emoji: "❤️" },
  ];

  const sortOptions = [
    { value: "default", label: "Default", icon: ArrowUpDown, emoji: "📌" },
    { value: "price-asc", label: "Price: Low to High", icon: DollarSign, emoji: "💰⬆️" },
    { value: "price-desc", label: "Price: High to Low", icon: DollarSign, emoji: "💰⬇️" },
    { value: "rating-desc", label: "Rating: High to Low", icon: StarIcon, emoji: "⭐⬇️" },
    { value: "prep-asc", label: "Prep Time: Fastest First", icon: Clock, emoji: "⏱️⬆️" },
  ];

  const filteredAndSortedItems = useMemo(() => {
    let filtered = menuItems.filter((item) => {
      if (selectedCategory !== "all" && item.popularityTag !== selectedCategory) {
        return false;
      }
      
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesVeg = showVegOnly ? item.isVeg : true;
      
      const itemPrice = item.isDiscount && item.discountedPrice ? item.discountedPrice : item.price;
      const matchesPrice = itemPrice >= priceRange[0] && itemPrice <= priceRange[1];
      
      return matchesSearch && matchesVeg && matchesPrice;
    });

    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => {
          const priceA = a.isDiscount && a.discountedPrice ? a.discountedPrice : a.price;
          const priceB = b.isDiscount && b.discountedPrice ? b.discountedPrice : b.price;
          return priceA - priceB;
        });
        break;
      case "price-desc":
        filtered.sort((a, b) => {
          const priceA = a.isDiscount && a.discountedPrice ? a.discountedPrice : a.price;
          const priceB = b.isDiscount && b.discountedPrice ? b.discountedPrice : b.price;
          return priceB - priceA;
        });
        break;
      case "rating-desc":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "prep-asc":
        filtered.sort((a, b) => a.preparationTime - b.preparationTime);
        break;
      default:
        filtered.sort((a, b) => {
          if (a.popularityTag && !b.popularityTag) return -1;
          if (!a.popularityTag && b.popularityTag) return 1;
          return b.rating - a.rating;
        });
    }

    return filtered;
  }, [menuItems, selectedCategory, searchTerm, showVegOnly, sortBy, priceRange]);

  const clearAllFilters = () => {
    setSearchTerm("");
    setShowVegOnly(false);
    setSelectedCategory("all");
    setSortBy("default");
    const maxPrice = Math.max(...menuItems.map(item => 
      item.isDiscount && item.discountedPrice ? item.discountedPrice : item.price
    ));
    setPriceRange([0, maxPrice]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div style={{ paddingTop: navbarHeight > 0 ? `${navbarHeight}px` : '80px' }}>
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className={`text-center mb-16 transition-all duration-1000 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg mb-6">
              <span className="text-3xl animate-bounce">👨‍💼</span>
              <span className="text-3xl animate-pulse">🍽️</span>
              <span className="text-3xl animate-bounce">✨</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
              Menu Management
            </h1>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto">
              Manage your restaurant menu 🎯 <span className="inline-block animate-wave">👨‍🍳</span>
            </p>
          </div>

          {/* Add Item Button */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <Plus className="h-5 w-5" />
              Add New Item
            </button>
          </div>

          {/* Search and Filters */}
          <div className={`transition-all duration-1000 delay-200 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search menu items... 🔍"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  />
                </div>

                <div className="relative min-w-[200px]">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white appearance-none cursor-pointer"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.emoji} {option.label}
                      </option>
                    ))}
                  </select>
                  <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 h-4 w-4 pointer-events-none" />
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                    showFilters
                      ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md"
                      : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-50"
                  }`}
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
              </div>
            </div>

            {showFilters && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 animate-slide-down">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-stone-800 flex items-center gap-2">
                    <Filter className="h-5 w-5 text-amber-600" />
                    Filters
                  </h3>
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Clear All
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-1">
                      🥬 Diet Type
                    </label>
                    <button
                      onClick={() => setShowVegOnly(!showVegOnly)}
                      className={`w-full px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                        showVegOnly
                          ? "bg-green-600 text-white shadow-md"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {showVegOnly ? "🌱 Veg Only" : "🥩 All Items"}
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-1">
                      💰 Price Range (NPR)
                    </label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                          placeholder="Min"
                          className="w-1/2 px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                          placeholder="Max"
                          className="w-1/2 px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center mb-4 text-stone-500 font-medium">
              Found {filteredAndSortedItems.length} menu {filteredAndSortedItems.length === 1 ? "item" : "items"} 🍽️
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category, idx) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`group relative px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 transform hover:scale-110 ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-2xl scale-110"
                      : "bg-white text-stone-700 hover:shadow-xl hover:bg-amber-50"
                  }`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{category.emoji}</span>
                    {category.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Menu Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-amber-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`transition-all duration-700 transform ${
                    isLoaded ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <AdminMenuItemCard
                    {...item}
                    index={index}
                    onEdit={() => setEditingItem(item)}
                    onDelete={() => setShowDeleteConfirm(item)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && filteredAndSortedItems.length === 0 && (
            <div className="text-center py-20 animate-fade-in">
              <div className="text-6xl mb-4">😢</div>
              <p className="text-stone-500 text-lg mb-2">No menu items found</p>
              <button
                onClick={clearAllFilters}
                className="mt-4 text-amber-600 font-semibold hover:underline inline-flex items-center gap-2"
              >
                Clear all filters ✨
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingItem) && (
        <MenuItemModal
          item={editingItem}
          onClose={() => {
            setShowAddModal(false);
            setEditingItem(null);
          }}
          onSuccess={() => {
            fetchMenuItems();
            setShowAddModal(false);
            setEditingItem(null);
            showToast("success", editingItem ? "Item updated successfully" : "Item added successfully");
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          item={showDeleteConfirm}
          onConfirm={() => handleDeleteItem(showDeleteConfirm)}
          onCancel={() => setShowDeleteConfirm(null)}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 animate-slide-up">
          <div className={`flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
            {toast.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}

// Modal Components
function MenuItemModal({ item, onClose, onSuccess }: { item?: MenuItem | null; onClose: () => void; onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: item?.name || "",
    description: item?.description || "",
    price: item?.price || 0,
    isDiscount: item?.isDiscount || false,
    discountedPrice: item?.discountedPrice || 0,
    preparationTime: item?.preparationTime || 30,
    popularityTag: item?.popularityTag || "",
    isVeg: item?.isVeg ?? true,
    isAvailable: item?.isAvailable ?? true,
    image: null as File | null,
    existingImage: item?.image || null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(item?.image || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("price", formData.price.toString());
      submitData.append("isDiscount", formData.isDiscount.toString());
      if (formData.isDiscount) {
        submitData.append("discountedPrice", formData.discountedPrice.toString());
      }
      submitData.append("preparationTime", formData.preparationTime.toString());
      submitData.append("popularityTag", formData.popularityTag);
      submitData.append("isVeg", formData.isVeg.toString());
      submitData.append("isAvailable", formData.isAvailable.toString());
      if (formData.image) {
        submitData.append("image", formData.image);
      }

      const url = item ? `/api/admin/menu/${item.id}` : "/api/admin/menu";
      const method = item ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: submitData,
      });

      if (!response.ok) throw new Error("Failed to save menu item");
      
      onSuccess();
    } catch (error) {
      alert("Failed to save menu item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-stone-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-stone-800">
            {item ? "Edit Menu Item" : "Add New Menu Item"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Item Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Price (NPR) *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Preparation Time (mins)</label>
              <input
                type="number"
                min="5"
                max="120"
                value={formData.preparationTime}
                onChange={(e) => setFormData({ ...formData, preparationTime: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isDiscount}
                onChange={(e) => setFormData({ ...formData, isDiscount: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm font-semibold text-stone-700">Enable Discount</span>
            </label>

            {formData.isDiscount && (
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Discounted Price"
                  min="0"
                  step="0.01"
                  value={formData.discountedPrice}
                  onChange={(e) => setFormData({ ...formData, discountedPrice: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Popularity Tag</label>
              <select
                value={formData.popularityTag}
                onChange={(e) => setFormData({ ...formData, popularityTag: e.target.value })}
                className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="">None</option>
                <option value="POPULAR">🔥 Popular</option>
                <option value="CHEF_SPECIAL">👨‍🍳 Chef's Special</option>
                <option value="TRENDING">📈 Trending</option>
                <option value="BESTSELLER">🏆 Bestseller</option>
                <option value="FAN_FAVORITE">❤️ Fan Favorite</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Diet Type</label>
              <select
                value={formData.isVeg ? "veg" : "nonveg"}
                onChange={(e) => setFormData({ ...formData, isVeg: e.target.value === "veg" })}
                className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="veg">🌱 Vegetarian</option>
                <option value="nonveg">🍗 Non-Vegetarian</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">Item Image</label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                  <Image 
                    src={imagePreview} 
                    alt="Preview" 
                    fill 
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              )}
              <label className="flex-1 cursor-pointer">
                <div className="border-2 border-dashed border-stone-300 rounded-xl p-4 text-center hover:border-amber-500 transition-colors">
                  <ImageIcon className="h-8 w-8 mx-auto text-stone-400 mb-2" />
                  <span className="text-sm text-stone-600">Click to upload image</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm font-semibold text-stone-700">Available for ordering</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-stone-100 text-stone-700 rounded-xl font-semibold hover:bg-stone-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold hover:scale-105 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : (item ? "Update" : "Add")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ item, onConfirm, onCancel }: { item: MenuItem; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🗑️</div>
          <h3 className="text-xl font-bold text-stone-800 mb-2">Delete Menu Item</h3>
          <p className="text-stone-600 mb-6">
            Are you sure you want to delete <span className="font-semibold">{item.name}</span>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-stone-100 text-stone-700 rounded-xl font-semibold hover:bg-stone-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}