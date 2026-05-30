import { Metadata } from 'next';
import ApplicationFormPage from '@/app/components/ApplicationFormPage';

export const metadata: Metadata = {
  title: 'Apply — Oakvale Summer Intensive 2026',
  description: 'Apply to the Oakvale Summer Intensive 2026 — a four-week online programme for penultimate and final-year health sciences students.',
};

export default function FormPage() {
  return <ApplicationFormPage />;
}
