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

## Documentation
For a detailed list of recent changes, additions, and fixes, please refer to the **[CHANGELOG.md](./CHANGELOG.md)**.

## Technical Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS & Animate.css
- **Database**: Supabase (with Local Mock fallback)
- **Icons**: Lucide React
- **Maps**: React Leaflet

## Frequently Asked Questions (FAQ)

### What is the `node_modules` folder?
Think of the `node_modules` folder as a **Toolbox**.
- To build this application, we use many pre-made tools (dependencies) created by the developer community.
- When you run `npm install`, all these tools are downloaded and placed into the `node_modules` folder.
- The application needs this folder to run correctly, but you should never edit the files inside it directly.

### Why is the app not "connected" to the back-end?
The project is designed to be flexible. If it doesn't find the "Keys" (credentials) for the real database, it automatically switches to **Mock Mode** using local files in the `data/` folder.

To connect to your own back-end (Supabase):
1. Rename the `.env.example` file to `.env`.
2. Fill in your credentials (`NEXT_PUBLIC_SUPABASE_URL`, etc.).
3. Restart the development server.
