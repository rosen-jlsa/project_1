"use client";

import { useEffect, useState } from "react";
import { checkAdminSession, getProductImages } from "@/app/actions";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ProductImage } from "@/lib/data";

export default function AdminProductsPage() {
    const router = useRouter();
    const [products, setProducts] = useState<ProductImage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const isAdmin = await checkAdminSession();
            if (!isAdmin) {
                router.push("/admin/login");
                return;
            }
            const data = await getProductImages();
            setProducts(data || []);
            setLoading(false);
        };
        init();
    }, [router]);

    if (loading) return <div className="p-8 text-center text-primary">Loading products...</div>;
    
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <div className="flex gap-4 items-center">
                    <Link href="/admin" className="text-muted-foreground hover:text-black transition-colors">&larr; Back to Dashboard</Link>
                    <h1 className="text-4xl font-serif font-bold text-primary">Manage Products We Use</h1>
                </div>
                <button className="bg-primary text-black px-6 py-2 rounded-lg font-bold hover:bg-black hover:text-white transition-colors border-2 border-black" onClick={() => alert("Image Upload integration with Supabase coming soon! Currently displaying Mock/DB Data.")}>
                    + Add New Product
                </button>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
                <p className="text-muted-foreground mb-6">Manage the high-quality product images shown on the public homepage. Note: Edits made here will only reflect in the live site if you have Supabase fully connected.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {products.map((product: ProductImage) => (
                        <div key={product.id} className="group relative border border-gray-200 rounded-lg overflow-hidden bg-gray-50 flex flex-col">
                            <div className="relative w-full aspect-square">
                                <Image src={product.image_url} alt={product.product_name || "Product Image"} fill className="object-cover" sizes="25vw" />
                            </div>
                            <div className="p-4 bg-white flex flex-col justify-between flex-grow">
                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-black mb-1 leading-tight">{product.product_name}</h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2" title={product.description}>{product.description || 'No Description'}</p>
                                </div>
                                <div className="flex justify-end pt-2 border-t">
                                    <button className="text-red-500 hover:text-red-700 font-bold text-xs" onClick={() => alert("Delete functionality coming soon!")}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
