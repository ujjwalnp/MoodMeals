"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useSession } from "@/hooks/useSession"
import { useAlert } from "@/context/Alert"

interface CartItem {
  id: string
  name: string
  quantity: number
  price: number
  image?: string
  description?: string
  menuItemId?: string
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (id: string, name: string, quantity: number, price: number, image?: string, description?: string) => Promise<void>
  updateQuantity: (id: string, quantity: number) => Promise<void>
  removeFromCart: (id: string) => Promise<void>
  clearCart: () => Promise<void>
  getCartTotal: () => number
  getCartCount: () => number
  isLoading: boolean
  syncCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { user, isAuthenticated } = useSession()
  const { showSuccess, showError, showWarning, showInfo } = useAlert()

  // Load cart from localStorage or database on mount
  useEffect(() => {
    const initializeCart = async () => {
      setIsLoading(true)
      try {
        if (isAuthenticated && user) {
          // Fetch cart from database for logged-in user
          await fetchCartFromDatabase()
        } else {
          // Load from localStorage for guest users
          loadCartFromLocalStorage()
        }
      } catch (error) {
        console.error("Failed to initialize cart:", error)
        loadCartFromLocalStorage()
        showError("Cart Error", "Failed to load your cart. Using local storage instead.")
      } finally {
        setIsLoading(false)
      }
    }

    initializeCart()
  }, [isAuthenticated, user])

  // Sync local cart to database when user logs in
  useEffect(() => {
    const syncCartOnLogin = async () => {
      if (isAuthenticated && user) {
        await syncLocalCartToDatabase()
      }
    }
    syncCartOnLogin()
  }, [isAuthenticated, user])

  // Save cart to localStorage whenever it changes (for guests)
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("cart", JSON.stringify(cart))
    }
  }, [cart, isAuthenticated])

  const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setCart(parsedCart)
      } catch (e) {
        console.error("Failed to load cart from localStorage:", e)
      }
    }
  }

  const fetchCartFromDatabase = async () => {
    try {
      const response = await fetch("/api/cart")
      if (!response.ok) throw new Error("Failed to fetch cart")
      
      const data = await response.json()
      
      if (data.items && data.items.length > 0) {
        const cartItems = data.items.map((item: any) => ({
          id: item.menuItem.id,
          menuItemId: item.menuItem.id,
          name: item.menuItem.name,
          quantity: item.quantity,
          price: item.menuItem.isDiscount && item.menuItem.discountedPrice 
            ? Number(item.menuItem.discountedPrice)
            : Number(item.menuItem.price),
          image: item.menuItem.image || "/placeholder-food.jpg",
          description: item.menuItem.description || "",
        }))
        setCart(cartItems)
      } else {
        setCart([])
      }
    } catch (error) {
      console.error("Error fetching cart from database:", error)
      loadCartFromLocalStorage()
      throw error
    }
  }

  const syncLocalCartToDatabase = async () => {
    const localCart = localStorage.getItem("cart")
    if (!localCart) return

    try {
      const localItems = JSON.parse(localCart)
      if (localItems.length === 0) return

      showInfo("Syncing Cart", "Syncing your local cart with your account...", 2000)

      // Sync each item to database
      for (const item of localItems) {
        await addToCart(item.id, item.name, item.quantity, item.price, item.image, item.description)
      }
      
      // Clear local storage after sync
      localStorage.removeItem("cart")
      
      // Refresh cart from database
      await fetchCartFromDatabase()
      
      showSuccess("Cart Synced", "Your cart has been synced with your account!", 3000)
    } catch (error) {
      console.error("Error syncing cart to database:", error)
      showError("Sync Failed", "Failed to sync your cart. Please try again.")
    }
  }

  const addToCart = async (id: string, name: string, quantity: number, price: number, image?: string, description?: string) => {
    setIsLoading(true)
    
    if (isAuthenticated && user) {
      // Add to database for logged-in user
      try {
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ menuItemId: id, quantity }),
        })
        
        if (!response.ok) throw new Error("Failed to add to cart")
        
        // Refresh cart from database
        await fetchCartFromDatabase()
        
        // Show success alert
        showSuccess(
          "Added to Cart! 🛒",
          `${quantity}x ${name} has been added to your cart.`,
          3000
        )
      } catch (error) {
        console.error("Error adding to cart:", error)
        // Fallback to local state
        addToLocalCart(id, name, quantity, price, image, description)
        showError(
          "Failed to Add",
          `Could not add ${name} to cart. Saved locally.`,
          4000
        )
      }
    } else {
      // Add to local storage for guests
      addToLocalCart(id, name, quantity, price, image, description)
      showSuccess(
        "Added to Cart! 🛒",
        `${quantity}x ${name} has been added to your cart.`,
        3000
      )
    }
    
    setIsLoading(false)
  }

  const addToLocalCart = (id: string, name: string, quantity: number, price: number, image?: string, description?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id)
      if (existing) {
        const newQuantity = existing.quantity + quantity
        const updatedCart = prev.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
        return updatedCart
      }
      return [...prev, { id, name, quantity, price, image, description, menuItemId: id }]
    })
  }

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(id)
      return
    }

    setIsLoading(true)
    
    if (isAuthenticated && user) {
      try {
        const response = await fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ menuItemId: id, quantity }),
        })
        
        if (!response.ok) throw new Error("Failed to update cart")
        
        // Refresh cart from database
        await fetchCartFromDatabase()
        
        const item = cart.find(i => i.id === id)
        if (item) {
          showInfo("Cart Updated", `${item.name} quantity updated to ${quantity}`, 2000)
        }
      } catch (error) {
        console.error("Error updating cart:", error)
        // Fallback to local state
        updateLocalCartQuantity(id, quantity)
        showError("Update Failed", "Failed to update quantity. Changes saved locally.")
      }
    } else {
      updateLocalCartQuantity(id, quantity)
      const item = cart.find(i => i.id === id)
      if (item) {
        showInfo("Cart Updated", `${item.name} quantity updated to ${quantity}`, 2000)
      }
    }
    
    setIsLoading(false)
  }

  const updateLocalCartQuantity = (id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  const removeFromCart = async (id: string) => {
    setIsLoading(true)
    const itemToRemove = cart.find(item => item.id === id)
    
    if (isAuthenticated && user) {
      try {
        const response = await fetch(`/api/cart?menuItemId=${id}`, {
          method: "DELETE",
        })
        
        if (!response.ok) throw new Error("Failed to remove from cart")
        
        // Refresh cart from database
        await fetchCartFromDatabase()
        
        if (itemToRemove) {
          showSuccess("Item Removed", `${itemToRemove.name} has been removed from your cart.`, 3000)
        }
      } catch (error) {
        console.error("Error removing from cart:", error)
        // Fallback to local state
        removeFromLocalCart(id)
        if (itemToRemove) {
          showWarning("Removed Locally", `${itemToRemove.name} removed but changes may not be saved.`, 4000)
        }
      }
    } else {
      removeFromLocalCart(id)
      if (itemToRemove) {
        showSuccess("Item Removed", `${itemToRemove.name} has been removed from your cart.`, 3000)
      }
    }
    
    setIsLoading(false)
  }

  const removeFromLocalCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const clearCart = async () => {
    setIsLoading(true)
    
    if (isAuthenticated && user) {
      try {
        const response = await fetch("/api/cart", {
          method: "DELETE",
        })
        
        if (!response.ok) throw new Error("Failed to clear cart")
        
        setCart([])
        showInfo("Cart Cleared", "All items have been removed from your cart.", 3000)
      } catch (error) {
        console.error("Error clearing cart:", error)
        setCart([])
        showError("Failed to Clear", "Could not clear your cart. Please try again.")
      }
    } else {
      setCart([])
      showInfo("Cart Cleared", "All items have been removed from your cart.", 3000)
    }
    
    setIsLoading(false)
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  const syncCart = async () => {
    setIsLoading(true)
    try {
      if (isAuthenticated && user) {
        await fetchCartFromDatabase()
        showSuccess("Cart Refreshed", "Your cart has been updated from the server.", 2000)
      } else {
        loadCartFromLocalStorage()
        showInfo("Cart Loaded", "Your local cart has been loaded.", 2000)
      }
    } catch (error) {
      console.error("Error syncing cart:", error)
      showError("Sync Failed", "Failed to sync your cart. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
        isLoading,
        syncCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}