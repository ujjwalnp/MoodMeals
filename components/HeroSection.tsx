import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/video.mp4" type="video/mp4" />
        </video>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <div className="w-full px-4">
          <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
              Taste the Vibe of {" "}
              <span className="text-amber-600 animate-pulse">Every Bite</span>
            </h1>
            <p className="text-xl text-stone-200 mb-10 max-w-2xl mx-auto font-medium">
              Join MoodMeals for extraordinary flavors crafted to match your cravings, your mood, and your moment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/offers"
                className="px-8 py-4 bg-amber-600 text-white rounded-full font-bold text-lg hover:bg-amber-800 hover:scale-105 transition-all shadow-xl hover:shadow-amber-900/20"
              >
                Explore All Offers
              </Link>
              <Link
                href="/menu"
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full font-bold text-lg hover:bg-white/20 hover:scale-105 transition-all"
              >
                Explore Menu
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;