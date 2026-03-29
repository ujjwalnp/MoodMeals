// app/contact/page.tsx
"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  MapPin, Phone, Mail, Clock, Send, MessageSquare, 
  User, AtSign, FileText, AlertCircle 
} from "lucide-react";

export default function ContactPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    setIsLoaded(true);
    
    const navbar = document.querySelector('nav');
    if (navbar) {
      setNavbarHeight(navbar.offsetHeight);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitStatus("success");
      setIsSubmitting(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitStatus("idle"), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["123 Foodie Street", "Makawanpur, Nepal", "44100"],
      color: "text-amber-600"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+977 1234567890", "+977 (057) 123-4567"],
      color: "text-amber-600"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["contact@moodmeals.com", "support@moodmeals.com"],
      color: "text-amber-600"
    },
    {
      icon: Clock,
      title: "Opening Hours",
      details: ["Sun-Fri: 11:00 AM - 10:00 PM"],
      color: "text-amber-600"
    },
  ];

  return (
    <>
      <Navbar />
      <div 
        className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50"
        style={{ paddingTop: navbarHeight > 0 ? `${navbarHeight}px` : '80px' }}
      >
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-amber-900 via-orange-800 to-red-900 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 text-center">
            <div className={`transition-all duration-1000 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
              <h1 className="text-5xl md:text-6xl font-black mb-4">Get in Touch</h1>
              <p className="text-xl text-amber-100 max-w-2xl mx-auto">
                We'd love to hear from you. Reach out with any questions or feedback.
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className={`transition-all duration-1000 delay-200 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-stone-800 mb-2">Send us a Message</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mb-6"></div>
                <p className="text-stone-500 mb-8">
                  Have a question, feedback, or just want to say hello? Fill out the form below and we'll get back to you as soon as possible.
                </p>

                {submitStatus === "success" && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-fade-in">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Send className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-800">Message Sent!</p>
                      <p className="text-sm text-green-600">We'll get back to you within 24 hours.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
                      <User className="h-4 w-4 text-amber-600" />
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
                      <AtSign className="h-4 w-4 text-amber-600" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-amber-600" />
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                    >
                      <option value="">Select a subject</option>
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Order Issue">Order Issue</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-stone-700 mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-amber-600" />
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Tell us how we can help..."
                      className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className={`transition-all duration-1000 delay-400 transform ${isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
              <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
                <h2 className="text-3xl font-bold text-stone-800 mb-2">Contact Info</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mb-6"></div>
                <p className="text-stone-500 mb-8">
                  Multiple ways to reach us. Choose what works best for you.
                </p>

                <div className="space-y-6">
                  {contactInfo.map((info, idx) => {
                    const Icon = info.icon;
                    return (
                      <div key={idx} className="flex items-start gap-4 group">
                        <div className="flex-shrink-0">
                          <div className="p-3 bg-amber-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                            <Icon className={`h-5 w-5 ${info.color}`} />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-stone-800 mb-1">{info.title}</h3>
                          {info.details.map((detail, detailIdx) => (
                            <p key={detailIdx} className="text-stone-500 text-sm">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Map Section */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-stone-800 mb-4">Find Us Here</h3>
                <div className="w-16 h-1 bg-gradient-to-r from-amber-600 to-orange-600 mb-6"></div>
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-6 text-center">
                  <MapPin className="h-12 w-12 text-amber-600 mx-auto mb-3" />
                  <p className="text-stone-700 font-medium mb-2">123 Foodie Street</p>
                  <p className="text-stone-500 text-sm">Makawanpur, Nepal 44100</p>
                  <button 
                    onClick={() => window.open("https://maps.google.com", "_blank")}
                    className="mt-4 text-amber-600 text-sm font-semibold hover:underline"
                  >
                    Get Directions →
                  </button>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="mt-6 bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-6 text-center">
                <AlertCircle className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <p className="text-stone-700 font-semibold">Emergency Order Support</p>
                <p className="text-2xl font-bold text-amber-600 mt-2">+977 1234567890</p>
                <p className="text-xs text-stone-500 mt-1">24/7 Customer Support</p>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </>
  );
}