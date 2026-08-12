import { Metadata } from 'next';
import ApplicationFormPage from '@/app/components/ApplicationFormPage';
import { getApplicationsOpen } from '@/lib/settings';

export const metadata: Metadata = {
  title: 'Apply — Oakvale Summer Intensive 2026',
  description: 'Apply to the Oakvale Summer Intensive 2026 — a four-week online programme for penultimate and final-year health sciences students.',
};

export const dynamic = 'force-dynamic';

export default async function ApplyPage() {
  const open = await getApplicationsOpen();
  return <ApplicationFormPage closed={!open} />;
}
