import Link from "next/link";
import { Instagram, Facebook, MapPin, Phone, Mail } from "lucide-react";
import MapWrapper from "@/components/ui/MapWrapper";

export function Footer() {
    return (
        <footer className="bg-white/60 backdrop-blur-sm border-t border-black/10 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Contact & Socials */}
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-2xl font-serif font-bold text-black laser-text mb-4">Luxe Salon</h3>
                            <p className="text-gray-800 laser-text-gray max-w-md">
                                Experience the pinnacle of beauty and relaxation. Our specialists are dedicated to bringing out your best look.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-black font-medium">
                                <MapPin className="h-5 w-5 text-black" />
                                <span className="laser-text-gray">g.k. Petko R. Slaveykov, zh.k. Slaveykov 78, 8010 Burgas</span>
                            </div>
                            <div className="flex items-center gap-3 text-black font-medium">
                                <Phone className="h-5 w-5 text-black" />
                                <span className="laser-text-gray">+359897865829</span>
                            </div>
                            <div className="flex items-center gap-3 text-black font-medium">
                                <Mail className="h-5 w-5 text-black" />
                                <span className="laser-text-gray">miglena.todorova75@gmail.com</span>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Link href="#" className="p-2 bg-black/5 rounded-full text-black hover:bg-black hover:text-white transition-all shadow-sm">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="https://www.facebook.com/Megi75f" className="p-2 bg-black/5 rounded-full text-black hover:bg-black hover:text-white transition-all shadow-sm">
                                <Facebook className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Business Hours */}
                    <div className="space-y-6">
                         <h3 className="text-xl font-serif font-bold text-black laser-text mb-4">Business Hours</h3>
                         <ul className="space-y-3">
                             <li className="flex justify-between border-b border-gray-200 pb-2 text-black font-bold">
                                 <span className="laser-text-gray">Monday - Friday</span>
                                 <span className="laser-text">10:00 - 18:00</span>
                             </li>
                             <li className="flex justify-between border-b border-gray-200 pb-2 text-black font-bold">
                                 <span className="laser-text-gray">Saturday</span>
                                 <span className="laser-text">10:00 - 18:00</span>
                             </li>
                             <li className="flex justify-between pb-2 text-black font-extrabold">
                                 <span className="laser-text-gray opacity-80">Sunday</span>
                                 <span className="laser-text">Closed</span>
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
