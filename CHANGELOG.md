# Changelog

All notable changes to this project will be documented in this file.

## [March 2026 Update] - Feature Expansion & Stability Improvements

### Added
- **Interactive Photo Gallery**: 
  - New gallery page (`/gallery`) showcasing professional hair transformations.
  - Admin dashboard supports image uploads and management.
- **Dynamic Business Hours**: 
  - Booking system now enforces operational hours (10:00 - 18:00).
  - Validation logic added to both client-side UI and server-side actions.
- **Supabase Mock Mode**: 
  - Implemented a robust fallback system. If Supabase is not configured, the app seamlessly uses local JSON data (`data/services.json`, etc.).
- **Booking Approval Workflow**: 
  - Automated administrative email notifications for new bookings.
  - Secure token-based approval links for quick status updates.
- **Service Management Migration**: 
  - Services are now fetched dynamically from a database or local JSON, allowing for easier updates without code changes.

### Fixed
- **Next.js 16 Compatibility**: 
  - Refactored `cookies()` usage to handle asynchronous access.
  - Optimized for React 19 and Next.js 16 (App Router).
- **Environment Handling**: 
  - Added defensive checks for missing API keys to prevent application crashes.
- **Build Errors**: 
  - Fixed "next is not recognized" errors by ensuring correct directory execution and dependency management.

### Removed
- **Redundant Specialists**: 
  - Simplified the Specialists section to focus on the single primary expert, Miglena Todorova.

---
*Last Updated: March 2026*
