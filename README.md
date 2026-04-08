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

## Project Structure & Backend Setup

### What is `node_modules`?
In simple words, the `node_modules` folder is like a **toolbox**. It contains pre-written code (libraries) that the project needs to run. Instead of building everything from scratch, we use these tools to handle things like connecting to the database, styling the app, or managing icons.

### Connecting to the Backend
If you notice the app is not "connected" to the backend, it's usually because the "keys" (environment variables) are missing.
1. Create a file named `.env` in the root directory.
2. Copy the content from `.env.example` into your new `.env` file.
3. Fill in the values with your actual Supabase and Resend API credentials.

The `node_modules` folder itself doesn't "connect" to the backend; it just provides the tools for the code to make that connection happen once you provide the correct keys in the `.env` file.

## Documentation
For a detailed list of recent changes, additions, and fixes, please refer to the **[CHANGELOG.md](./CHANGELOG.md)**.

## Technical Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS & Animate.css
- **Database**: Supabase (with Local Mock fallback)
- **Icons**: Lucide React
- **Maps**: React Leaflet

