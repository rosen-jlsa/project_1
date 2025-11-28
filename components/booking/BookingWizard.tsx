"use client";

import { useState, useEffect } from "react";
import { createBooking, getSpecialists } from "@/app/actions";
import { Calendar, Clock, User, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Types
type Specialist = {
    id: string;
    name: string;
    role: string;
};

const TIME_SLOTS = [
    "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30"
];

export function BookingWizard() {
    const [step, setStep] = useState(1);
    const [specialists, setSpecialists] = useState<Specialist[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [selectedSpecialist, setSelectedSpecialist] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [time, setTime] = useState<string>("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    // Submission State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        getSpecialists().then((data) => {
            setSpecialists(data || []);
            setLoading(false);
        });
    }, []);

    const handleNext = () => {
        if (step === 1 && selectedSpecialist) setStep(2);
        if (step === 2 && date && time) setStep(3);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("specialistId", selectedSpecialist);
        formData.append("date", date);
        formData.append("time", time);
        formData.append("name", name);
        formData.append("phone", phone);

        const result = await createBooking(null, formData);

        if (result.success) {
            setMessage({ text: result.message, type: 'success' });
            setStep(4);
        } else {
            setMessage({ text: result.message, type: 'error' });
        }
        setIsSubmitting(false);
    };

    // Get tomorrow's date as min date
    const minDate = new Date().toISOString().split('T')[0];
    // Get date 30 days from now as max date
    const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    if (loading) return <div className="text-primary animate-pulse">Loading specialists...</div>;

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Progress Bar */}
            <div className="bg-secondary p-4 flex justify-between items-center text-sm font-medium text-primary/60">
                <div className={cn("flex items-center gap-2", step >= 1 && "text-primary")}>
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs border border-primary/20">1</span>
                    Specialist
                </div>
                <div className="h-[1px] w-10 bg-primary/20" />
                <div className={cn("flex items-center gap-2", step >= 2 && "text-primary")}>
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs border border-primary/20">2</span>
                    Time
                </div>
                <div className="h-[1px] w-10 bg-primary/20" />
                <div className={cn("flex items-center gap-2", step >= 3 && "text-primary")}>
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs border border-primary/20">3</span>
                    Details
                </div>
            </div>

            <div className="p-8 min-h-[400px] flex flex-col">
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-2xl font-serif font-bold text-primary">Select a Specialist</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {specialists.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => setSelectedSpecialist(s.id)}
                                    className={cn(
                                        "p-6 rounded-xl border-2 text-left transition-all hover:shadow-md",
                                        selectedSpecialist === s.id
                                            ? "border-primary bg-secondary/50"
                                            : "border-gray-100 hover:border-primary/50"
                                    )}
                                >
                                    <div className="font-bold text-lg text-primary">{s.name}</div>
                                    <div className="text-sm text-muted-foreground">{s.role}</div>
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-end mt-8">
                            <button
                                disabled={!selectedSpecialist}
                                onClick={handleNext}
                                className="bg-primary text-white px-8 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                            >
                                Next Step
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-2xl font-serif font-bold text-primary">Choose Date & Time</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">Select Date</label>
                                <input
                                    type="date"
                                    min={minDate}
                                    max={maxDate}
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">Select Time</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {TIME_SLOTS.map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setTime(t)}
                                            className={cn(
                                                "p-2 text-sm rounded-md border transition-colors",
                                                time === t
                                                    ? "bg-primary text-white border-primary"
                                                    : "border-gray-200 hover:border-primary/50"
                                            )}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between mt-8">
                            <button onClick={() => setStep(1)} className="text-muted-foreground hover:text-primary">Back</button>
                            <button
                                disabled={!date || !time}
                                onClick={handleNext}
                                className="bg-primary text-white px-8 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                            >
                                Next Step
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-2xl font-serif font-bold text-primary">Your Details</h3>
                        <div className="space-y-4 max-w-md mx-auto">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Jane Doe"
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+1 (555) 000-0000"
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                />
                            </div>

                            {message && message.type === 'error' && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" />
                                    {message.text}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between mt-8">
                            <button onClick={() => setStep(2)} className="text-muted-foreground hover:text-primary">Back</button>
                            <button
                                disabled={!name || !phone || isSubmitting}
                                onClick={handleSubmit}
                                className="bg-primary text-white px-8 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors flex items-center gap-2"
                            >
                                {isSubmitting ? "Sending Request..." : "Confirm Booking"}
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in duration-300 py-10">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="h-8 w-8" />
                        </div>
                        <h3 className="text-3xl font-serif font-bold text-primary">Request Sent!</h3>
                        <p className="text-muted-foreground max-w-md">
                            Thank you, {name}. Your request for <strong>{date} at {time}</strong> has been sent to our team.
                            You will receive a confirmation once the specialist approves it.
                        </p>
                        <button
                            onClick={() => {
                                setStep(1);
                                setSelectedSpecialist("");
                                setDate("");
                                setTime("");
                                setName("");
                                setPhone("");
                            }}
                            className="mt-8 text-primary hover:underline"
                        >
                            Book Another Appointment
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
