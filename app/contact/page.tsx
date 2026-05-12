'use client';

import { useRouter } from 'next/navigation';
import ContactPage from '../components/ContactPage';

export default function Contact() {
  const router = useRouter();
  
  const navigate = (page: string) => {
    if (page === 'home') {
      router.push('/');
    } else {
      router.push(`/${page}`);
    }
  };

  return <ContactPage onNavigate={navigate} />;
}
