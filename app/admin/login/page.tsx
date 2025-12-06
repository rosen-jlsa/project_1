"use client";

import { useState } from "react";
import { adminLogin } from "@/app/actions";
import { useRouter } from "next/navigation";
import { Lock, Mail, AlertCircle } from "lucide-react";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        const result = await adminLogin(formData);

        if (result.success) {
            router.push("/admin");
        } else {
            setError(result.message || "Invalid credentials");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                        <Lock className="h-8 w-8" />
                    </div>
                    <h1 className="text-2xl font-serif font-bold text-primary">Admin Access</h1>
                    <p className="text-muted-foreground text-sm mt-2">Please log in to manage bookings.</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="admin@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black py-3 rounded-lg font-bold border-2 border-black hover:bg-black hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                        {loading ? "Verifying..." : "Login to Dashboard"}
                    </button>
                </form>
            </div>
        </div>
    );
}
