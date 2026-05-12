'use client';

import { useRouter } from 'next/navigation';
import DonorsPage from '../components/DonorsPage';

export default function Donors() {
  const router = useRouter();
  
  const navigate = (page: string) => {
    if (page === 'home') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  };

  return <DonorsPage onNavigate={navigate} />;
}
