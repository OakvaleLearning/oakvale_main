'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

type Page = 'home' | 'about' | 'services' | 'corporates' | 'academic' | 'donors' | 'government' | 'contact';

const clientPages: { label: string; page: Page }[] = [
  { label: 'For Corporates', page: 'corporates' },
  { label: 'For Academic Institutions', page: 'academic' },
  { label: 'For Donor Agencies', page: 'donors' },
  { label: 'For Government', page: 'government' },
];

export default function Nav() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const prevPathnameRef = useRef(pathname);

  // Close mobile menu on route change (using ref to avoid setState-in-effect lint error)
  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      const timer = setTimeout(() => {
        setMobileMenuOpen(false);
        setDropdownOpen(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  // Close mobile menu and dropdown on outside tap
  useEffect(() => {
    if (!mobileMenuOpen && !dropdownOpen) return;
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [mobileMenuOpen, dropdownOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const navigate = (page: Page) => {
    router.push(page === 'home' ? '/' : `/${page}`);
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };
  
  const isActive = (page: string) => {
    return page === 'home' ? pathname === '/' : pathname === `/${page}`;
  };
  
  const isClientSectionActive = () => {
    return clientPages.some(p => isActive(p.page));
  };

  return (
    <nav ref={navRef}>
      <a className="nav-logo" onClick={() => navigate('home')} role="button" tabIndex={0}>
        <Image src="/oakvale-white.svg" width={120} height={32} style={{ height: '2rem', width: 'auto' }} alt="Oakvale Learning Logo" priority />
      </a>
      
      {/* Hamburger Menu Button - Mobile Only */}
      <button 
        className="nav-hamburger"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={mobileMenuOpen}
      >
        <span className="hamburger-box">
          <span className={`hamburger-inner ${mobileMenuOpen ? 'active' : ''}`}></span>
        </span>
      </button>
      
      <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
        <li><a className={isActive('about') ? 'active' : ''} onClick={() => navigate('about')} role="button" tabIndex={0}>About</a></li>
        <li><a className={isActive('services') ? 'active' : ''} onClick={() => navigate('services')} role="button" tabIndex={0}>Services</a></li>
        <li className={`nav-dropdown ${dropdownOpen ? 'active' : ''}`}>
          <a 
            className={isClientSectionActive() ? 'active' : ''} 
            role="button" 
            tabIndex={0}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Who We Work With
          </a>
          <div className="dropdown-menu">
            {clientPages.map((item) => (
              <a key={item.page} onClick={() => navigate(item.page)} role="button" tabIndex={0}>{item.label}</a>
            ))}
          </div>
        </li>
        <li><a className={`nav-cta ${isActive('contact') ? 'active' : ''}`} onClick={() => navigate('contact')} role="button" tabIndex={0}>Contact Us</a></li>
      </ul>
    </nav>
  );
}
