"use server";

import { createSessionClient, isSupabaseConfigured } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
    getLocalSpecialists, saveLocalSpecialist, deleteLocalSpecialist, Specialist,
    getLocalBookings, saveLocalBooking, updateLocalBookingStatus, Booking
} from "@/lib/data";

export async function adminLogin(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!isSupabaseConfigured) {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminEmail || !adminPassword) {
            console.error("Admin credentials are not properly configured in environment variables.");
            return { success: false, message: "Server configuration error" };
        }

        if (email === adminEmail && password === adminPassword) {
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

    const supabase = await createSessionClient();
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { success: false, message: error.message };
    }

    return { success: true };
}

export async function checkAdminSession() {
    if (!isSupabaseConfigured) {
        const session = (await cookies()).get("admin_session");
        return !!session?.value;
    }

    const supabase = await createSessionClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) return false;

    // Check for role in user_roles
    const { data, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

    if (roleError || !data) return false;

    return ['sysadmin', 'moderator'].includes(data.role);
}

export async function logoutAdmin() {
    if (!isSupabaseConfigured) {
        (await cookies()).delete("admin_session");
        return { success: true };
    }

    const supabase = await createSessionClient();
    await supabase.auth.signOut();
    return { success: true };
}

export async function getServices() {
    if (!isSupabaseConfigured) {
        // Return mock data if Supabase is not connected
        // Return mock data if Supabase is not connected
        return [
            // Miglena (Hair) - ID: 1
            { id: "1", name: "Women's Haircut", category: "Women", price: 50, duration: 60, specialistIds: ["1"] },
            { id: "2", name: "Men's Haircut", category: "Men", price: 30, duration: 30, specialistIds: ["1"] },
            { id: "3", name: "Child's Haircut", category: "Children", price: 25, duration: 30, specialistIds: ["1"] },
            { id: "4", name: "Hair Coloring", category: "Women", price: 120, duration: 120, specialistIds: ["1"] },
            { id: "5", name: "Blow Dry & Styling", category: "Women", price: 40, duration: 45, specialistIds: ["1"] },

            // Monika (Beautician) - ID: 2
            { id: "6", name: "Basic Facial", category: "Face", price: 60, duration: 60, specialistIds: ["2"] },
            { id: "7", name: "Deep Cleaning Facial", category: "Face", price: 80, duration: 90, specialistIds: ["2"] },
            { id: "8", name: "Eyebrow Shaping", category: "Face", price: 15, duration: 15, specialistIds: ["2"] },
            { id: "9", name: "Full Body Waxing", category: "Body", price: 100, duration: 90, specialistIds: ["2"] },

            // Galina (Manicurist) - ID: 3
            { id: "10", name: "Classic Manicure", category: "Nails", price: 30, duration: 45, specialistIds: ["3"] },
            { id: "11", name: "Gel Manicure", category: "Nails", price: 50, duration: 60, specialistIds: ["3"] },
            { id: "12", name: "Pedicure", category: "Nails", price: 55, duration: 60, specialistIds: ["3"] },
            { id: "13", name: "Gel Pedicure", category: "Nails", price: 70, duration: 75, specialistIds: ["3"] },

            // Piercing (Miglena/Monika might do this, assigning to Miglena for now or general)
            { id: "14", name: "Ear Piercing", category: "Piercing", price: 35, duration: 15, specialistIds: ["1"] },
        ];
    }

    const supabase = await createSessionClient();
    const { data, error } = await supabase.from("services").select("*");
    if (error) {
        console.error("Error fetching services:", error);
        return [];
    }
    return data;
}

type ActionState = {
    message: string;
    success: boolean;
};

export async function createBooking(prevState: ActionState | null, formData: FormData) {
    const serviceId = formData.get("serviceId") as string;
    const specialistId = formData.get("specialistId") as string;
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
        // Save to local JSON
        const booking: Booking = {
            id: crypto.randomUUID(),
            serviceId,
            specialistId: specialistId || undefined,
            date,
            time,
            clientName: fullName,
            clientEmail: email,
            clientPhone: phone,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        saveLocalBooking(booking);

        revalidatePath("/admin");
        return { message: "Booking request sent!", success: true };
    }

    const supabase = await createSessionClient();
    const { error } = await supabase.from("bookings").insert({
        service_id: serviceId,
        specialist_id: specialistId || null, // Assuming column exists or is tolerated
        booking_date: date,
        booking_time: time,
        client_name: fullName,
        client_email: email,
        client_phone: phone,
        status: "pending",
    })
        .select(`*, services:services(*)`)
        .single();

    // ... existing error handling ...
    if (error) {
        return { message: "Failed to create booking. Please try again.", success: false };
    }

    // ... existing email sending ...

    return { message: "Booking request sent! We will contact you shortly.", success: true };
}

export async function updateBookingStatus(id: string, status: 'approved' | 'rejected') {
    if (!isSupabaseConfigured) {
        updateLocalBookingStatus(id, status);
        revalidatePath("/admin");
        return { success: true, message: `Booking ${status}` };
    }

    const supabase = await createSessionClient();
    const { error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", id);
    // ... existing error handling ...
    if (error) {
        console.error("Error updating booking:", error);
        return { success: false, message: "Failed to update status" };
    }

    revalidatePath("/admin");
    return { success: true, message: `Booking ${status}` };
}

export async function getBookedSlots(date: string, specialistId?: string) {
    if (!isSupabaseConfigured) {
        const bookings = getLocalBookings();
        return bookings
            .filter(b =>
                b.date === date &&
                b.status !== 'rejected' &&
                (!specialistId || b.specialistId === specialistId)
            )
            .map(b => b.time);
    }

    // Supabase implementation
    const supabase = await createSessionClient();
    let query = supabase
        .from("bookings")
        .select("booking_time")
        .eq("booking_date", date)
        .neq("status", "rejected");

    if (specialistId) {
        query = query.eq("specialist_id", specialistId);
    }

    const { data, error } = await query;

    if (error) {
        // console.error("Error fetching booked slots:", error);
        return [];
    }

    return data.map(b => b.booking_time);
}

export async function getBookings() {
    if (!isSupabaseConfigured) {
        const bookings = getLocalBookings();
        // Map local bookings to the format expected by the frontend
        return bookings.map(b => ({
            id: b.id,
            client_name: b.clientName,
            client_phone: b.clientPhone,
            client_email: b.clientEmail,
            booking_date: b.date,
            booking_time: b.time,
            status: b.status,
            services: { name: "Service", price: 0, duration: 0 }, // Placeholder as we don't have full service linking in simple mock
            specialist_id: b.specialistId
        })).sort((a, b) => new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime());
    }

    const supabase = await createSessionClient();
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

    const supabase = await createSessionClient();
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

export async function submitReview(prevState: ActionState | null, formData: FormData) {
    const name = formData.get("name") as string;
    const rating = parseInt(formData.get("rating") as string);
    const comment = formData.get("comment") as string;

    if (!name || !rating || !comment) {
        return { success: false, message: "Please fill in all fields" };
    }

    if (!isSupabaseConfigured) {
        return { success: true, message: "Review submitted successfully! (Mock Mode)" };
    }

    const supabase = await createSessionClient();
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

export async function getSpecialists() {
    if (!isSupabaseConfigured) {
        return getLocalSpecialists();
    }
    // Future: Supabase implementation
    const supabase = await createSessionClient();
    const { data, error } = await supabase.from("specialists").select("*");
    if (error) return [];
    return data;
}

export async function saveSpecialist(data: Specialist) {
    // Check auth
    if (!await checkAdminSession()) {
        return { success: false, message: "Unauthorized" };
    }

    if (!isSupabaseConfigured) {
        saveLocalSpecialist(data);
        revalidatePath("/");
        revalidatePath("/admin/specialists");
        return { success: true, message: "Specialist saved successfully" };
    }

    // Future: Supabase save
    return { success: false, message: "Database not connected" };
}

export async function removeSpecialist(id: string) {
    if (!await checkAdminSession()) {
        return { success: false, message: "Unauthorized" };
    }

    if (!isSupabaseConfigured) {
        deleteLocalSpecialist(id);
        revalidatePath("/");
        revalidatePath("/admin/specialists");
        return { success: true, message: "Specialist removed" };
    }

    return { success: false, message: "Database not connected" };
}

