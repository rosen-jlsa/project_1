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

### 1. What is the `node_modules` folder?
Think of **`node_modules`** as a **"Toolbox"**.
- To build this application, we use many pre-made tools (libraries) for things like icons, database connections, and web styling.
- When you run `npm install`, these tools are downloaded into the `node_modules` folder.
- You don't need to change anything inside this folder; it just needs to be there for the project to run.

### 2. Why is my backend not connecting?
By default, the app runs in **"Mock Mode"** using local files in the `data/` folder. To connect to a real **Supabase** backend:
1. Create a file named `.env` in the root directory.
2. Copy the content from `.env.example` into your new `.env` file.
3. Fill in your actual Supabase URL and API keys.
4. Restart the development server.
