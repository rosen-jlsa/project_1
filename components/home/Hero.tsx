import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Hero() {
    return (
        <section className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden bg-secondary">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent blur-[100px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 tracking-wider uppercase">
                    Welcome to Luxe Salon
                </span>

                <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary mb-6 leading-tight">
                    Beauty Reimagined <br />
                    <span className="text-accent italic">Just for You</span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                    Experience world-class hair, beauty, and nail services in an environment designed for your absolute comfort and relaxation.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="#book"
                        className="group bg-white text-black px-8 py-4 rounded-full text-lg font-bold border-2 border-black hover:bg-black hover:text-white transition-all shadow-xl hover:shadow-2xl flex items-center gap-2"
                    >
                        Book Appointment
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                        href="#services"
                        className="px-8 py-4 rounded-full text-lg font-bold text-black border-2 border-black hover:bg-black hover:text-white transition-colors"
                    >
                        View Services
                    </Link>
                </div>
            </div>
        </section>
    );
}
