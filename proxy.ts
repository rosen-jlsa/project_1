import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'bg'],

  // Used when no locale matches
  defaultLocale: 'en'
});

export const config = {
  // Match internationalized pathnames
  matcher: ['/', '/(en|bg)/:path*']
};
