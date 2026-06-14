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

## Frequently Asked Questions (FAQ)

### 1. What is the `node_modules` folder?
Think of `node_modules` as a **toolbox**. When we build a house (the app), we don't make our own hammers, saws, or screwdrivers from scratch. Instead, we use a toolbox filled with ready-made tools. In programming, these tools are called "packages." When you run `npm install`, you are downloading all the tools the app needs to work.

### 2. Why is `node_modules` not in the GitHub repository?
The toolbox is very heavy (it contains thousands of files). Since we have a list of all the tools needed in `package.json`, we don't need to carry the heavy toolbox around. Anyone who gets the project can simply run `npm install` to get their own copy of the tools. This keeps the project light and easy to share.

### 3. How does the app connect to the backend?
The app connects to the backend (Supabase) using special keys called **Environment Variables**. These are stored in a file named `.env`. If these keys are missing, the app will automatically switch to **Mock Mode**, using local data stored in the `data/` folder instead of a live database. This allows the app to work even without an internet connection to the database.
