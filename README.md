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
- When you build a house, you don't make your own hammers, saws, or drills from scratch; you buy them from a store.
- In programming, `node_modules` contains all the "ready-made tools" (called libraries or dependencies) that other people wrote so we don't have to reinvent everything (like how to connect to a database or create a calendar).
- You don't need to touch this folder! It is automatically managed by the command `npm install`.

### How do I connect to the backend?
The "connection" to the backend (Supabase) is handled through **Environment Variables**.
- If the backend is not connected, the app will automatically use **Mock Mode** (local files in the `data/` folder).
- To connect to the live backend, you need to create a file named `.env` and add your keys there (see `.env.example` for the list of required keys).
