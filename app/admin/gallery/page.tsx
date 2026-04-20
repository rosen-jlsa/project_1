"use client";

import { useEffect, useState } from "react";
import { checkAdminSession, getGalleryImages } from "@/app/actions";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { GalleryImage } from "@/lib/data";

export default function AdminGalleryPage() {
    const router = useRouter();
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const isAdmin = await checkAdminSession();
            if (!isAdmin) {
                router.push("/admin/login");
                return;
            }
            const data = await getGalleryImages();
            setImages(data || []);
            setLoading(false);
        };
        init();
    }, [router]);

    if (loading) return <div className="p-8 text-center text-primary">Loading gallery...</div>;
    
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <div className="flex gap-4 items-center">
                    <Link href="/admin" className="text-muted-foreground hover:text-black transition-colors">&larr; Back to Dashboard</Link>
                    <h1 className="text-4xl font-serif font-bold text-primary">Manage Custom Gallery</h1>
                </div>
                <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-black transition-colors" onClick={() => alert("Upload Image integration with Supabase coming soon! Currently displaying Mock Data.")}>
                    + Add New Image
                </button>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
                <p className="text-muted-foreground mb-6">Manage the high-converting images shown on the public Gallery page. Note: Edits made here will only reflect in the live site if you have Supabase fully connected.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {images.map((image: GalleryImage) => (
                        <div key={image.id} className="group relative border rounded-lg overflow-hidden bg-gray-50 flex flex-col items-center">
                            <div className="relative w-full aspect-square">
                                <Image src={image.image_url} alt={image.caption || "Gallery Image"} fill className="object-cover" sizes="25vw" />
                            </div>
                            <div className="p-3 w-full border-t bg-white flex justify-between items-center">
                                <span className="text-sm font-medium text-primary truncate pr-2" title={image.caption}>{image.caption || 'No Caption'}</span>
                                <button className="text-red-500 hover:text-red-700 font-bold text-xs" onClick={() => alert("Delete functionality coming soon!")}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
