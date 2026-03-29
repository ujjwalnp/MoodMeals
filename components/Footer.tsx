"use client"

import Link from "next/link"
import Image from "next/image"
import { 
  Mail, 
  Phone, 
  MapPin,
  Clock,
  Heart,
  ChevronRight
} from "lucide-react"

import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa"

// Define types for footer links
interface FooterLink {
  name: string
  href: string
}

interface SocialLink {
  name: string
  href: string
  icon: React.ReactNode
}

interface ContactInfo {
  icon: React.ReactNode
  text: string
  href?: string
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  // Quick links data
  const quickLinks: FooterLink[] = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Menu", href: "/menu" },
    { name: "Offers", href: "/offers" },
    { name: "Contact", href: "/contact" },
  ]

  // Legal links data
  const legalLinks: FooterLink[] = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Refund Policy", href: "/refund" },
  ]

  // Social media links data
  const socialLinks: SocialLink[] = [
    { name: "Facebook", href: "https://facebook.com/moodmeals", icon: <FaFacebook className="h-5 w-5" /> },
    { name: "Instagram", href: "https://instagram.com/moodmeals", icon: <FaInstagram className="h-5 w-5" /> },
    { name: "Twitter", href: "https://twitter.com/moodmeals", icon: <FaTwitter className="h-5 w-5" /> },
    { name: "YouTube", href: "https://youtube.com/moodmeals", icon: <FaYoutube className="h-5 w-5" /> },
  ]

  // Contact information data
  const contactInfo: ContactInfo[] = [
    { 
      icon: <MapPin className="h-5 w-5 text-amber-600" />, 
      text: "123 Foodie Street, Makawanpur District, Bagmati, BA 44100" 
    },
    { 
      icon: <Phone className="h-5 w-5 text-amber-600" />, 
      text: "+977 (057) 123-4567",
      href: "tel:+9770571234567"
    },
    { 
      icon: <Mail className="h-5 w-5 text-amber-600" />, 
      text: "contact@moodmeals.com",
      href: "mailto:contact@moodmeals.com"
    },
    { 
      icon: <Clock className="h-5 w-5 text-amber-600" />, 
      text: "Sun-Fri: 11:00 AM - 10:00 PM" 
    },
  ]

  return (
    <footer className="bg-stone-900 text-stone-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/logo.png" 
                alt="moodmeals logo" 
                width={100} 
                height={35} 
                className="h-8 sm:h-10 w-auto brightness-0 invert"
                priority 
              />
              <span className="text-lg font-bold tracking-tight">
                <span className="text-amber-600">MOOD</span>
                <span className="text-green-600">MEALS</span>
              </span>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed">
              Savor the flavors that match your mood. We bring you delicious, 
              handcrafted meals made with love and the finest ingredients.
            </p>
            <div className="flex space-x-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-stone-800 hover:bg-amber-600 text-stone-400 hover:text-white p-2 rounded-full transition-all duration-200 transform hover:scale-110"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-stone-400 hover:text-amber-600 transition-colors duration-200 flex items-center group"
                  >
                    <ChevronRight className="h-4 w-4 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">{info.icon}</div>
                  {info.href ? (
                    <a 
                      href={info.href}
                      className="text-stone-400 hover:text-amber-600 transition-colors duration-200 text-sm"
                    >
                      {info.text}
                    </a>
                  ) : (
                    <span className="text-stone-400 text-sm">{info.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Stay Updated</h3>
            <p className="text-sm text-stone-400 mb-3">
              Subscribe to get special offers and updates
            </p>
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                // Handle newsletter subscription
                const formData = new FormData(e.currentTarget)
                const email = formData.get('email')
                console.log('Newsletter signup:', email)
                // Add your newsletter API call here
              }}
              className="space-y-3"
            >
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 rounded-lg bg-stone-800 border border-stone-700 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="group relative w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold py-2.5 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="relative z-10">Subscribe</span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-800 to-orange-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            </form>
            <p className="text-xs text-stone-500 mt-3">
              By subscribing, you agree to our{" "}
              <Link href="/privacy" className="text-amber-600 hover:text-amber-400">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-stone-800 my-8 md:my-10"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-stone-400">
            © {currentYear} MoodMeals. All rights reserved.
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-stone-400 hover:text-amber-600 transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-1 text-sm text-stone-500">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-amber-600 fill-amber-600" />
            <span>for food lovers</span>
          </div>
        </div>
      </div>
    </footer>
  )
}