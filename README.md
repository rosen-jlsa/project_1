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
Think of `node_modules` as a **Toolbox**.
- Your project needs many different tools (libraries) to work, like buttons, icons, or the connection to the database.
- Instead of writing all these tools from scratch, we "borrow" them from others.
- The `node_modules` folder is where all these borrowed tools are kept.
- **Why is it so big?** Because it contains everything the project needs to run correctly.
- **Important:** You should never manually change anything inside this folder. It is managed by the command `npm install`.

### 2. How do I connect the application to the backend?
The application is currently running in **"Mock Mode"**, meaning it uses local files to store data. To connect it to a real database (Supabase):
1. Create a new file in the root directory named `.env`.
2. Open the `.env.example` file and copy its contents into your new `.env` file.
3. Replace the placeholder values (like `your-project-url`) with your actual keys from Supabase and Resend.
4. Once these variables are set, the app will automatically switch from local files to your live backend.
