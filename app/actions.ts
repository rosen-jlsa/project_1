"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getSpecialists() {
    const { data, error } = await supabase.from("specialists").select("*");
    if (error) {
        console.error("Error fetching specialists:", error);
        return [];
    }
    return data;
}

export async function createBooking(prevState: any, formData: FormData) {
    const specialistId = formData.get("specialistId") as string;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;

    if (!specialistId || !date || !time || !name || !phone) {
        return { message: "Please fill in all fields", success: false };
    }

    // Basic validation for time range (10:00 - 18:00)
    const hour = parseInt(time.split(":")[0]);
    if (hour < 10 || hour >= 18) {
        return { message: "Please select a time between 10:00 and 18:00", success: false };
    }

    const { error } = await supabase.from("bookings").insert({
        specialist_id: specialistId,
        booking_date: date,
        booking_time: time,
        client_name: name,
        client_phone: phone,
        status: "pending",
    });

    if (error) {
        console.error("Error creating booking:", error);
        return { message: "Failed to create booking. Please try again.", success: false };
    }

    revalidatePath("/admin");
    return { message: "Booking request sent! Waiting for approval.", success: true };
}

export async function getBookings() {
    const { data, error } = await supabase
        .from("bookings")
        .select(`
      *,
      specialists (name, role)
    `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching bookings:", error);
        return [];
    }
    return data;
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
