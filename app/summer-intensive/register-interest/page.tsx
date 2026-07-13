import type { Metadata } from 'next';
import RegisterInterestPage from '../../components/RegisterInterestPage';

export const metadata: Metadata = {
  title: 'Register Your Interest | Healthcare Leadership & Innovation Summer Intensive 2026',
  description:
    'Register your interest in future editions of the Oakvale Healthcare Leadership and Innovation Summer Intensive — as an individual, a school, or a region.',
};

export default function Page() {
  return <RegisterInterestPage />;
}
