import { createAdminClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { sendClientConfirmationEmail } from '@/lib/email';

// We need a service role client to bypass RLS for updates if needed, 
// or just use the standard client if the user is authenticated (but here it's a link click).
// Ideally, we should use a signed token, but for simplicity we'll use the ID and a secret or just the ID if we trust the link (not secure for prod, but okay for MVP).
// BETTER: Use a service role key for this specific admin action.

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.json({ error: 'Missing approval token' }, { status: 400 });
    }

    // Check if Supabase is configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn("Supabase not configured. Mocking approval.");
        return NextResponse.redirect(new URL('/booking/confirmed?mock=true', request.url));
    }

    const supabaseAdmin = createAdminClient();

    // 1. Update booking status
    const { data: booking, error: updateError } = await supabaseAdmin
        .from('bookings')
        .update({ status: 'approved' })
        .eq('approval_token', token)
        .select('*, services(name)')
        .single();

    if (updateError) {
        console.error("Error updating booking:", updateError);
        return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
    }

    if (!booking) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // 2. Send confirmation email to client
    await sendClientConfirmationEmail(booking);

    // 3. Redirect to a success page
    return NextResponse.redirect(new URL('/booking/confirmed', request.url));
}
