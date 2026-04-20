"use client";

import { useEffect, useState } from "react";
import { checkAdminSession, getServices } from "@/app/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Service } from "@/lib/data";

export default function AdminServicesPage() {
    const router = useRouter();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const isAdmin = await checkAdminSession();
            if (!isAdmin) {
                router.push("/admin/login");
                return;
            }
            const data = await getServices();
            setServices(data || []);
            setLoading(false);
        };
        init();
    }, [router]);

    if (loading) return <div className="p-8 text-center text-primary">Loading services...</div>;

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex gap-4 items-center mb-8">
                <Link href="/admin" className="text-muted-foreground hover:text-black transition-colors">&larr; Back to Dashboard</Link>
                <h1 className="text-4xl font-serif font-bold text-primary">Manage Services</h1>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-secondary/30 text-primary border-b border-gray-100">
                            <th className="p-4 font-semibold">Service Name</th>
                            <th className="p-4 font-semibold">Category</th>
                            <th className="p-4 font-semibold">Price ($)</th>
                            <th className="p-4 font-semibold">Duration (min)</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                    No services found. Database might be empty.
                                </td>
                            </tr>
                        ) : (
                             services.map((service: Service) => (
                                <tr key={service.id} className="border-b border-gray-50 hover:bg-secondary/10 transition-colors">
                                    <td className="p-4 font-medium text-primary">{service.name}</td>
                                    <td className="p-4 text-muted-foreground">{service.category}</td>
                                    <td className="p-4 text-primary font-bold">${service.price}</td>
                                    <td className="p-4 text-muted-foreground">{service.duration}</td>
                                    <td className="p-4 text-right">
                                        <button className="text-sm font-medium text-primary hover:underline" onClick={() => alert("Edit Coming Soon!")}>Edit</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className="mt-8 text-sm text-muted-foreground">
                <p>Note: Service editing requires full Supabase configuration to be active. Changes made in mock mode are read-only.</p>
            </div>
        </div>
    );
}
