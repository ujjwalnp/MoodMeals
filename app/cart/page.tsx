"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/Cart";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  CreditCard, 
  Truck, 
  Clock,
  ArrowLeft,
  Gift,
  Sparkles,
  ShieldCheck,
  Loader2
} from "lucide-react";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, isLoading, getCartCount, getCartTotal } = useCart();
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    const navbar = document.querySelector('nav');
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
  }, []);

  // Calculate subtotal
  const subtotal = getCartTotal();
  
  // Calculate delivery fee (free for orders above NPR 1000)
  const deliveryFee = subtotal >= 1000 ? 0 : 100;
  
  // Calculate total
  const total = subtotal + deliveryFee;

  // Format currency
  const formatCurrency = (amount: number) => {
    return `NPR ${amount.toFixed(2)}`;
  };

  // Show loading state
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div 
          className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex items-center justify-center"
          style={{ paddingTop: navbarHeight > 0 ? `${navbarHeight}px` : '80px' }}
        >
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-amber-600 mx-auto mb-4" />
            <p className="text-stone-600 text-lg">Loading your cart... 🛒</p>
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
        className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50"
        style={{ paddingTop: navbarHeight > 0 ? `${navbarHeight}px` : '80px' }}
      >
        {/* Decorative Background Elements */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 text-6xl animate-bounce-slow">🛒</div>
          <div className="absolute top-40 right-20 text-5xl animate-spin-slow">🛍️</div>
          <div className="absolute bottom-20 left-20 text-7xl animate-pulse-slow">💰</div>
          <div className="absolute bottom-40 right-10 text-6xl animate-bounce-slow">✨</div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12">
          {/* Header */}
          <div className={`text-center mb-12 transition-all duration-1000 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-full px-6 py-3 shadow-lg mb-6">
              <span className="text-3xl animate-bounce">🛒</span>
              <span className="text-3xl animate-pulse">🛍️</span>
              <span className="text-3xl animate-bounce">💸</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-4 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
              Your Cart
            </h1>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              {cart.length === 0 
                ? "Your cart is empty. Let's fill it with something delicious!" 
                : `You have ${getCartCount()} item${getCartCount() > 1 ? 's' : ''} in your cart`
              }
            </p>
          </div>

          {cart.length === 0 ? (
            // Empty Cart State
            <div className="text-center py-20 animate-fade-in">
              <div className="text-8xl mb-6 animate-bounce-slow">🛒</div>
              <h2 className="text-2xl font-bold text-stone-800 mb-3">Your cart is empty</h2>
              <p className="text-stone-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Link href="/offers">
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-lg text-lg font-bold border-2 border-transparent">
                    <ShoppingBag className="h-5 w-5" />
                    Browse Offers
                  </button>
                </Link>
                <Link href="/menu">
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-white text-stone-900 rounded-full font-bold text-lg hover:bg-stone-100 hover:scale-105 transition-all shadow-md border-2 border-amber-200 hover:border-amber-300">
                    <ShoppingBag className="h-5 w-5" />
                    Browse Menu
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={item.id}
                    className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-stone-100 p-4 animate-fade-in`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex gap-4">
                      {/* Item Image */}
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder-food.jpg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-lg font-bold text-stone-900">{item.name}</h3>
                            {item.description && (
                              <p className="text-sm text-stone-500">{item.description.substring(0, 60)}...</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-stone-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center bg-stone-100 rounded-full">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-200 transition-colors text-stone-700"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-8 text-center text-sm font-semibold text-stone-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-200 transition-colors text-stone-700"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-black text-amber-600">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                            {item.quantity > 1 && (
                              <p className="text-xs text-stone-400">{formatCurrency(item.price)} each</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Clear Cart Button */}
                {cart.length > 0 && (
                  <div className="flex justify-end">
                    <button
                      onClick={clearCart}
                      className="text-stone-500 hover:text-red-500 text-sm font-medium transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear Cart
                    </button>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className={`bg-white rounded-2xl shadow-lg border border-stone-100 p-6 h-fit sticky top-24 animate-fade-in`}>
                <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-amber-600" />
                  Order Summary
                </h2>

                {/* Order Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <div className="flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      <span>Delivery Fee</span>
                    </div>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="text-green-600 font-semibold">Free</span>
                      ) : (
                        formatCurrency(deliveryFee)
                      )}
                    </span>
                  </div>  
                </div>

                <div className="border-t border-stone-200 pt-4 mb-6">
                  <div className="flex justify-between text-lg font-bold text-stone-900">
                    <span>Total</span>
                    <span className="text-2xl text-amber-600">{formatCurrency(total)}</span>
                  </div>
                </div>

                {/* Free Delivery Message */}
                {subtotal < 1000 && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-3 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Gift className="h-4 w-4 text-amber-600" />
                      <span className="text-stone-700">
                        Add {formatCurrency(1000 - subtotal)} more to get free delivery!
                      </span>
                    </div>
                  </div>
                )}

                {/* Checkout Button */}
                <button className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-full font-semibold hover:scale-105 transition-all duration-300 shadow-lg mb-3 flex items-center justify-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Proceed to Checkout
                </button>

                {/* Continue Shopping */}
                <Link href="/offers">
                  <button className="w-full border-2 border-stone-200 text-stone-600 py-3 rounded-full font-semibold hover:border-amber-600 hover:text-amber-600 transition-all duration-300 flex items-center justify-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Continue Shopping
                  </button>
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-4 border-t border-stone-100">
                  <div className="flex justify-center gap-4 text-xs text-stone-500">
                    <div className="flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
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
          )}
        </div>

        <Footer />
      </div>

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 10s linear infinite; }
        .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
      `}</style>
    </>
  );
}