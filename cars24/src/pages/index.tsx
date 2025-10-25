import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import Hero from "@/components/Home/Hero";
import QuickAction from "@/components/Home/QuickAction";
import CarBrands from "@/components/Home/CarBrands";
import AppPromotion from "@/components/Home/AppPromotion";
import ServiceCards from "@/components/Home/ServiceCards";
import CarCategories from "@/components/Home/CarCategories";
import FeaturedCars from "@/components/Home/FeaturedCars";
import CustomerReviews from "@/components/Home/CustomReviews";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
   <div className="flex flex-col w-full bg-white">
    <Hero/>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full bg-white">
      <QuickAction/>
      <CarBrands/>
      <AppPromotion/>
      <ServiceCards/>
      <CarCategories/>
      <FeaturedCars/>
      <CustomerReviews/>
    </div>
   </div>
  );
}
