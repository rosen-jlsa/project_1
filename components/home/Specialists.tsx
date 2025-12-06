import { Instagram, Twitter, Facebook } from "lucide-react";
import Image from "next/image";

const SPECIALISTS = [
    {
        id: 1,
        name: "Alex Rivera",
        role: "Master Barber",
        bio: "Specializing in classic cuts and modern fades with over 10 years of experience.",
        image: "/specialist-1.jpg" // We'll handle missing images gracefully
    },
    {
        id: 2,
        name: "Sarah Chen",
        role: "Senior Stylist",
        bio: "Expert in color transformations and creative styling for all hair types.",
        image: "/specialist-2.jpg"
    },
    {
        id: 3,
        name: "Mike Ross",
        role: "Style Director",
        bio: "Award-winning stylist known for precision cutting and celebrity styling.",
        image: "/specialist-3.jpg"
    }
];

export function Specialists() {
    return (
        <section id="specialists" className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Meet Our Specialists</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Our team of expert stylists is dedicated to making you look and feel your best.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {SPECIALISTS.map((specialist) => (
                        <div key={specialist.id} className="group relative overflow-hidden rounded-2xl">
                            {/* Placeholder for Image if not exists, or we can use a div with color */}
                            <div className="aspect-[3/4] bg-secondary/50 relative overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center text-primary/20 font-serif text-9xl font-bold select-none">
                                    {specialist.name.charAt(0)}
                                </div>
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                                    <h3 className="text-xl font-bold">{specialist.name}</h3>
                                    <p className="text-sm text-white/80 mb-4">{specialist.role}</p>
                                    <p className="text-sm text-white/70 mb-4 opacity-0 group-hover:opacity-100 transition-opacity delay-100 duration-300 transform translate-y-4 group-hover:translate-y-0">
                                        {specialist.bio}
                                    </p>
                                    <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity delay-200 duration-300 transform translate-y-4 group-hover:translate-y-0">
                                        <button className="hover:text-primary-foreground transition-colors"><Instagram className="w-5 h-5" /></button>
                                        <button className="hover:text-primary-foreground transition-colors"><Twitter className="w-5 h-5" /></button>
                                        <button className="hover:text-primary-foreground transition-colors"><Facebook className="w-5 h-5" /></button>
                                    </div>
                                </div>
                            </div>

                            {/* Visible info when not hovering (mobile friendly) */}
                            <div className="mt-4 text-center md:hidden">
                                <h3 className="text-xl font-bold text-primary">{specialist.name}</h3>
                                <p className="text-sm text-muted-foreground">{specialist.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
