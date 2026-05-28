import type { Metadata } from 'next';
import SummerIntensivePage from '../components/SummerIntensivePage';

export const metadata: Metadata = {
  title: 'Healthcare Leadership & Innovation Summer Intensive 2026 | Oakvale Learning',
  description:
    'A four-week blended-learning programme for penultimate and final-year health sciences students at CMUL, LASUCOM, and EkoUnimed. Applications open 9 June 2026.',
};

export default function Page() {
  return <SummerIntensivePage />;
}
