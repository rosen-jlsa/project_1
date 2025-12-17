"use client";
import { useState, useEffect } from "react";
import { getSpecialists, removeSpecialist } from "@/app/actions";
import { Specialist } from "@/lib/data";
import { Plus, Trash2, Edit, Phone, Instagram, Twitter, Facebook, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SpecialistForm } from "./specialist-form";
import Image from "next/image";

export default function ManageSpecialists() {
    const [specialists, setSpecialists] = useState<Specialist[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingSpecialist, setEditingSpecialist] = useState<Specialist | null>(null);
    const [showForm, setShowForm] = useState(false);



    useEffect(() => {
        let mounted = true;
        const load = async () => {
            const data = await getSpecialists();
            if (mounted) {
                setSpecialists(data || []);
                setLoading(false);
            }
        };
        load();
        return () => { mounted = false; };
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this specialist?")) {
            await removeSpecialist(id);
            // Refresh list
            const data = await getSpecialists();
            setSpecialists(data || []);
        }
    };

    const handleEdit = (specialist: Specialist) => {
        setEditingSpecialist(specialist);
        setShowForm(true);
    };

    const handleFormClose = async () => {
        setEditingSpecialist(null);
        setShowForm(false);
        // Refresh
        const data = await getSpecialists();
        setSpecialists(data || []);
    };

    if (loading) return <div className="p-8 text-center text-primary">Loading...</div>;

    if (showForm) {
        return (
            <div className="container mx-auto px-4 py-8">
                <button onClick={() => setShowForm(false)} className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-6">
                    <ArrowLeft className="w-4 h-4" /> Back to List
                </button>
                <h1 className="text-3xl font-serif font-bold text-primary mb-8">
                    {editingSpecialist ? "Edit Specialist" : "Add New Specialist"}
                </h1>
                <SpecialistForm initialData={editingSpecialist} onClose={handleFormClose} />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <h1 className="text-3xl font-serif font-bold text-primary">Manage Specialists</h1>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Specialist
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {specialists.map((specialist) => (
                    <div key={specialist.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden flex-shrink-0 relative">
                                {specialist.image ? (
                                    <Image
                                        src={specialist.image}
                                        alt={specialist.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 100px"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl">
                                        {specialist.name.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-primary">{specialist.name}</h3>
                                <p className="text-sm text-muted-foreground">{specialist.role}</p>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">{specialist.bio}</p>

                        <div className="space-y-2 mb-6">
                            {specialist.phone && (
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Phone className="w-4 h-4" /> {specialist.phone}
                                </div>
                            )}
                            <div className="flex gap-3 text-gray-400">
                                {specialist.instagram && <Instagram className="w-4 h-4" />}
                                {specialist.twitter && <Twitter className="w-4 h-4" />}
                                {specialist.facebook && <Facebook className="w-4 h-4" />}
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4 border-t border-gray-100 mt-auto">
                            <button
                                onClick={() => handleEdit(specialist)}
                                className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                <Edit className="w-4 h-4" /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(specialist.id)}
                                className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
