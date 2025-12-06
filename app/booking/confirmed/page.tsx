import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function BookingConfirmedPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-gray-100">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-10 w-10" />
                </div>
                <h1 className="text-3xl font-serif font-bold text-primary mb-4">Booking Confirmed</h1>
                <p className="text-muted-foreground mb-8">
                    The booking has been successfully approved and the client has been notified via email.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 transition-colors"
                >
                    Return to Home
                </Link>
            </div>
        </div>
    );
}
