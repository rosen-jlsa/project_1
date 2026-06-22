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
   *Note: This creates the `node_modules` folder. See the section below for a simple explanation.*
3. Configure environment variables (copy `.env.example` to a new file named `.env` and fill in the values).
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

## 💡 Simple Explanation: What is `node_modules`?

Think of your project like a **hair salon**:
- The **code I wrote** is like the stylists and the salon layout.
- The **`node_modules` folder** is the **toolbox**. It contains all the scissors, dyes, and mirrors (libraries) that we didn't make ourselves but need to do the job.
- One of the tools in that toolbox is the **"Bridge"** (the Supabase client). This is what allows the salon (the app) to talk to the warehouse (the database/backend).

**If you see "Mock Mode" or connection errors:**
It usually means the "Bridge" is there, but it doesn't have the **address** (the keys in your `.env` file) to find the warehouse!

## Technical Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS & Framer Motion
- **Database**: Supabase (with Local Mock fallback)
- **Icons**: Lucide React
- **Maps**: React Leaflet

