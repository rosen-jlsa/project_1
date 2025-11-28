import Link from "next/link";
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from "lucide-react";
import MapWrapper from "@/components/ui/MapWrapper";

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    {/* Contact & Socials */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-2xl font-serif font-bold text-primary mb-4">Luxe Salon</h3>
                            <p className="text-muted-foreground max-w-md">
                                Experience the pinnacle of beauty and relaxation. Our specialists are dedicated to bringing out your best look.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <MapPin className="h-5 w-5 text-accent" />
                                <span>123 Luxury Avenue, Beverly Hills, CA 90210</span>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Phone className="h-5 w-5 text-accent" />
                                <span>+1 (555) 123-4567</span>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Mail className="h-5 w-5 text-accent" />
                                <span>contact@luxesalon.com</span>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Link href="#" className="p-2 bg-secondary rounded-full text-primary hover:bg-primary hover:text-white transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="p-2 bg-secondary rounded-full text-primary hover:bg-primary hover:text-white transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="p-2 bg-secondary rounded-full text-primary hover:bg-primary hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="h-[300px] w-full rounded-xl overflow-hidden shadow-lg border border-gray-100">
                        {/* Coordinates for a generic location, can be updated */}
                        <MapWrapper pos={[34.0736, -118.4004]} />
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Luxe Salon. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
