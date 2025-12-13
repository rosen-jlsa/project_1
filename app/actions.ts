"use server";

import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { sendAdminApprovalEmail } from "@/lib/email";
import { cookies } from "next/headers";

export async function adminLogin(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const adminEmail = process.env.ADMIN_EMAIL || "miglena.todorova75@gmail.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "buv6dxiku2";

    if (email === adminEmail && password === adminPassword) {
        // Set cookie
        (await cookies()).set("admin_session", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });
        return { success: true };
    }

    return { success: false, message: "Invalid email or password" };
}

export async function checkAdminSession() {
    const session = (await cookies()).get("admin_session");
    return !!session?.value;
}

export async function logoutAdmin() {
    (await cookies()).delete("admin_session");
    return { success: true };
}

export async function getServices() {
    if (!isSupabaseConfigured) {
        // Return mock data if Supabase is not connected
        return [
            { id: "1", name: "Classic Cut", category: "Men", price: 30, duration: 30 },
            { id: "2", name: "Beard Trim", category: "Men", price: 20, duration: 20 },
            { id: "3", name: "Full Service", category: "Men", price: 45, duration: 45 },
            { id: "4", name: "Wash & Cut", category: "Women", price: 50, duration: 60 },
            { id: "5", name: "Styling", category: "Women", price: 40, duration: 45 },
            { id: "6", name: "Coloring", category: "Women", price: 120, duration: 120 },
            { id: "7", name: "Kids Cut", category: "Children", price: 25, duration: 30 },
            { id: "8", name: "Ear Piercing", category: "Piercing", price: 35, duration: 15 },
            { id: "9", name: "Nose Piercing", category: "Piercing", price: 40, duration: 20 },
        ];
    }

    const { data, error } = await supabase.from("services").select("*");
    if (error) {
        console.error("Error fetching services:", error);
        return [];
    }
    return data;
}

export async function createBooking(prevState: any, formData: FormData) {
    const serviceId = formData.get("serviceId") as string;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;

    if (!serviceId || !date || !time || !firstName || !lastName || !email || !phone) {
        return { message: "Please fill in all fields", success: false };
    }

    const fullName = `${firstName} ${lastName}`;

    // Basic validation for time range (10:00 - 18:00)
    const hour = parseInt(time.split(":")[0]);
    if (hour < 10 || hour >= 18) {
        return { message: "Please select a time between 10:00 and 18:00", success: false };
    }

    if (!isSupabaseConfigured) {
        // Simulate success for mock mode
        return { message: "Booking request sent! (Mock Mode)", success: true };
    }

    const { data, error } = await supabase.from("bookings").insert({
        service_id: serviceId,
        booking_date: date,
        booking_time: time,
        client_name: fullName,
        client_email: email,
        client_phone: phone,
        status: "pending",
    })
        .select(`*, services:services(*)`) // Select services to get name for email
        .single();

    if (error) {
        console.error("Error creating booking:", error);
        // Fallback: Try without email if that was the issue
        if (error.message.includes("client_email")) {
            const { error: retryError } = await supabase.from("bookings").insert({
                service_id: serviceId,
                booking_date: date,
                booking_time: time,
                client_name: fullName,
                client_phone: phone,
                status: "pending",
            });
            if (retryError) {
                return { message: "Failed to create booking. Please try again.", success: false };
            }
            return { message: "Booking request sent!", success: true };
        }
        return { message: "Failed to create booking. Please try again.", success: false };
    }

    // Send email to admin
    if (data) {
        const approvalLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/booking/approve?id=${data.id}`;
        await sendAdminApprovalEmail(data, approvalLink);
    }

    return { message: "Booking request sent! We will contact you shortly.", success: true };
}

export async function updateBookingStatus(id: string, status: 'approved' | 'rejected') {
    const { error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", id);

    if (error) {
        console.error("Error updating booking:", error);
        return { success: false, message: "Failed to update status" };
    }

    revalidatePath("/admin");
    return { success: true, message: `Booking ${status}` };
}

export async function getBookedSlots(date: string) {
    if (!isSupabaseConfigured) {
        // Mock data: 12:00 is always booked on any date
        return [];
    }

    const { data, error } = await supabase
        .from("bookings")
        .select("booking_time")
        .eq("booking_date", date)
        .neq("status", "rejected"); // Don't count rejected bookings as taken

    if (error) {
        console.error("Error fetching booked slots:", error);
        return [];
    }

    return data.map(b => b.booking_time);
}

export async function getBookings() {
    if (!isSupabaseConfigured) {
        return [
            {
                id: "mock-1",
                client_name: "John Doe",
                client_phone: "123-456-7890",
                client_email: "john@example.com",
                booking_date: "2024-01-01",
                booking_time: "10:00",
                status: "pending",
                services: { name: "Classic Cut", price: 30, duration: 30 }
            },
            {
                id: "mock-2",
                client_name: "Jane Smith",
                client_phone: "987-654-3210",
                booking_date: "2024-01-02",
                booking_time: "14:00",
                status: "approved",
                services: { name: "Coloring", price: 120, duration: 120 }
            }
        ];
    }

    const { data, error } = await supabase
        .from("bookings")
        .select(`
            *,
            services (name, price, duration)
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching bookings:", error);
        return [];
    }
    return data;
}

export async function getReviews() {
    if (!isSupabaseConfigured) {
        return [
            { id: "1", name: "Alice Johnson", rating: 5, comment: "Amazing service! The haircut was exactly what I wanted.", date: "2023-10-15" },
            { id: "2", name: "Michael Brown", rating: 4, comment: "Great atmosphere and friendly staff. Highly recommend.", date: "2023-10-20" },
            { id: "3", name: "Sarah Davis", rating: 5, comment: "Best salon in town! Love my new color.", date: "2023-10-25" },
        ];
    }

    const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching reviews:", error);
        return [];
    }
    return data;
}

export async function submitReview(prevState: any, formData: FormData) {
    const name = formData.get("name") as string;
    const rating = parseInt(formData.get("rating") as string);
    const comment = formData.get("comment") as string;

    if (!name || !rating || !comment) {
        return { success: false, message: "Please fill in all fields" };
    }

    if (!isSupabaseConfigured) {
        return { success: true, message: "Review submitted successfully! (Mock Mode)" };
    }

    const { error } = await supabase.from("reviews").insert({
        client_name: name,
        rating: rating,
        comment: comment,
        status: "pending" // Optional: moderation
    });

    if (error) {
        console.error("Error submitting review:", error);
        return { success: false, message: "Failed to submit review" };
    }

    revalidatePath("/");
    return { success: true, message: "Review submitted successfully!" };
}
