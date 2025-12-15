"use client";
import { useState } from "react";
import { saveSpecialist } from "@/app/actions";
import { Specialist } from "@/lib/data";
import { Loader2 } from "lucide-react";

type Props = {
    initialData?: Specialist | null;
    onClose: () => void;
};

export function SpecialistForm({ initialData, onClose }: Props) {
    const [formData, setFormData] = useState<Partial<Specialist>>(
        initialData || {
            name: "",
            role: "",
            bio: "",
            image: "",
            phone: "",
            instagram: "",
            twitter: "",
            facebook: ""
        }
    );
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const specialist: Specialist = {
            id: initialData?.id || crypto.randomUUID(),
            name: formData.name || "",
            role: formData.role || "",
            bio: formData.bio || "",
            image: formData.image || "",
            phone: formData.phone || undefined,
            instagram: formData.instagram || undefined,
            twitter: formData.twitter || undefined,
            facebook: formData.facebook || undefined
        };

        const result = await saveSpecialist(specialist);
        setLoading(false);

        if (result.success) {
            onClose();
        } else {
            alert(result.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <input
                        required
                        className="w-full p-2 border rounded-lg"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Role</label>
                    <input
                        required
                        className="w-full p-2 border rounded-lg"
                        value={formData.role}
                        onChange={e => setFormData({ ...formData, role: e.target.value })}
                        placeholder="Senior Stylist"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Bio</label>
                <textarea
                    required
                    className="w-full p-2 border rounded-lg min-h-[100px]"
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Describe their expertise..."
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Image URL</label>
                <input
                    className="w-full p-2 border rounded-lg"
                    value={formData.image}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/path/to/image.jpg"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <input
                        className="w-full p-2 border rounded-lg"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+359..."
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Instagram Handle</label>
                    <input
                        className="w-full p-2 border rounded-lg"
                        value={formData.instagram}
                        onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                        placeholder="username"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Twitter Handle</label>
                    <input
                        className="w-full p-2 border rounded-lg"
                        value={formData.twitter}
                        onChange={e => setFormData({ ...formData, twitter: e.target.value })}
                        placeholder="username"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Facebook Handle</label>
                    <input
                        className="w-full p-2 border rounded-lg"
                        value={formData.facebook}
                        onChange={e => setFormData({ ...formData, facebook: e.target.value })}
                        placeholder="username"
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary/90 flex items-center gap-2"
                >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Specialist
                </button>
            </div>
        </form>
    );
}
