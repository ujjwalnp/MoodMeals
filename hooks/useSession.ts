"use client"

import { useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  role: string
}

export function useSession() {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/auth/session")
        const data = await response.json()
        
        if (response.ok && data.user) {
          setUser(data.user)
          setIsAuthenticated(true)
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error("Failed to fetch session:", error)
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [])

  return { user, isAuthenticated, loading }
}