"use server";

import fs from "fs";
import path from "path";
import { createSessionClient, isSupabaseConfigured } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import {
    getLocalSpecialists, saveLocalSpecialist, deleteLocalSpecialist, Specialist,
    getLocalBookings, saveLocalBooking, updateLocalBookingStatus, Booking,
    Service, GalleryImage
} from "@/lib/data";
import { sendAdminApprovalEmail } from "@/lib/email";

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
        try {
            const servicesPath = path.join(process.cwd(), 'data', 'services.json');
            if (fs.existsSync(servicesPath)) {
                const data = fs.readFileSync(servicesPath, 'utf8');
                return JSON.parse(data) as Service[];
            }
        } catch (e) {
            console.error("Failed to read local services", e);
        }
        return [];
    }

    const supabase = await createSessionClient();
    const { data, error } = await supabase.from("services").select("*").order("created_at", { ascending: true });
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
    const approvalToken = crypto.randomUUID(); // Generate secure token

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
    const { data: newBooking, error } = await supabase.from("bookings").insert({
        service_id: serviceId,
        specialist_id: specialistId || null,
        booking_date: date,
        booking_time: time,
        client_name: fullName,
        client_email: email,
        client_phone: phone,
        status: "pending",
        approval_token: approvalToken
    })
        .select(`*, services:services(*)`)
        .single();

    if (error) {
        console.error("Booking creation error:", error);
        return { message: "Failed to create booking. Please try again.", success: false };
    }

    // Send admin approval email
    if (newBooking) {
        const services = await getServices();
        const serviceName = services.find((s: Service) => s.id === newBooking.service_id)?.name || "Unknown Service";

        // Construct approval link
        // This should be based on your deployment URL
        const baseUrl = process.env.NODE_ENV === 'production'
            ? 'https://your-production-url.com' // IMPORTANT: Replace with your actual production URL
            : 'http://localhost:3000';
        const approvalLink = `${baseUrl}/api/booking/approve?token=${approvalToken}`;

        await sendAdminApprovalEmail({
            ...newBooking,
            services: { name: serviceName },
            client_name: newBooking.client_name,
            booking_date: newBooking.booking_date,
            booking_time: newBooking.booking_time,
            client_phone: newBooking.client_phone,
            client_email: newBooking.client_email,
        }, approvalLink);
    }

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

    const supabase = await createSessionClient();
    const { error } = await supabase.from("specialists").upsert(data);

    if (error) {
        console.error("Error saving specialist:", error);
        return { success: false, message: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/specialists");
    return { success: true, message: "Specialist saved successfully" };
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

    const supabase = await createSessionClient();
    const { error } = await supabase.from("specialists").delete().eq("id", id);

    if (error) {
        console.error("Error removing specialist:", error);
        return { success: false, message: error.message };
    }

    revalidatePath("/");
    revalidatePath("/admin/specialists");
    return { success: true, message: "Specialist removed" };
}

export async function getGalleryImages() {
    if (!isSupabaseConfigured) {
        try {
            const galleryPath = path.join(process.cwd(), 'data', 'gallery.json');
            if (fs.existsSync(galleryPath)) {
                const data = fs.readFileSync(galleryPath, 'utf8');
                return JSON.parse(data) as GalleryImage[];
            }
        } catch (e) {
            console.error("Failed to read local gallery data", e);
        }
        
        // Return default attractive beauty mock images if nothing exists
        return [
            { id: "1", image_url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=800&auto=format&fit=crop", caption: "Balayage Transformation" },
            { id: "2", image_url: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=800&auto=format&fit=crop", caption: "Bridal Updo" },
            { id: "3", image_url: "https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=800&auto=format&fit=crop", caption: "Precision Bob Cut" },
            { id: "4", image_url: "https://images.unsplash.com/photo-1600948836101-f9ffda59d250?q=80&w=800&auto=format&fit=crop", caption: "Vibrant Copper Tone" },
            { id: "5", image_url: "https://images.unsplash.com/photo-1595476140705-029dcb2d8a6b?q=80&w=800&auto=format&fit=crop", caption: "Creative Coloring" },
            { id: "6", image_url: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?q=80&w=800&auto=format&fit=crop", caption: "Sleek and Straight" }
        ];
    }

    const supabase = await createSessionClient();
    const { data, error } = await supabase.from("gallery_images").select("*").order("created_at", { ascending: false });
    
    if (error) {
        console.error("Error fetching gallery images:", error);
        return [];
    }
    return data;
}

export async function getProductImages() {
    if (!isSupabaseConfigured) {
        return [
            { id: "1", image_url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop", product_name: "Luxury Keratin Treatment", description: "Infused with organic oils for supreme smoothness." },
            { id: "2", image_url: "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=800&auto=format&fit=crop", product_name: "Premium Hair Mask", description: "Deep hydration for colored and treated hair." },
            { id: "3", image_url: "https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?q=80&w=800&auto=format&fit=crop", product_name: "Gold Elixir Oil", description: "Provides a glossy finish and protects from heat." }
        ];
    }
    const supabase = await createSessionClient();
    const { data, error } = await supabase.from("product_images").select("*").order("created_at", { ascending: false });
    if (error) return [];
    return data;
}

export async function addProductImage(imageUrl: string, productName: string, description: string) {
    if (!await checkAdminSession()) return { success: false, message: "Unauthorized" };
    if (!isSupabaseConfigured) return { success: true, message: "Added (Mock)" };

    const supabase = await createSessionClient();
    const { error } = await supabase.from("product_images").insert({
        image_url: imageUrl,
        product_name: productName,
        description: description
    });
    
    if (error) return { success: false, message: error.message };
    revalidatePath("/");
    revalidatePath("/admin/products");
    return { success: true, message: "Product added" };
}

export async function deleteProductImage(id: string) {
    if (!await checkAdminSession()) return { success: false, message: "Unauthorized" };
    if (!isSupabaseConfigured) return { success: true, message: "Deleted (Mock)" };

    const supabase = await createSessionClient();
    const { error } = await supabase.from("product_images").delete().eq("id", id);
    if (error) return { success: false, message: error.message };
    revalidatePath("/");
    revalidatePath("/admin/products");
    return { success: true, message: "Product deleted" };
}
