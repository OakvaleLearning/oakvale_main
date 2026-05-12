'use client';

import { useRouter } from 'next/navigation';
import ServicesPage from '../components/ServicesPage';

export default function Services() {
  const router = useRouter();
  
  const navigate = (page: string) => {
    if (page === 'home') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  };

  return <ServicesPage onNavigate={navigate} />;
}
