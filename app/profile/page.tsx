// app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  User, Mail, Lock, Star, MapPin, Plus, Edit2, Trash2,
  Check, X, Home, Building, Phone, Save, Key, Eye, EyeOff,
  Star as StarIcon, ThumbsUp, MessageSquare, Calendar, Loader2
} from "lucide-react";

// ==================== TYPES ====================
type Address = {
  id: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  landmark?: string | null;
  phoneNumber: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

type AppReview = {
  id: string;
  orderId: string;
  rating: number;
  title?: string | null;
  description?: string | null;
  tags: string[];
  isVerified: boolean;
  createdAt: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

// ==================== API SERVICE ====================
const api = {
  // User endpoints
  async updateName(name: string): Promise<{ user: User }> {
    const response = await fetch('/api/users/update-name', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) throw new Error('Failed to update name');
    return response.json();
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const response = await fetch('/api/users/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', 
      body: JSON.stringify({ oldPassword: currentPassword, newPassword }),
    });

    const data = await response.json();
    console.log("API RESPONSE:", data);

    if (!response.ok) {
      console.log(currentPassword, newPassword);
      console.log("API ERROR RESPONSE:", data);
      throw new Error(data.message || 'Failed to change password');
    }
    return data;
  },

  // Address endpoints
  async getAddresses(): Promise<{ addresses: Address[] }> {
    const response = await fetch('/api/users/addresses');
    if (!response.ok) throw new Error('Failed to fetch addresses');
    return response.json();
  },

  async createAddress(addressData: Partial<Address>): Promise<{ address: Address }> {
    const response = await fetch('/api/users/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addressData),
    });
    if (!response.ok) throw new Error('Failed to create address');
    return response.json();
  },

  async updateAddress(id: string, addressData: Partial<Address>): Promise<{ address: Address }> {
    const response = await fetch(`/api/users/addresses/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addressData),
    });
    if (!response.ok) throw new Error('Failed to update address');
    return response.json();
  },

  async deleteAddress(id: string): Promise<{ message: string }> {
    const response = await fetch(`/api/users/addresses/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete address');
    return response.json();
  },

  // Reviews endpoint
  async getReviews(): Promise<{ reviews: AppReview[] }> {
    const response = await fetch('/api/users/reviews');
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
  },
};

// ==================== MAIN COMPONENT ====================
export default function ProfilePage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [activeTab, setActiveTab] = useState<"profile" | "addresses" | "reviews">("profile");
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // User state
  const [user, setUser] = useState<User | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  
  // Password state
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  
  // Address state
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState<Partial<Address>>({
    addressLine1: "",
    addressLine2: "",
    city: "Hetauda",
    state: "Bagmati",
    postalCode: "",
    country: "Nepal",
    landmark: "",
    phoneNumber: "",
    isDefault: false,
  });
  
  // Reviews state
  const [reviews, setReviews] = useState<AppReview[]>([]);
  
  // UI state
  const [showSuccessMessage, setShowSuccessMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState("");

  // Fetch user data from session/local storage
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Get current user from session/local storage or from a /api/users/me endpoint
        const response = await fetch('/api/users/me');
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setUser(data.user);
        setNewName(data.user.name);
      } catch (error) {
        console.error('Error fetching user:', error);
        showMessage('Failed to load user data', true);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  // Fetch addresses when tab changes to addresses
  useEffect(() => {
    if (activeTab === "addresses" && user) {
      fetchAddresses();
    }
  }, [activeTab, user]);

  // Fetch reviews when tab changes to reviews
  useEffect(() => {
    if (activeTab === "reviews" && user) {
      fetchReviews();
    }
  }, [activeTab, user]);

  useEffect(() => {
    setIsLoaded(true);
    const navbar = document.querySelector('nav');
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
  }, []);

  const fetchAddresses = async () => {
    try {
      const data = await api.getAddresses();
      setAddresses(data.addresses);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      showMessage('Failed to load addresses', true);
    }
  };

  const fetchReviews = async () => {
    try {
      const data = await api.getReviews();
      setReviews(data.reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      showMessage('Failed to load reviews', true);
    }
  };

  const showMessage = (message: string, isError = false) => {
    if (isError) {
      setShowErrorMessage(message);
      setTimeout(() => setShowErrorMessage(""), 3000);
    } else {
      setShowSuccessMessage(message);
      setTimeout(() => setShowSuccessMessage(""), 3000);
    }
  };

  // ==================== PROFILE FUNCTIONS ====================
  const handleUpdateName = async () => {
    if (!newName.trim()) {
      showMessage("Name cannot be empty", true);
      return;
    }
    
    setIsSubmitting(true);
    try {
      const data = await api.updateName(newName);
      setUser(data.user);
      setIsEditingName(false);
      showMessage("Name updated successfully!");
    } catch (error) {
      console.error('Error updating name:', error);
      showMessage("Failed to update name", true);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleChangePassword = async () => {
    setPasswordError("");
    
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await api.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      showMessage("Password changed successfully!");
    } catch (error: any) {
      console.error('Error changing password:', error);
      setPasswordError(error.message || "Failed to change password");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // ==================== ADDRESS FUNCTIONS ====================
  const handleAddAddress = () => {
    setCurrentAddress(null);
    setAddressForm({
      addressLine1: "",
      addressLine2: "",
      city: "Hetauda",
      state: "Bagmati",
      postalCode: "",
      country: "Nepal",
      landmark: "",
      phoneNumber: "",
      isDefault: false,
    });
    setIsEditingAddress(true);
  };
  
  const handleEditAddress = (address: Address) => {
    setCurrentAddress(address);
    setAddressForm({
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      landmark: address.landmark,
      phoneNumber: address.phoneNumber,
      isDefault: address.isDefault,
    });
    setIsEditingAddress(true);
  };
  
  const handleSaveAddress = async () => {
    if (!addressForm.addressLine1 || !addressForm.postalCode || !addressForm.phoneNumber) {
      showMessage("Please fill all required fields", true);
      return;
    }
    
    setIsSubmitting(true);
    try {
      if (currentAddress) {
        // Update existing address
        const data = await api.updateAddress(currentAddress.id, addressForm);
        setAddresses(prev => prev.map(addr => 
          addr.id === currentAddress.id ? data.address : addr
        ));
        showMessage("Address updated successfully!");
      } else {
        // Add new address
        const data = await api.createAddress(addressForm);
        setAddresses(prev => [...prev, data.address]);
        showMessage("Address added successfully!");
      }
      setIsEditingAddress(false);
    } catch (error) {
      console.error('Error saving address:', error);
      showMessage("Failed to save address", true);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    
    setIsSubmitting(true);
    try {
      await api.deleteAddress(addressId);
      setAddresses(addresses.filter(addr => addr.id !== addressId));
      showMessage("Address deleted successfully!");
    } catch (error) {
      console.error('Error deleting address:', error);
      showMessage("Failed to delete address", true);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSetDefaultAddress = async (addressId: string) => {
    setIsSubmitting(true);
    try {
      const data = await api.updateAddress(addressId, { isDefault: true });
      setAddresses(prev => prev.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId,
      })));
      showMessage("Default address updated!");
    } catch (error) {
      console.error('Error setting default address:', error);
      showMessage("Failed to update default address", true);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // ==================== RATING COMPONENT ====================
  const RatingStars = ({ rating }: { rating: number }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-amber-500 text-amber-500" : "text-stone-300"
            }`}
          />
        ))}
      </div>
    );
  };
  
  // ==================== LOADING STATE ====================
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-amber-600 animate-spin mx-auto mb-4" />
            <p className="text-stone-600">Loading your profile...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-stone-600 mb-4">Failed to load user data</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  
  // ==================== TAB CONTENT ====================
  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* User Info Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl">
              <User className="h-6 w-6 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-stone-800">Profile Information</h2>
          </div>
        </div>
        
        {/* Name Field */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-stone-700 mb-2">Full Name</label>
          {isEditingName ? (
            <div className="flex gap-3">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                autoFocus
              />
              <button
                onClick={handleUpdateName}
                disabled={isSubmitting}
                className="px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
              </button>
              <button
                onClick={() => {
                  setIsEditingName(false);
                  setNewName(user.name);
                }}
                className="px-4 py-2 border border-stone-300 rounded-xl hover:bg-stone-50 transition"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl">
              <span className="text-stone-800">{user.name}</span>
              <button
                onClick={() => setIsEditingName(true)}
                className="text-amber-600 hover:text-amber-700 transition"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        
        {/* Email Field (Read-only) */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
            <Mail className="h-4 w-4 text-amber-600" />
            Email Address
          </label>
          <div className="p-3 bg-stone-50 rounded-xl text-stone-600">
            {user.email}
          </div>
        </div>
        
        {/* Member Since */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-amber-600" />
            Member Since
          </label>
          <div className="p-3 bg-stone-50 rounded-xl text-stone-600">
            {new Date(user.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
        
        {/* Password Change */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
            <Lock className="h-4 w-4 text-amber-600" />
            Password
          </label>
          {!isChangingPassword ? (
            <button
              onClick={() => setIsChangingPassword(true)}
              className="px-4 py-2 border border-amber-600 text-amber-600 rounded-xl hover:bg-amber-50 transition"
            >
              Change Password
            </button>
          ) : (
            <div className="space-y-3">
              {/* Current Password */}
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Current Password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 pr-10 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {/* New Password */}
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 pr-10 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 pr-10 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={handleChangePassword}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Update Password
                </button>
                <button
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordError("");
                    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                  }}
                  className="px-4 py-2 border border-stone-300 rounded-xl hover:bg-stone-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
  const renderAddressesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl">
            <MapPin className="h-6 w-6 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-stone-800">My Addresses</h2>
        </div>
        <button
          onClick={handleAddAddress}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition"
        >
          <Plus className="h-4 w-4" />
          Add Address
        </button>
      </div>
      
      {addresses.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <MapPin className="h-16 w-16 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500">No addresses saved yet</p>
          <button
            onClick={handleAddAddress}
            className="mt-4 text-amber-600 hover:text-amber-700 font-semibold"
          >
            Add your first address →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-white rounded-2xl shadow-lg p-6 relative ${
                address.isDefault ? "ring-2 ring-amber-500" : ""
              }`}
            >
              {address.isDefault && (
                <div className="absolute top-4 right-4 bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-1 rounded-full">
                  Default
                </div>
              )}
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Home className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-stone-800">{address.addressLine1}</p>
                    {address.addressLine2 && (
                      <p className="text-stone-600 text-sm">{address.addressLine2}</p>
                    )}
                    <p className="text-stone-600 text-sm">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="text-stone-600 text-sm">{address.country}</p>
                    {address.landmark && (
                      <p className="text-stone-500 text-sm mt-1">📍 {address.landmark}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Phone className="h-3 w-3 text-stone-400" />
                      <p className="text-stone-600 text-sm">{address.phoneNumber}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-3 border-t border-stone-100">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefaultAddress(address.id)}
                      disabled={isSubmitting}
                      className="text-sm text-amber-600 hover:text-amber-700 transition disabled:opacity-50"
                    >
                      Set as Default
                    </button>
                  )}
                  <button
                    onClick={() => handleEditAddress(address)}
                    className="text-sm text-stone-600 hover:text-stone-800 transition flex items-center gap-1"
                  >
                    <Edit2 className="h-3 w-3" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    disabled={isSubmitting}
                    className="text-sm text-red-500 hover:text-red-600 transition flex items-center gap-1 disabled:opacity-50"
                  >
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Address Form Modal */}
      {isEditingAddress && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-stone-800 mb-4">
                {currentAddress ? "Edit Address" : "Add New Address"}
              </h3>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Address Line 1 *"
                  value={addressForm.addressLine1 || ""}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                
                <input
                  type="text"
                  placeholder="Address Line 2 (Optional)"
                  value={addressForm.addressLine2 || ""}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="City *"
                    value={addressForm.city || "Hetauda"}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="State *"
                    value={addressForm.state || "Bagmati"}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Postal Code *"
                    value={addressForm.postalCode || ""}
                    onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })}
                    className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="Country *"
                    value={addressForm.country || "Nepal"}
                    onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                    className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                
                <input
                  type="text"
                  placeholder="Landmark (Optional)"
                  value={addressForm.landmark || ""}
                  onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={addressForm.phoneNumber || ""}
                  onChange={(e) => setAddressForm({ ...addressForm, phoneNumber: e.target.value })}
                  className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault || false}
                    onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                    className="rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-sm text-stone-700">Set as default address</span>
                </label>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveAddress}
                  disabled={isSubmitting}
                  className="flex-1 py-2 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Address
                </button>
                <button
                  onClick={() => setIsEditingAddress(false)}
                  className="flex-1 py-2 border border-stone-300 rounded-xl hover:bg-stone-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
  const renderReviewsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl">
          <Star className="h-6 w-6 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-stone-800">My App Reviews</h2>
      </div>
      
      {reviews.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Star className="h-16 w-16 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500">No reviews yet</p>
          <p className="text-stone-400 text-sm mt-2">Your app reviews will appear here after you rate your orders</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <RatingStars rating={review.rating} />
                  {review.title && (
                    <h3 className="font-semibold text-stone-800 mt-2">{review.title}</h3>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-400">
                  <Calendar className="h-3 w-3" />
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              {review.description && (
                <p className="text-stone-600 mt-2">{review.description}</p>
              )}
              
              <div className="flex items-center gap-3 mt-3">
                {review.isVerified && (
                  <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    <ThumbsUp className="h-3 w-3" /> Verified Purchase
                  </span>
                )}
                {review.tags && review.tags.length > 0 && (
                  <div className="flex gap-2">
                    {review.tags.map((tag, idx) => (
                      <span key={idx} className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
  // ==================== MAIN RENDER ====================
  return (
    <>
      <Navbar />
      <div
        className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50"
        style={{ paddingTop: navbarHeight > 0 ? `${navbarHeight}px` : '80px' }}
      >
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-amber-900 via-orange-800 to-red-900 text-white py-16">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 text-center">
            <div className={`transition-all duration-1000 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
              <h1 className="text-5xl md:text-6xl font-black mb-4">My Profile</h1>
              <p className="text-xl text-amber-100">Manage your account, addresses, and reviews</p>
            </div>
          </div>
        </div>
        
        {/* Success/Error Messages */}
        {(showSuccessMessage || showErrorMessage) && (
          <div className="fixed top-24 right-4 z-50 animate-fade-in">
            <div className={`p-4 rounded-xl shadow-lg ${
              showSuccessMessage ? "bg-green-500" : "bg-red-500"
            } text-white`}>
              {showSuccessMessage || showErrorMessage}
            </div>
          </div>
        )}
        
        <div className="container mx-auto px-4 py-12">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-stone-200">
            {[
              { id: "profile", label: "Profile", icon: User },
              { id: "addresses", label: "Addresses", icon: MapPin },
              { id: "reviews", label: "Reviews", icon: Star },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 font-semibold transition-all ${
                    activeTab === tab.id
                      ? "text-amber-600 border-b-2 border-amber-600"
                      : "text-stone-500 hover:text-stone-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
          
          {/* Tab Content */}
          <div className={`transition-all duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
            {activeTab === "profile" && renderProfileTab()}
            {activeTab === "addresses" && renderAddressesTab()}
            {activeTab === "reviews" && renderReviewsTab()}
          </div>
        </div>
        
        <Footer />
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}