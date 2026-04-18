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

## Frequently Asked Questions

### What is the `node_modules` folder?
Think of the `node_modules` folder as a **Toolbox**.
When you build a house, you don't make your own hammers, saws, or drills from scratch—you buy them from a store. In programming, these "tools" are called "dependencies" or "packages."
- When you run `npm install`, the computer goes to the "store" (npm) and downloads all the tools your project needs to work.
- All those tools are stored in the `node_modules` folder.
- You don't need to change anything inside this folder; the project just uses the tools inside it to run.

### Why does it say "Backend not connected"?
The application is designed to be smart. It has two modes:
1. **Live Mode**: Connects to a real database (Supabase).
2. **Mock Mode**: Works entirely on your computer using the files in the `data/` folder.

If you haven't set up your Supabase account keys yet, the app automatically switches to **Mock Mode**. This allows you to test everything without needing an internet connection to a database.

To connect it to a real backend, you need to add your keys to a `.env` file (see `.env.example`).
