import Link from "next/link";
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from "lucide-react";
import MapWrapper from "@/components/ui/MapWrapper";

export function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
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
                                <span>g.k. Petko R. Slaveykov, zh.k. Slaveykov 78, 8010 Burgas</span>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Phone className="h-5 w-5 text-accent" />
                                <span>+359897865829</span>
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <Mail className="h-5 w-5 text-accent" />
                                <span>miglena.todorova75@gmail.com</span>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Link href="#" className="p-2 bg-secondary rounded-full text-primary hover:bg-primary hover:text-white transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="https://www.facebook.com/Megi75f" className="p-2 bg-secondary rounded-full text-primary hover:bg-primary hover:text-white transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="p-2 bg-secondary rounded-full text-primary hover:bg-primary hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Business Hours */}
                    <div className="space-y-6">
                         <h3 className="text-xl font-serif font-bold text-primary mb-4">Business Hours</h3>
                         <ul className="space-y-3 text-muted-foreground">
                             <li className="flex justify-between border-b border-gray-100 pb-2">
                                 <span>Monday - Friday</span>
                                 <span className="font-medium text-primary">10:00 - 18:00</span>
                             </li>
                             <li className="flex justify-between border-b border-gray-100 pb-2">
                                 <span>Saturday</span>
                                 <span className="font-medium text-primary">10:00 - 18:00</span>
                             </li>
                             <li className="flex justify-between pb-2 text-primary/70">
                                 <span>Sunday</span>
                                 <span className="font-medium">Closed</span>
                             </li>
                         </ul>
                    </div>

                    {/* Map Section */}
                    <div className="h-[300px] w-full rounded-xl overflow-hidden shadow-lg border border-gray-100">
                        {/* Coordinates for a generic location, can be updated */}
                        <MapWrapper pos={[42.520136, 27.450848]} />
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Luxe Salon. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
