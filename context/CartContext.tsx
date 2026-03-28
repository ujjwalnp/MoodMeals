"use client"

import { createContext, useContext, useState } from "react"

interface CartItem {
  id: string
  name: string
  quantity: number
  price: number
}

interface CartContextType {
  addToCart: (id: string, name: string, quantity: number, price: number) => void
  cartItems: CartItem[]
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const addToCart = (id: string, name: string, quantity: number, price: number) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === id)
      if (existing) {
        return prev.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { id, name, quantity, price }]
    })
    console.log(`Added: ${quantity}x ${name}`)
  }

  return (
    <CartContext.Provider value={{ addToCart, cartItems }}>
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