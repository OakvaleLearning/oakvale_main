'use client';

import { useRouter } from 'next/navigation';
import HomePage from './components/HomePage';

export default function Home() {
  const router = useRouter();
  
  const navigate = (page: string) => {
    if (page === 'home') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  };

  return <HomePage onNavigate={navigate} />;
}
