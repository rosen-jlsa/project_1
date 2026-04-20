import { Hero } from "@/components/home/Hero";
import ProductGallery from "@/components/home/ProductGallery";
import { Reviews } from "@/components/home/Reviews";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { getProductImages } from "@/app/actions";

export default async function Home() {
  const [products] = await Promise.all([
    getProductImages()
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      {/* Booking & Service Menu V2.0 */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <BookingWizard />
        </div>
      </section>
      <ProductGallery products={products} />
      <Reviews />
    </div>
  );
}
