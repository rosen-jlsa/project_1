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
   *Note: This creates the `node_modules` folder, which acts as a "toolbox" containing all the external libraries the app needs to function and connect to the backend.*
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

## Technical Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS & Framer Motion
- **Database**: Supabase (with Local Mock fallback)
- **Icons**: Lucide React
- **Maps**: React Leaflet

## Frequently Asked Questions

### What is the `node_modules` folder?
Think of the `node_modules` folder as a **Toolbox**.
When you build a house, you don't make your own hammers, saws, or drills from scratch; you buy them from a store and put them in your toolbox.
In programming, `node_modules` contains all the "tools" (libraries and code) that other people wrote, which our app needs to work (like the "hammer" for connecting to the database or the "drill" for showing icons).

**Note:** You usually don't see this folder on GitHub because it's very heavy. You "build" your toolbox locally by running `npm install`.

### Why is the app not connecting to the backend?
If your app is running in "Mock Mode" (using local files instead of your database), it means the connection "bridge" isn't set up yet. To fix this:

1. Create a file named `.env` in the root folder.
2. Copy the contents from `.env.example` into your new `.env` file.
3. Replace the placeholder values with your actual **Supabase** credentials.
4. Restart your development server (`npm run dev`).
