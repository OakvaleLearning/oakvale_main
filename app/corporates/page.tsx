'use client';

import { useRouter } from 'next/navigation';
import CorporatesPage from '../components/CorporatesPage';

export default function Corporates() {
  const router = useRouter();
  
  const navigate = (page: string) => {
    if (page === 'home') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  };

  return <CorporatesPage onNavigate={navigate} />;
}
