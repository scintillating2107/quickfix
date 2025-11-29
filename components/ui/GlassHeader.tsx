"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Wrench, MapPin, Bell, Menu, X, LogOut, Settings, HelpCircle, User } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

interface GlassHeaderProps {
  title?: string;
  showBack?: boolean;
  showNotifications?: boolean;
  showMenu?: boolean;
}

export function GlassHeader({ title, showNotifications = true, showMenu = true }: GlassHeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { session, logout } = useAuthStore();

  return (
    <>
      <header className="glass-header">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-md">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-[var(--primary)]">QuickFix</span>
              </Link>
              
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-secondary)] rounded-lg ml-4">
                <MapPin className="w-4 h-4 text-[var(--primary)]" />
                <span className="text-sm text-[var(--text-secondary)]">Delhi, India</span>
              </div>
            </div>

            {title && (
              <h1 className="absolute left-1/2 -translate-x-1/2 font-semibold text-[var(--text-primary)]">
                {title}
              </h1>
            )}

            <div className="flex items-center gap-2">
              {showNotifications && (
                <Link href="/notifications" className="p-2.5 hover:bg-[var(--bg-secondary)] rounded-xl transition-colors relative">
                  <Bell className="w-5 h-5 text-[var(--text-secondary)]" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[var(--error)] rounded-full animate-pulse" />
                </Link>
              )}
              
              {showMenu && session && (
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="p-2.5 hover:bg-[var(--bg-secondary)] rounded-xl transition-colors"
                >
                  <Menu className="w-5 h-5 text-[var(--text-secondary)]" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Drawer Menu */}
      {drawerOpen && (
        <>
          <div 
            className="drawer-overlay"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="drawer">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center text-white font-bold">
                  {session?.name[0] || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">{session?.name}</p>
                  <p className="text-sm text-[var(--text-tertiary)]">{session?.email}</p>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="space-y-1">
              <Link
                href="/profile"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors"
                onClick={() => setDrawerOpen(false)}
              >
                <User className="w-5 h-5 text-[var(--text-tertiary)]" />
                <span>My Profile</span>
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors"
                onClick={() => setDrawerOpen(false)}
              >
                <Settings className="w-5 h-5 text-[var(--text-tertiary)]" />
                <span>Settings</span>
              </Link>
              <Link
                href="/help"
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors"
                onClick={() => setDrawerOpen(false)}
              >
                <HelpCircle className="w-5 h-5 text-[var(--text-tertiary)]" />
                <span>Help & Support</span>
              </Link>
              <hr className="my-4 border-[var(--border-color)]" />
              <button
                onClick={() => {
                  logout();
                  setDrawerOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-[var(--error)] w-full transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </>
      )}
    </>
  );
}

