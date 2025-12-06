import Image from "next/image";
import { Hero } from "@/components/home/Hero";
import { Services } from "@/components/home/Services";
import { Specialists } from "@/components/home/Specialists";
import { Reviews } from "@/components/home/Reviews";
import { BookingWizard } from "@/components/booking/BookingWizard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <Services />
      <Specialists />
      <Reviews />
      {/* Booking Section */}
      <div id="book" className="py-20 bg-white text-center">
        <div className="container mx-auto px-4">
          <BookingWizard />
        </div>
      </div>
    </div>
  );
}
