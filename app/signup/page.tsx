"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Define types for form data
interface SignupFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

// Define API response type
interface SignupResponse {
  error?: string
  message?: string
  user?: {
    id: string
    name: string
    email: string
  }
}

export default function SignupPage() {
  const [formData, setFormData] = useState<SignupFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data: SignupResponse = await res.json()
      if (res.ok) {
        router.push("/login?signup=success")
      } else {
        setError(data.error || "Signup failed")
      }
    } catch (err: unknown) {
      setError("An unexpected error occurred")
      console.error("Signup error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-stone-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-stone-900">Begin Your Flavor Journey</h1>
            <p className="text-stone-500 mt-2">Create your MoodMeals account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 transition-all outline-none text-stone-900 placeholder:text-stone-400"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 transition-all outline-none text-stone-900 placeholder:text-stone-400"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 transition-all outline-none text-stone-900 placeholder:text-stone-400"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-1">Confirm Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-amber-500 transition-all outline-none text-stone-900 placeholder:text-stone-400"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-700 text-white py-3.5 rounded-xl font-bold text-lg hover:bg-amber-800 transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-8 text-center text-stone-600">
            Already have an account?{" "}
            <Link href="/login" className="text-amber-700 font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}