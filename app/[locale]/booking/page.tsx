import { redirect } from 'next/navigation';

export default async function LocaleBookingRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/#book`);
}
