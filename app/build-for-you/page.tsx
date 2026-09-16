import type { Metadata } from 'next';
import BuildForYouPage from '../components/BuildForYouPage';

export const metadata: Metadata = {
  title: 'Build For You | E-Learning Development Service | Oakvale Learning',
  description:
    'Oakvale turns existing training content, curricula, scripts and subject matter expertise into professional, interactive e-learning - ready to deploy on any platform, to any workforce.',
};

export default function BuildForYou() {
  return <BuildForYouPage />;
}
