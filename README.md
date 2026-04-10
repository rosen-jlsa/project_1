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

## Project Structure & Backend Setup

### What is the `node_modules` folder?
In simple words, `node_modules` is the **toolbox** of your project.
- It contains all the libraries and code (like React, Tailwind, or Supabase) that other developers wrote and your project needs to work.
- You don't write code here. When you run `npm install`, these "tools" are downloaded automatically into this folder.
- It is excluded from the repository (via `.gitignore`) because it's very large, but anyone can recreate it by running `npm install`.

### Connecting to the Backend (Supabase)
The app uses **Supabase** as its backend. If the connection is not "fixed," the app runs in **Mock Mode** using local files in the `data/` folder.

To connect your project to a live backend:
1. Create a file named `.env` in the root directory.
2. Copy the contents of `.env.example` into your new `.env` file.
3. Replace the placeholder values with your actual keys from the Supabase dashboard.

## Technical Stack
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS & Animate.css
- **Database**: Supabase (with Local Mock fallback)
- **Icons**: Lucide React
- **Maps**: React Leaflet

