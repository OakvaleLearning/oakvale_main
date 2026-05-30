import { Metadata } from 'next';
import ApplyFaqPage from '@/app/components/ApplyFaqPage';

export const metadata: Metadata = {
  title: 'Before You Apply — Oakvale Summer Intensive 2026',
  description: 'Everything you need to know before applying to the Oakvale Summer Intensive 2026.',
};

export default function ApplyPage() {
  return <ApplyFaqPage />;
}
