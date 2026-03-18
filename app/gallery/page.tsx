import { getGalleryImages } from "@/app/actions";
import Image from "next/image";

export const metadata = {
    title: "Gallery | Luxe Salon",
    description: "View before and after hair transformations by Miglena Todorova at Luxe Salon Burgas.",
};

export default async function GalleryPage() {
    const images = await getGalleryImages();

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-16">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Our Work</h1>
                    <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
                        Transformations by Miglena Todorova. Discover your next look.
                    </p>
                </div>

                {images.length === 0 ? (
                    <div className="text-center text-muted-foreground py-24">
                        <p className="text-xl">Our gallery is currently being updated with amazing new looks.</p>
                        <p className="mt-2 text-primary/70">Check back soon!</p>
                    </div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {images.map((image: any) => (
                            <div key={image.id} className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                                <div className="relative w-full aspect-[3/4]">
                                    <Image
                                        src={image.image_url}
                                        alt={image.caption || "Hair transformation by Luxe Salon"}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                    <p className="text-white font-medium drop-shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        {image.caption || "Hair Transformation"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
