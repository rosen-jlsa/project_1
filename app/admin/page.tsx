"use client";

import { useState, useEffect } from "react";
import { getBookings, updateBookingStatus } from "@/app/actions";
import { Check, X, Clock, Calendar, User, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

type Booking = {
    id: string;
    client_name: string;
    client_phone: string;
    booking_date: string;
    booking_time: string;
    status: 'pending' | 'approved' | 'rejected';
    specialists: {
        name: string;
        role: string;
    };
};

export default function AdminDashboard() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        const data = await getBookings();
        setBookings(data || []);
        setLoading(false);
    };

    const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
        // Optimistic update
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));

        const result = await updateBookingStatus(id, status);
        if (!result.success) {
            // Revert if failed
            loadBookings();
            alert("Failed to update status");
        }
    };

    if (loading) return <div className="p-8 text-center text-primary">Loading dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-serif font-bold text-primary">Admin Dashboard</h1>
                    <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm text-muted-foreground">
                        {bookings.filter(b => b.status === 'pending').length} Pending Requests
                    </div>
                </div>

                <div className="grid gap-6">
                    {bookings.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">No bookings found.</div>
                    ) : (
                        bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className={cn(
                                    "bg-white rounded-xl p-6 shadow-sm border-l-4 transition-all",
                                    booking.status === 'pending' ? "border-yellow-400" :
                                        booking.status === 'approved' ? "border-green-500 opacity-75" :
                                            "border-red-500 opacity-50"
                                )}
                            >
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-primary font-bold text-lg">
                                            <User className="h-5 w-5" />
                                            {booking.client_name}
                                        </div>
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Phone className="h-4 w-4" />
                                            {booking.client_phone}
                                        </div>
                                        <div className="flex items-center gap-4 mt-2 text-sm">
                                            <span className="bg-secondary px-3 py-1 rounded-full text-primary font-medium">
                                                {booking.specialists?.name} ({booking.specialists?.role})
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:items-end gap-2">
                                        <div className="flex items-center gap-2 text-lg font-medium">
                                            <Calendar className="h-5 w-5 text-accent" />
                                            {booking.booking_date}
                                        </div>
                                        <div className="flex items-center gap-2 text-lg font-medium">
                                            <Clock className="h-5 w-5 text-accent" />
                                            {booking.booking_time}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 md:border-l md:pl-6">
                                        {booking.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(booking.id, 'approved')}
                                                    className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                                                    title="Approve"
                                                >
                                                    <Check className="h-6 w-6" />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                                                    className="p-2 bg-red-100 text-red-700 rounded-full hover:bg-red-200 transition-colors"
                                                    title="Reject"
                                                >
                                                    <X className="h-6 w-6" />
                                                </button>
                                            </>
                                        )}
                                        {booking.status !== 'pending' && (
                                            <span className={cn(
                                                "px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider",
                                                booking.status === 'approved' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                            )}>
                                                {booking.status}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
