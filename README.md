# Luxe Salon Booking Platform

A modern booking platform for a beauty salon, built with Next.js 16, TypeScript, and Tailwind CSS.

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (v4)
- **Database & Auth**: Supabase
- **Email**: Resend
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed.

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Configuration

Create a `.env.local` file in the root directory. You must configure the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Admin Authentication
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_password

# Email Service (Resend)
RESEND_API_KEY=re_123456789
```

> **Note**: If Supabase variables are missing, the application will run in "Mock Mode" with limited functionality.

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production

```bash
npm run build
npm run start
```

## Project Structure

- `/app`: App Router pages and API routes.
- `/components`: Reusable UI components.
- `/lib`: Utilities, database clients, and helper functions.
- `/public`: Static assets.

## Deployment

Ready to deploy on [Vercel](https://vercel.com) or any Next.js compatible hosting. Ensure all environment variables are set in the deployment dashboard.
