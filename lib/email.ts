import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
// We conditionally initialize to avoid crashing if the key is missing (e.g. in dev without env vars)
const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

// Use environment variable for admin email, with a fallback for convenience.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "miglena.todorova75@gmail.com";

interface BookingDetails {
    client_name: string;
    services: { name: string } | null;
    booking_date: string;
    booking_time: string;
    client_phone: string;
    client_email: string;
    id?: string;
}

export async function sendAdminApprovalEmail(booking: BookingDetails, approvalLink: string) {
    if (!resend) {
        console.warn("Email sending is mocked. RESEND_API_KEY is not configured.");
        return { success: true, id: 'mock-id' };
    }

    // This check is now redundant since the email is hardcoded, but kept for safety.
    if (!ADMIN_EMAIL) {
        throw new Error("Admin Email not configured. Cannot send approval email.");
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Luxe Salon <onboarding@resend.dev>', // Update this if user has a domain
            to: [ADMIN_EMAIL],
            subject: 'New Booking Request - Action Required',
            html: `
        <h1>New Booking Request</h1>
        <p><strong>Client:</strong> ${booking.client_name}</p>
        <p><strong>Service:</strong> ${booking.services?.name}</p>
        <p><strong>Date:</strong> ${booking.booking_date} at ${booking.booking_time}</p>
        <p><strong>Phone:</strong> ${booking.client_phone}</p>
        <p><strong>Email:</strong> ${booking.client_email}</p>
        <br/>
        <a href="${approvalLink}" style="background-color: #5F4A8B; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Approve Booking</a>
      `,
        });

        if (error) {
            console.error('Resend Error:', error);
            // Throw an error to be caught by the calling function
            throw new Error(`Failed to send email: ${error.message}`);
        }

        return { success: true, data };
    } catch (error) {
        console.error('Email Sending Failed:', error);
        // Re-throw the error to ensure the caller is aware of the failure
        throw error;
    }
}

export async function sendClientConfirmationEmail(booking: BookingDetails) {
    if (!resend) {
        console.warn("Email sending is mocked for client confirmation. RESEND_API_KEY is not configured.");
        return { success: true, id: 'mock-id' };
    }

    if (!booking.client_email) {
        console.error("Client email is missing, cannot send confirmation.");
        // We don't throw here as the admin flow might still succeed.
        // This is a business logic decision. For now, we just log and return.
        return { success: false, error: 'No client email' };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Luxe Salon <onboarding@resend.dev>',
            to: [booking.client_email],
            subject: 'Booking Confirmed - Luxe Salon',
            html: `
        <h1>Booking Confirmed!</h1>
        <p>Hi ${booking.client_name},</p>
        <p>Your appointment has been confirmed.</p>
        <p><strong>Service:</strong> ${booking.services?.name}</p>
        <p><strong>Date:</strong> ${booking.booking_date} at ${booking.booking_time}</p>
        <br/>
        <p>We look forward to seeing you!</p>
      `,
        });

        if (error) {
            console.error('Resend Error (Client Email):', error);
            // Throw an error to be caught by the calling function (e.g., the approval API route)
            throw new Error(`Failed to send client confirmation email: ${error.message}`);
        }

        return { success: true, data };
    } catch (error) {
        console.error('Client Email Sending Failed:', error);
        // Re-throw the error to ensure the caller is aware of the failure
        throw error;
    }
}
