import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
// We conditionally initialize to avoid crashing if the key is missing (e.g. in dev without env vars)
const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null;

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'miglena.todorova75@gmail.com'; // Default to the one provided in chat history

export async function sendAdminApprovalEmail(booking: any, approvalLink: string) {
    if (!resend) {
        console.log("Mock Email to Admin (No API Key):", { booking, approvalLink });
        return { success: true, id: 'mock-id' };
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
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Email Sending Failed:', error);
        return { success: false, error };
    }
}

export async function sendClientConfirmationEmail(booking: any) {
    if (!resend) {
        console.log("Mock Email to Client (No API Key):", { booking });
        return { success: true, id: 'mock-id' };
    }

    if (!booking.client_email) return { success: false, error: 'No client email' };

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
            console.error('Resend Error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Email Sending Failed:', error);
        return { success: false, error };
    }
}
