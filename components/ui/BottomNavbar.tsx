"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, ClipboardList, User, Search, Heart } from 'lucide-react';

const navItems = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/workers', icon: Search, label: 'Explore' },
  { href: '/favorites', icon: Heart, label: 'Favorites' },
  { href: '/my-bookings', icon: ClipboardList, label: 'Bookings' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export function BottomNavbar() {
  const pathname = usePathname();

  return (
    <nav className="bottom-navbar">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`bottom-navbar-item relative ${isActive ? 'active' : ''}`}
          >
            <item.icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

