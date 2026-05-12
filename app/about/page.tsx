'use client';

import { useRouter } from 'next/navigation';
import AboutPage from '../components/AboutPage';

export default function About() {
  const router = useRouter();
  
  const navigate = (page: string) => {
    if (page === 'home') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  };

  return <AboutPage onNavigate={navigate} />;
}
