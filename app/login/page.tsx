"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import type { User } from "@/generated/prisma/client";

type SafeUser = Omit<User, "password" | "createdAt" | "updatedAt">

// Define API response type
interface LoginResponse {
  error?: string
  message?: string
  user?: SafeUser
}

export default function LoginPage() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      if (params.get("signup") === "success") {
        setSuccess("Account created! You can now sign in.")
      }
    }
  }, [])

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data: LoginResponse = await res.json()
      if (res.ok) {
        if (data.user?.role === "ADMIN") {
          router.push("/admin")
        } else {
          router.push("/")
        }
        router.refresh()
      } else {
        setError(data.error || "Login failed")
      }
    } catch (err: unknown) {
      setError("An unexpected error occurred")
      console.error("Login error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-stone-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-stone-900">Welcome Back</h1>
            <p className="text-stone-500 mt-2">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium border border-amber-100">
              {success}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none text-stone-900 placeholder:text-stone-400"
                placeholder="you@example.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all outline-none text-stone-900 placeholder:text-stone-400"
                placeholder="••••••••"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-700 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-amber-800 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center text-stone-600">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-amber-700 font-bold hover:underline">
              Create one
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}