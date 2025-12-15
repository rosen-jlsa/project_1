# Salon Booking App

A simple, efficient booking management system for salon services.

## Application Purpose

This application allows clients to view services/specialists and book appointments. It includes an admin interface for managing specialists and approving bookings.

## Getting Started

### Prerequisites

- Node.js 18+

### Setup & Run

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
2. Create `.env.local` (see variable list below).
3. Run locally:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   npm run start
   ```

### Environment Variables

Required variables for the application to function correctly:

| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anonymous Key (Client-side safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key (Server-side only, for Admin actions) |
| `ADMIN_EMAIL` | Email address for the admin user |
| `ADMIN_PASSWORD` | Password for the admin user |
| `RESEND_API_KEY` | API Key for Resend (Email service) |

> **Note**: Do NOT commit `.env.local` to version control.

## Project Structure

- `app/`: Next.js App Router pages and API endpoints.
- `components/`: UI components.
- `lib/`: Shared utilities (Supabase client, email sender).
- `public/`: Static files.
