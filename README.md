# Salon Booking App (Project 1)

A professional, high-performance booking management system built for high-end hair salons.

## Project Overview

This application provides a seamless experience for clients to explore salon services, view transformations in a gallery, and book appointments with experts. It features a dual-mode data system (Supabase or Local JSON) for maximum reliability during development and production.

### Key Features
- **Dynamic Booking Wizard**: Intelligent slot selection within business hours (10:00 - 18:00).
- **Interactive Gallery**: "Before & After" photo transformations.
- **Admin Dashboard**: Secure management of bookings and specialists.
- **Automated Workflow**: Email notifications and token-based booking approvals.

## Getting Started

### Prerequisites
- **Node.js**: 18.x or higher
- **Directory**: All commands should be run from within the root project folder.

### Setup & Run
1. **Install dependencies**:
   ```bash
   npm install
   ```
   *Note: This creates the `node_modules` folder. Think of this folder as a "toolbox" or "library" that contains all the external code (packages) the app needs to function, such as React, Next.js, and the Supabase connector. Without this folder, the app cannot run because it wouldn't have its tools.*

2. **Configure environment variables**:
   To connect the app to the backend (Supabase) and other services, you need to set up your environment variables:
   - Copy the `.env.example` file and rename it to `.env`.
   - Open `.env` and fill in your actual credentials (URL and Keys).
   - If these are missing, the app will run in "Mock Mode" using local JSON files in the `data/` folder.

3. **Launch development server**:
   ```bash
   npm run dev
   ```

## Connecting to the Backend (Supabase)

The app is designed to work with Supabase for real-time data and authentication. To fix a "not connected" problem:
1. Ensure you have a Supabase project created.
2. Get your `Project URL` and `Anon Key` from the Supabase Dashboard (Settings > API).
3. Ensure these are correctly entered in your `.env` file as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Restart your development server after making changes to the `.env` file.

## Launch Readiness

To ensure the project is ready for production, follow the Launch Checklist:

### 1. Verification Script
We have included a specialized script that automatically checks linting and build health. Run this before every deployment:
```powershell
./verify-launch.ps1
```

### 2. GitHub Synchronization
Ensure the latest stable version is on GitHub using the "Full Launch Fix" naming convention.

### 3. Environment Variables
Verify that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correctly set in your production environment.

## Technical Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS & Framer Motion
- **Database**: Supabase (with Local Mock fallback)
- **Icons**: Lucide React
- **Maps**: React Leaflet
