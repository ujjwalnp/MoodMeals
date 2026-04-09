"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/Cart";
import { useSession } from "@/hooks/useSession";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { 
  Truck, 
  CreditCard, 
  MapPin, 
  Plus, 
  X,
  CheckCircle,
  Loader2,
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  Clock,
  Shield,
  Sparkles,
  Wallet
} from "lucide-react";

interface Address {
  id: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  landmark: string | null;
  phoneNumber: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useSession();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "khalti">("cod");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Form state for new address
  const [newAddress, setNewAddress] = useState({
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

  useEffect(() => {
    setIsLoaded(true);
    const navbar = document.querySelector('nav');
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
    
    if (isAuthenticated) {
      fetchAddresses();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddress = addresses.find(addr => addr.isDefault);
      setSelectedAddress(defaultAddress?.id || addresses[0].id);
    }
  }, [addresses]);

  const fetchAddresses = async () => {
    try {
      const response = await fetch("/api/users/addresses");
      if (!response.ok) throw new Error("Failed to fetch addresses");
      const data = await response.json();
      setAddresses(data.addresses);
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/users/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAddress),
      });
      
      if (!response.ok) throw new Error("Failed to add address");
      
      const data = await response.json();
      setAddresses([...addresses, data.address]);
      setSelectedAddress(data.address.id);
      setShowAddressForm(false);
      setNewAddress({
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
    } catch (error) {
      console.error("Error adding address:", error);
      alert("Failed to add address");
    }
  };

  const subtotal = getCartTotal();
  const deliveryFee = subtotal >= 1000 ? 0 : 100;
  const total = subtotal + deliveryFee;

  const formatCurrency = (amount: number) => {
    return `NPR ${amount.toFixed(2)}`;
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        addressId: selectedAddress,
        paymentMethod,
        specialInstructions,
        items: cart.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal,
        deliveryFee,
        total,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to place order");
      }

      const data = await response.json();

      if (paymentMethod === "cod") {
        // Clear cart and redirect to order confirmation
        await clearCart();
        window.location.href = `/order-confirmation?orderId=${data.order.id}`;
      } else if (paymentMethod === "khalti") {
        // Redirect to Khalti payment
        window.location.href = `/payment/khalti?orderId=${data.order.id}`;
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert(error instanceof Error ? error.message : "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">Please Login</h2>
            <p className="text-stone-600 mb-6">You need to be logged in to checkout</p>
            <Link href="/login?redirect=/checkout">
              <button className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold">
                Login to Continue
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-amber-600" />
        </div>
        <Footer />
      </>
    );
  }

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-stone-800 mb-2">Your cart is empty</h2>
            <p className="text-stone-600 mb-6">Add some items to your cart before checkout</p>
            <Link href="/menu">
              <button className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold">
                Browse Menu
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div 
        className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50"
        style={{ paddingTop: navbarHeight > 0 ? `${navbarHeight}px` : '80px' }}
      >
        <div className="relative z-10 container mx-auto px-4 py-12">
          {/* Header */}
          <div className={`text-center mb-8 transition-all duration-1000 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
              Checkout
            </h1>
            <p className="text-stone-600">Complete your order</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Address and Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address Section */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-amber-600" />
                    Delivery Address
                  </h2>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="text-amber-600 hover:text-amber-700 font-semibold text-sm flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add New Address
                  </button>
                </div>

                {addresses.length === 0 && !showAddressForm ? (
                  <div className="text-center py-8">
                    <p className="text-stone-500 mb-4">No addresses found. Please add an address.</p>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="text-amber-600 font-semibold"
                    >
                      Add Address →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((address) => (
                      <label
                        key={address.id}
                        className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                          selectedAddress === address.id
                            ? "border-amber-500 bg-amber-50"
                            : "border-stone-200 hover:border-amber-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          value={address.id}
                          checked={selectedAddress === address.id}
                          onChange={(e) => setSelectedAddress(e.target.value)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-stone-900">
                              {address.addressLine1}
                            </span>
                            {address.isDefault && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-stone-600">
                            {address.addressLine2 && `${address.addressLine2}, `}
                            {address.city}, {address.state}, {address.country}
                            <br />
                            Postal Code: {address.postalCode}
                            {address.landmark && <><br />Landmark: {address.landmark}</>}
                            <br />Phone: {address.phoneNumber}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {/* Add Address Form */}
                {showAddressForm && (
                  <form onSubmit={handleAddAddress} className="mt-4 p-4 border border-stone-200 rounded-xl">
                    <h3 className="font-semibold text-stone-900 mb-3">Add New Address</h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Address Line 1 *"
                        required
                        value={newAddress.addressLine1}
                        onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                        className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <input
                        type="text"
                        placeholder="Address Line 2 (Optional)"
                        value={newAddress.addressLine2}
                        onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                        className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="City"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <input
                          type="text"
                          placeholder="State"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Postal Code *"
                          required
                          value={newAddress.postalCode}
                          onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                          className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <input
                          type="text"
                          placeholder="Phone Number *"
                          required
                          value={newAddress.phoneNumber}
                          onChange={(e) => setNewAddress({ ...newAddress, phoneNumber: e.target.value })}
                          className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Landmark (Optional)"
                        value={newAddress.landmark}
                        onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                        className="w-full px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newAddress.isDefault}
                          onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-stone-700">Set as default address</span>
                      </label>
                      <div className="flex gap-3 pt-2">
                        <button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white py-2 rounded-lg font-semibold"
                        >
                          Save Address
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddressForm(false)}
                          className="flex-1 border border-stone-200 text-stone-600 py-2 rounded-lg font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>

              {/* Payment Method Section */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-amber-600" />
                  Payment Method
                </h2>
                <div className="space-y-3">
                  <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                    paymentMethod === "cod" ? "border-amber-500 bg-amber-50" : "border-stone-200"
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value as "cod")}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-900">Cash on Delivery</span>
                        <Truck className="h-4 w-4 text-stone-500" />
                      </div>
                      <p className="text-sm text-stone-500">Pay when you receive your order</p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                    paymentMethod === "khalti" ? "border-amber-500 bg-amber-50" : "border-stone-200"
                  }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="khalti"
                      checked={paymentMethod === "khalti"}
                      onChange={(e) => setPaymentMethod(e.target.value as "khalti")}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-900">Khalti Digital Wallet</span>
                        <Wallet className="h-4 w-4 text-purple-600" />
                      </div>
                      <p className="text-sm text-stone-500">Pay securely with Khalti</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2 mb-4">
                  <Clock className="h-5 w-5 text-amber-600" />
                  Special Instructions
                </h2>
                <textarea
                  rows={3}
                  placeholder="Any special requests? (e.g., no onion, extra spicy, etc.)"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full px-4 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-amber-600" />
                  Order Summary
                </h2>

                <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 py-2 border-b border-stone-100">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder-food.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-stone-900 text-sm">{item.name}</p>
                        <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold text-amber-600">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-stone-200 pt-4 space-y-2">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Delivery Fee</span>
                    <span>{deliveryFee === 0 ? "Free" : formatCurrency(deliveryFee)}</span>
                  </div>
                  <div className="border-t border-stone-200 pt-3 mt-3">
                    <div className="flex justify-between text-xl font-bold text-stone-900">
                      <span>Total</span>
                      <span className="text-amber-600">{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={submitting || addresses.length === 0 || !selectedAddress}
                  className="w-full mt-6 bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      Place Order
                    </>
                  )}
                </button>

                {/* Trust Badges */}
                <div className="mt-6 pt-4 border-t border-stone-100">
                  <div className="flex justify-center gap-4 text-xs text-stone-500">
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      <span>Secure Checkout</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      <span>Fresh Food</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Fast Delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}