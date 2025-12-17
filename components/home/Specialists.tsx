import { Instagram, Twitter, Facebook, Phone } from "lucide-react";
import { getSpecialists } from "@/app/actions";
import Link from "next/link"; // Import Link for booking navigation
import { Specialist as SpecialistType } from "@/lib/data";
import Image from "next/image";

export async function Specialists() {
    const specialists = await getSpecialists();

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
                    {specialists.map((specialist: SpecialistType) => (
                        <div key={specialist.id} className="group relative overflow-hidden rounded-2xl">
                            {/* Proportional aspect ratio container */}
                            <div className="aspect-[3/4] bg-secondary/50 relative overflow-hidden">
                                {specialist.image ? (
                                    <Image
                                        src={specialist.image}
                                        alt={specialist.name}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-primary/20 font-serif text-9xl font-bold select-none">
                                        {specialist.name.charAt(0)}
                                    </div>
                                )}

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white z-10">
                                    <h3 className="text-xl font-bold">{specialist.name}</h3>
                                    <p className="text-sm text-white/80 mb-4">{specialist.role}</p>
                                    <p className="text-sm text-white/70 mb-4 opacity-0 group-hover:opacity-100 transition-opacity delay-100 duration-300 transform translate-y-4 group-hover:translate-y-0 line-clamp-3">
                                        {specialist.bio}
                                    </p>

                                    <div className="space-y-3 opacity-0 group-hover:opacity-100 transition-opacity delay-200 duration-300 transform translate-y-4 group-hover:translate-y-0">
                                        {specialist.phone && (
                                            <div className="flex items-center gap-2 text-sm text-white/90">
                                                <Phone className="w-4 h-4" />
                                                <span>{specialist.phone}</span>
                                            </div>
                                        )}

                                        <div className="flex gap-4 pt-2">
                                            {specialist.instagram && <a href={`https://instagram.com/${specialist.instagram}`} target="_blank" rel="noreferrer" className="hover:text-primary-foreground transition-colors"><Instagram className="w-5 h-5" /></a>}
                                            {specialist.twitter && <a href={`https://twitter.com/${specialist.twitter}`} target="_blank" rel="noreferrer" className="hover:text-primary-foreground transition-colors"><Twitter className="w-5 h-5" /></a>}
                                            {specialist.facebook && <a href={`https://facebook.com/${specialist.facebook}`} target="_blank" rel="noreferrer" className="hover:text-primary-foreground transition-colors"><Facebook className="w-5 h-5" /></a>}
                                        </div>

                                        <Link
                                            href={`/?specialist=${specialist.id}#book`}
                                            className="block w-full text-center bg-white text-black py-2 rounded-lg font-bold hover:bg-primary hover:text-white transition-colors mt-4"
                                        >
                                            Book Appointment
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Visible info when not hovering (mobile friendly) */}
                            <div className="mt-4 text-center md:hidden">
                                <h3 className="text-xl font-bold text-primary">{specialist.name}</h3>
                                <p className="text-sm text-muted-foreground">{specialist.role}</p>
                                <Link
                                    href={`/?specialist=${specialist.id}#book`}
                                    className="inline-block mt-2 text-primary font-medium hover:underline"
                                >
                                    Book Now
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
