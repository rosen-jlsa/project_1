import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'specialists.json');
const BOOKINGS_FILE_PATH = path.join(DATA_DIR, 'bookings.json');

export type Specialist = {
    id: string;
    name: string;
    role: string;
    bio: string;
    image: string;
    phone?: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
};

// Initial data to match existing hardcoded values + new fields
// Initial data to match existing hardcoded values + new fields
const INITIAL_DATA: Specialist[] = [
    {
        id: "1",
        name: "Miglena Todorova",
        role: "Pro Hair Specialist",
        bio: "The main specialist and expert in all hair treatments, cuts, and coloring.",
        image: "/specialist-1.jpg",
        phone: "+359 89 786 5829",
        instagram: "miglena_hair",
        facebook: "Megi75f"
    },
    {
        id: "2",
        name: "Monika",
        role: "Beautician",
        bio: "Expert beautician providing top-tier facial and body treatments.",
        image: "/specialist-2.jpg",
        phone: "+359 88 123 4567",
        instagram: "monika_beauty"
    },
    {
        id: "3",
        name: "Galina Petrova",
        role: "Manicurist",
        bio: "Professional manicurist offering classic and gel nail services.",
        image: "/specialist-3.jpg",
        phone: "+359 88 987 6543"
    }
];

export type Booking = {
    id: string;
    serviceId: string;
    specialistId?: string;
    date: string;
    time: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
};

// ... existing specialist data ...

function ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(FILE_PATH)) {
        fs.writeFileSync(FILE_PATH, JSON.stringify(INITIAL_DATA, null, 2));
    }
    if (!fs.existsSync(BOOKINGS_FILE_PATH)) {
        fs.writeFileSync(BOOKINGS_FILE_PATH, JSON.stringify([], null, 2));
    }
}

export function getLocalBookings(): Booking[] {
    ensureDataDir();
    try {
        const data = fs.readFileSync(BOOKINGS_FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

export function saveLocalBooking(booking: Booking): Booking {
    ensureDataDir();
    const bookings = getLocalBookings();
    bookings.push(booking);
    fs.writeFileSync(BOOKINGS_FILE_PATH, JSON.stringify(bookings, null, 2));
    return booking;
}

export function updateLocalBookingStatus(id: string, status: Booking['status']): void {
    ensureDataDir();
    const bookings = getLocalBookings();
    const index = bookings.findIndex(b => b.id === id);
    if (index >= 0) {
        bookings[index].status = status;
        fs.writeFileSync(BOOKINGS_FILE_PATH, JSON.stringify(bookings, null, 2));
    }
}

export function getLocalSpecialists(): Specialist[] {
    ensureDataDir();
    try {
        const data = fs.readFileSync(FILE_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading specialists data:", error);
        return [];
    }
}

export function saveLocalSpecialist(specialist: Specialist): Specialist {
    ensureDataDir();
    const specialists = getLocalSpecialists();
    const index = specialists.findIndex(s => s.id === specialist.id);

    if (index >= 0) {
        specialists[index] = specialist;
    } else {
        specialists.push(specialist);
    }

    fs.writeFileSync(FILE_PATH, JSON.stringify(specialists, null, 2));
    return specialist;
}

export function deleteLocalSpecialist(id: string): void {
    ensureDataDir();
    const specialists = getLocalSpecialists();
    const filtered = specialists.filter(s => s.id !== id);
    fs.writeFileSync(FILE_PATH, JSON.stringify(filtered, null, 2));
}
