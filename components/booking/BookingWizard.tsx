"use client";

import { useState, useEffect, Suspense } from "react";
import { createBooking, getServices, getBookedSlots, getSpecialists } from "@/app/actions";
import { Clock, User, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Specialist } from "@/lib/data";
import Image from "next/image";
import { useTranslations } from "next-intl";

// Types
type Service = {
    id: string;
    name: string;
    category: string;
    price: string | number;
    duration: string | number;
    specialistIds?: string[];
    brand?: string;
    icon?: string;
};

const TIME_SLOTS = [
    "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30"
];

export function BookingWizard() {
    return (
        <Suspense fallback={<div className="text-center p-8">Loading booking...</div>}>
            <BookingWizardContent />
        </Suspense>
    );
}

function BookingWizardContent() {
    const searchParams = useSearchParams();
    const specialistId = searchParams.get("specialist");
    const t = useTranslations("BookingWizard");
    const tc = useTranslations("Services.categories");
    const ts = useTranslations("ServiceNames");

    const [step, setStep] = useState(1);
    const [services, setServices] = useState<Service[]>([]);
    const [specialist, setSpecialist] = useState<Specialist | null>(null);
    const [loading, setLoading] = useState(true);

    // Form State
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [date, setDate] = useState<string>("");
    const [time, setTime] = useState<string>("");
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);

    // Personal Details
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    // Submission State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        Promise.all([getServices(), getSpecialists()]).then(([servicesData, specialistsData]) => {
            setServices(servicesData || []);
            if (specialistId && specialistsData) {
                const found = specialistsData.find((s: Specialist) => s.id === specialistId);
                setSpecialist(found || null);
            }
            setLoading(false);
        });
    }, [specialistId]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = e.target.value;
        if (!newDate) {
            setDate("");
            setBookedSlots([]);
            return;
        }

        const day = new Date(newDate).getDay();
        if (day === 0) {
            setMessage({ text: t("closedSunday"), type: 'error' });
            setDate("");
            setBookedSlots([]);
        } else {
            setMessage(null);
            setDate(newDate);
        }
    };

    useEffect(() => {
        if (date) {
            // Fetch booked slots for the specific specialist if selected
            getBookedSlots(date, specialistId || undefined).then((slots) => {
                setBookedSlots(slots || []);
            });
        }
    }, [date, specialistId]);

    const handleNext = () => {
        if (step === 1 && selectedService && date && time) setStep(2);
        if (step === 2 && validateForm()) setStep(3);
    };

    const validateForm = () => {
        if (!firstName.trim()) {
            setMessage({ text: "Please enter your first name.", type: 'error' });
            return false;
        }
        if (!lastName.trim()) {
            setMessage({ text: "Please enter your last name.", type: 'error' });
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Phone must start with +359 or 0
        const phoneRegex = /^(?:\+359|0)[\d\s-]{8,}$/;

        if (!emailRegex.test(email)) {
            setMessage({ text: "Please enter a valid email address.", type: 'error' });
            return false;
        }
        if (!phoneRegex.test(phone)) {
            setMessage({ text: "Phone number must start with +359 or 0.", type: 'error' });
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return; // Re-validate before submission

        setIsSubmitting(true);
        setMessage(null); // Clear previous messages

        const formData = new FormData();
        if (selectedService) formData.append("serviceId", selectedService.id);
        if (specialistId) formData.append("specialistId", specialistId);
        formData.append("date", date);
        formData.append("time", time);
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", email);
        formData.append("phone", phone);

        try {
            const result = await createBooking(null, formData);

            if (result.success) {
                setMessage({ text: result.message, type: 'success' });
                setStep(4);
            } else {
                setMessage({ text: result.message || "An unknown error occurred.", type: 'error' });
            }
        } catch (error) {
            console.error("Submission error:", error);
            setMessage({ text: "A server error occurred. Please try again later.", type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Get tomorrow's date as min date
    const minDate = new Date().toISOString().split('T')[0];

    // Get date exactly 1 month from now as max date
    const maxDateObj = new Date();
    maxDateObj.setMonth(maxDateObj.getMonth() + 1);
    const maxDate = maxDateObj.toISOString().split('T')[0];

    // Dynamic categories based on available services
    const getCategories = () => {
        if (specialistId) {
            // Get categories only available for this specialist
            const specServices = services.filter(s => s.specialistIds?.includes(specialistId));
            return Array.from(new Set(specServices.map(s => s.category)));
        }
        return ["Women", "Men", "Children", "Piercing", "Women Therapies"];
    }
    const categories = getCategories();

    const filteredServices = services.filter(s => {
        // Filter by category if selected
        if (selectedCategory && s.category !== selectedCategory) return false;

        // Filter by specialist if selected
        if (specialistId && s.specialistIds && !s.specialistIds.includes(specialistId)) return false;

        return true;
    });

    if (loading) return <div className="text-black font-medium animate-pulse">Loading services...</div>;

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            {/* Progress Bar */}
            <div className="bg-[#F5F5F5] p-4 flex justify-between items-center text-sm font-medium text-gray-500">
                <div className={cn("flex items-center gap-2", step >= 1 && "text-[#333333] font-bold")}>
                    <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs border border-gray-300">1</span>
                    {t("steps.service")}
                </div>
                <div className="h-[1px] w-8 bg-gray-300" />
                <div className={cn("flex items-center gap-2", step >= 2 && "text-[#333333] font-bold")}>
                    <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs border border-gray-300">2</span>
                    {t("steps.details")}
                </div>
                <div className="h-[1px] w-8 bg-gray-300" />
                <div className={cn("flex items-center gap-2", step >= 3 && "text-[#333333] font-bold")}>
                    <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs border border-gray-300">3</span>
                    {t("steps.review")}
                </div>
                <div className="h-[1px] w-8 bg-gray-300" />
                <div className={cn("flex items-center gap-2", step >= 4 && "text-[#333333] font-bold")}>
                    <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs border border-gray-300">4</span>
                    {t("steps.done")}
                </div>
            </div>

            <div className="p-8 min-h-[400px] flex flex-col">
                {step === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        {/* Category & Service Selection */}
                        <div>
                            <h3 className="text-2xl font-serif font-bold text-[#333333] mb-6">
                                {specialist ? (
                                    <div className="flex items-center gap-3">
                                        {specialist.image && <Image src={specialist.image} alt={specialist.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover" />}
                                        <span className="text-[#333333]">{t("bookingWith", { name: specialist.name })}</span>
                                    </div>
                                ) : (
                                    selectedCategory ? <span className="text-[#333333]">{t("selectService", { category: tc(selectedCategory) })}</span> : <span className="text-[#333333]">{t("selectCategory")}</span>
                                )}
                            </h3>

                            {!selectedCategory ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => setSelectedCategory(cat)}
                                            className="p-8 rounded-xl border border-gray-200 bg-[#F5F5F5]/50 hover:border-primary hover:shadow-primary/20 hover:bg-primary/5 transition-all text-left group shadow-sm"
                                        >
                                            <h4 className="text-xl font-bold text-[#333333] group-hover:translate-x-1 group-hover:text-primary transition-transform">{tc(cat)}</h4>
                                            <p className="text-muted-foreground text-sm mt-2">{t("viewServices")}</p>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <button
                                        type="button"
                                        onClick={() => { setSelectedCategory(null); setSelectedService(null); }}
                                        className="text-sm text-gray-500 hover:text-primary flex items-center gap-2 mb-6 font-medium transition-colors bg-[#F5F5F5] hover:bg-primary/10 px-4 py-2 rounded-full w-max"
                                    >
                                        {t("backToCategories")}
                                    </button>
                                    <div className="grid grid-cols-1 gap-3">
                                        {filteredServices.map((s) => (
                                            <button
                                                key={s.id}
                                                type="button"
                                                onClick={() => setSelectedService(s)}
                                                className={cn(
                                                    "p-5 rounded-xl border text-left transition-all hover:shadow-md flex justify-between items-center bg-[#FFFFFF]",
                                                    selectedService?.id === s.id
                                                        ? "border-primary ring-1 ring-primary bg-primary/5"
                                                        : "border-gray-200 hover:border-primary/50 hover:bg-primary/5"
                                                )}
                                            >
                                                <div>
                                                    <div className={cn("font-bold text-lg flex items-center gap-2", selectedService?.id === s.id ? "text-primary" : "text-[#333333]")}>
                                                        {ts(`s${s.id}`)}
                                                        {s.brand && (
                                                            <span className={cn("text-[10px] uppercase font-bold tracking-wider text-white px-2 py-0.5 rounded-sm ml-2", selectedService?.id === s.id ? "bg-primary" : "bg-[#333333]")}>
                                                                {s.brand}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-500 font-medium flex items-center gap-4 mt-2">
                                                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {s.duration} {t("min")}</span>
                                                    </div>
                                                </div>
                                                <div className="text-xl font-bold text-[#333333]">
                                                    €{s.price}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Date & Time Selection (Appears after Service is selected) */}
                        {selectedService && (
                            <div className="pt-8 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-8">
                                <h3 className="text-2xl font-serif font-bold text-[#333333] mb-6">{t("chooseDateTime")}</h3>

                                {message && message.type === 'error' && !firstName && (
                                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4" />
                                        {message.text}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-[#F5F5F5]/30 p-6 rounded-xl border border-gray-100">
                                        <label className="block text-sm font-bold text-[#333333] mb-2">
                                            {t("selectDate")} <span className="text-xs text-gray-500 font-normal">{t("max1Month")}</span>
                                        </label>
                                        <input
                                            type="date"
                                            min={minDate}
                                            max={maxDate}
                                            value={date}
                                            onChange={handleDateChange}
                                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div className="bg-[#F5F5F5]/30 p-6 rounded-xl border border-gray-100">
                                        <label className="block text-sm font-bold text-[#333333] mb-1">{t("selectTime")}</label>
                                        <p className="text-xs text-gray-600 font-medium mb-4 tracking-tight">{t("openingHours")}</p>
                                        {!time ? (
                                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[300px] overflow-y-auto p-1">
                                                {TIME_SLOTS.map((t) => {
                                                    const isBooked = bookedSlots.includes(t);
                                                    const isSelected = time === t;
                                                    return (
                                                        <button
                                                            key={t}
                                                            type="button"
                                                            disabled={!date || isBooked}
                                                            onClick={() => setTime(t)}
                                                            className={cn(
                                                                "py-2 px-1 rounded-lg text-sm font-medium transition-all border relative",
                                                                isSelected
                                                                    ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                                                                    : "bg-white text-gray-700 border-gray-200 hover:border-primary/50 hover:bg-primary/5",
                                                                isBooked && "bg-gray-50 text-gray-300 cursor-not-allowed line-through opacity-50 blur-[0.5px]",
                                                                !date && "opacity-50 cursor-not-allowed"
                                                            )}
                                                        >
                                                            {t}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="p-6 border rounded-xl bg-white border-primary/20 text-center animate-in fade-in zoom-in duration-300 shadow-sm ring-1 ring-primary/20">
                                                <p className="text-gray-500 font-bold text-sm mb-2">{t("selectedTime")}</p>
                                                <div className="text-3xl font-bold text-primary mb-4 font-serif">{time}</div>
                                                <button
                                                    onClick={() => setTime("")}
                                                    className="text-sm text-primary hover:opacity-70 font-medium underline underline-offset-4"
                                                >
                                                    {t("changeTime")}
                                                </button>
                                            </div>
                                        )}
                                        {bookedSlots.length > 0 && (
                                            <p className="text-xs text-red-500 mt-4 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {t("slotsBooked")}
                                            </p>
                                        )}
                                        {!date && (
                                            <p className="text-xs text-muted-foreground mt-4">
                                                {t("selectDateFirst")}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 mt-8 flex justify-end -mx-8 -mb-8 rounded-b-2xl">
                            <button
                                disabled={!selectedService || !date || !time}
                                onClick={handleNext}
                                className="bg-primary text-primary-foreground px-8 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-90 transition-colors shadow-md font-bold"
                            >
                                {t("continueToDetails")}
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-2xl font-serif font-bold text-[#333333]">{t("yourDetails")}</h3>

                        <div className="space-y-4 max-w-md mx-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">{t("firstName")}</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder="Jane"
                                            className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">{t("lastName")}</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="Doe"
                                            className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">{t("email")}</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="jane@example.com"
                                        className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">{t("phone")}</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                    </div>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+359... or 0..."
                                        className="w-full pl-10 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {message && message.type === 'error' && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" />
                                    {message.text}
                                </div>
                            )}
                        </div>

                        <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 mt-8 flex justify-between items-center -mx-8 -mb-8 rounded-b-2xl">
                            <button onClick={() => setStep(1)} className="text-muted-foreground hover:text-primary px-4 py-2">{t("back")}</button>
                            <button
                                onClick={handleNext}
                                className="bg-primary text-primary-foreground px-8 py-3 rounded-full hover:brightness-90 transition-colors flex items-center gap-2 shadow-md font-bold"
                            >
                                {t("reviewBooking")}
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-2xl font-serif font-bold text-[#333333]">{t("reviewConfirm")}</h3>

                        <div className="bg-[#F5F5F5] p-6 rounded-xl border border-gray-200 space-y-4">
                            <h4 className="font-bold text-[#333333] text-lg border-b border-gray-300 pb-2">{t("appointmentDetails")}</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500 block">{t("service")}</span>
                                    <span className="font-medium text-lg text-[#333333]">{selectedService ? ts(`s${selectedService.id}`) : ""}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">{t("dateTime")}</span>
                                    <span className="font-medium text-lg text-[#333333]">{date} at {time}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">{t("duration")}</span>
                                    <span className="font-medium text-[#333333]">{selectedService?.duration} {t("min")}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">{t("price")}</span>
                                    <span className="font-medium text-lg text-[#333333]">€{selectedService?.price}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-4">
                            <h4 className="font-bold text-[#333333] text-lg border-b border-gray-100 pb-2">{t("yourInformation")}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground block">{t("name")}</span>
                                    <span className="font-medium">{firstName} {lastName}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">{t("email")}</span>
                                    <span className="font-medium">{email}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block">{t("phone")}</span>
                                    <span className="font-medium text-[#333333]">{phone}</span>
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 mt-8 flex justify-between items-center -mx-8 -mb-8 rounded-b-2xl">
                            <button onClick={() => setStep(2)} className="text-gray-500 hover:text-primary px-4 py-2">{t("back")}</button>
                            <button
                                disabled={isSubmitting}
                                onClick={handleSubmit}
                                className="bg-primary text-primary-foreground px-8 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-90 transition-colors flex items-center gap-2 shadow-md font-bold"
                            >
                                {isSubmitting ? t("confirming") : t("confirmBooking")}
                            </button>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in duration-300 py-10">
                        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="h-8 w-8" />
                        </div>
                        <h3 className="text-3xl font-serif font-bold text-[#333333]">{t("requestSent")}</h3>
                        <p className="text-gray-600 max-w-md">
                            {t("thankYou", { firstName })} <strong className="text-primary">{selectedService ? ts(`s${selectedService.id}`) : ""}</strong> {t("on")} <strong className="text-primary">{date} at {time}</strong> {t("hasBeenReceived")}
                            <br /><br />
                            <span className="font-bold text-[#333333]">{t("statusWaiting")}</span>
                            <br />
                            {t("contactShortly")}
                        </p>
                        <button
                            onClick={() => {
                                setStep(1);
                                setSelectedCategory(null);
                                setSelectedService(null);
                                setDate("");
                                setTime("");
                                setFirstName("");
                                setLastName("");
                                setEmail("");
                                setPhone("");
                                setBookedSlots([]);
                            }}
                            className="mt-8 text-primary font-bold hover:underline"
                        >
                            {t("bookAnother")}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
