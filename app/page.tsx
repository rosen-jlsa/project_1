import Image from "next/image";
import { Hero } from "@/components/home/Hero";
import { BookingWizard } from "@/components/booking/BookingWizard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      {/* Services and Specialists sections will go here */}
      <div id="book" className="py-20 bg-white text-center">
        <h2 className="text-3xl font-serif font-bold text-primary mb-4">Ready to Transform?</h2>
        <p className="text-muted-foreground mb-12">Select your specialist and book your time.</p>
        <div className="container mx-auto px-4">
          <BookingWizard />
        </div>
      </div>
    </div>
  );
}
