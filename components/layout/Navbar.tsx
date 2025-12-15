import Link from "next/link";
import { Scissors } from "lucide-react";

export function Navbar() {
    return (
        <nav className="w-full border-b border-white/10 bg-secondary/80 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
                    <Scissors className="h-6 w-6" />
                    <span className="text-xl font-bold tracking-tight font-serif">Luxe Salon</span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-primary/80">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <Link href="#services" className="hover:text-primary transition-colors">Services</Link>
                    <Link href="/#specialists" className="hover:text-primary transition-colors">Specialists</Link>
                    <Link href="/reviews" className="hover:text-primary transition-colors">Reviews</Link>
                </div>

                <Link
                    href="/#book"
                    className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold border-2 border-black hover:bg-black hover:text-white transition-all shadow-lg"
                >
                    Book Now
                </Link>
            </div>
        </nav>
    );
}
