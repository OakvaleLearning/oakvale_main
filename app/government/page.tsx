'use client';

import { useRouter } from 'next/navigation';
import GovernmentPage from '../components/GovernmentPage';

export default function Government() {
  const router = useRouter();
  
  const navigate = (page: string) => {
    if (page === 'home') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  };

  return <GovernmentPage onNavigate={navigate} />;
}
