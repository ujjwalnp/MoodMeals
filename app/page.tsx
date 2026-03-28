import Image from "next/image";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection"; 

export default function Home() {
  return (
    <main className="bg-stone-50 min-h-screen">
      <Navbar />
      <HeroSection />

    </main>

  );
}
