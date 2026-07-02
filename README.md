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
- **Directory**: All commands should be run from within the `project_1/` folder.

### Setup & Run
1. Navigate to the project folder:
   ```bash
   cd project_1
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables (see `.env.example`).
4. Launch development server:
   ```bash
   npm run dev
   ```

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

## 📦 Understanding node_modules (The Toolbox)

Think of your project like a **construction site** for a new house.
- The **code** you write is the **blueprint** (the instructions).
- The **node_modules** folder is the **toolbox** where all the tools are kept.

Without the toolbox (`node_modules`), you might have the instructions, but you don't have the hammer, the screwdriver, or the **bridge-building tools** needed to connect your house to the city's water and power (the **backend/database**).

When you run `npm install`, you are basically bringing the toolbox to the construction site. It includes libraries like `supabase-js`, which is the specific tool your app uses to talk to the database.

**If you don't have this folder (or it's not connected), your app won't know how to "speak" to the backend, even if you have the right connection details!**

## Technical Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS & Framer Motion
- **Database**: Supabase (with Local Mock fallback)
- **Icons**: Lucide React
- **Maps**: React Leaflet

