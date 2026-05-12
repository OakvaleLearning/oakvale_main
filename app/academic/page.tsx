'use client';

import { useRouter } from 'next/navigation';
import AcademicPage from '../components/AcademicPage';

export default function Academic() {
  const router = useRouter();
  
  const navigate = (page: string) => {
    if (page === 'home') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  };

  return <AcademicPage onNavigate={navigate} />;
}
