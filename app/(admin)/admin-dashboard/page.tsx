"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Shield, LogOut, Users, UserCheck, ClipboardList, IndianRupee,
  Clock, Settings, ChevronRight, LayoutDashboard, TrendingUp
} from 'lucide-react';
import { useAuthStore, useUsersStore, useWorkersStore, useBookingsStore } from '@/lib/store';
import { categories } from '@/data/mock-data';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { session, logout } = useAuthStore();
  const { users } = useUsersStore();
  const { workers } = useWorkersStore();
  const { bookings } = useBookingsStore();

  const totalUsers = users.length;
  const totalWorkers = workers.filter(w => w.isApproved && w.isActive).length;
  const pendingApprovals = workers.filter(w => !w.isApproved).length;
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const totalRevenue = completedBookings.reduce((sum, b) => sum + b.amount, 0);

  // Category distribution
  const categoryStats = categories.slice(0, 6).map(cat => ({
    name: cat.name,
    count: workers.filter(w => w.skill.toLowerCase().includes(cat.name.toLowerCase())).length,
  }));

  // Booking status distribution
  const bookingStats = {
    pending: bookings.filter(b => b.status === 'pending').length,
    ongoing: bookings.filter(b => b.status === 'ongoing' || b.status === 'accepted').length,
    completed: completedBookings.length,
    cancelled: bookings.filter(b => b.status === 'cancelled' || b.status === 'rejected').length,
  };

  useEffect(() => {
    if (!session || session.userType !== 'admin') {
      router.push('/admin-login');
    }
  }, [session, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!session) return null;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin-dashboard', active: true },
    { icon: Clock, label: 'Approvals', href: '/admin-approvals', badge: pendingApprovals },
    { icon: Users, label: 'Users', href: '/admin-users' },
    { icon: UserCheck, label: 'Workers', href: '/admin-workers' },
    { icon: ClipboardList, label: 'Bookings', href: '/admin-bookings' },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--bg-secondary)]">
      {/* Sidebar */}
      <aside className="sidebar">
        <Link href="/" className="flex items-center gap-2.5 mb-8">
          <div className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">QuickFix Admin</span>
        </Link>

        <nav className="sidebar-menu space-y-1">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className={item.active ? 'active' : ''}>
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="ml-auto bg-[var(--error)] text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/10 hover:text-white w-full">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[280px] p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard</h1>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-purple rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-medium text-[var(--text-primary)]">{session.name}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="stat-card">
            <div className="stat-icon blue mb-3"><Users className="w-5 h-5" /></div>
            <p className="text-3xl font-bold text-[var(--text-primary)]">{totalUsers}</p>
            <p className="text-sm text-[var(--text-tertiary)]">Total Users</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange mb-3"><UserCheck className="w-5 h-5" /></div>
            <p className="text-3xl font-bold text-[var(--text-primary)]">{totalWorkers}</p>
            <p className="text-sm text-[var(--text-tertiary)]">Active Workers</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon green mb-3"><ClipboardList className="w-5 h-5" /></div>
            <p className="text-3xl font-bold text-[var(--text-primary)]">{totalBookings}</p>
            <p className="text-sm text-[var(--text-tertiary)]">Total Bookings</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple mb-3"><IndianRupee className="w-5 h-5" /></div>
            <p className="text-3xl font-bold text-[var(--text-primary)]">₹{totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-[var(--text-tertiary)]">Total Revenue</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Worker Categories Chart */}
          <div className="card p-6">
            <h3 className="font-semibold text-[var(--text-primary)] mb-6">Workers by Category</h3>
            <div className="space-y-4">
              {categoryStats.map((cat, index) => {
                const maxCount = Math.max(...categoryStats.map(c => c.count), 1);
                const percentage = (cat.count / maxCount) * 100;
                const colors = ['var(--primary)', 'var(--success)', 'var(--warning)', '#8B5CF6', '#EC4899', '#06B6D4'];
                
                return (
                  <div key={cat.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-[var(--text-secondary)]">{cat.name}</span>
                      <span className="font-medium">{cat.count}</span>
                    </div>
                    <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%`, background: colors[index % colors.length] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Booking Status Chart */}
          <div className="card p-6">
            <h3 className="font-semibold text-[var(--text-primary)] mb-6">Booking Status</h3>
            <div className="flex items-center justify-center gap-8">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="60" fill="none" stroke="var(--bg-secondary)" strokeWidth="20" />
                  <circle 
                    cx="80" cy="80" r="60" fill="none" 
                    stroke="var(--success)" strokeWidth="20"
                    strokeDasharray={`${(bookingStats.completed / totalBookings) * 377} 377`}
                  />
                  <circle 
                    cx="80" cy="80" r="60" fill="none" 
                    stroke="var(--primary)" strokeWidth="20"
                    strokeDasharray={`${(bookingStats.ongoing / totalBookings) * 377} 377`}
                    strokeDashoffset={`-${(bookingStats.completed / totalBookings) * 377}`}
                  />
                  <circle 
                    cx="80" cy="80" r="60" fill="none" 
                    stroke="var(--warning)" strokeWidth="20"
                    strokeDasharray={`${(bookingStats.pending / totalBookings) * 377} 377`}
                    strokeDashoffset={`-${((bookingStats.completed + bookingStats.ongoing) / totalBookings) * 377}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold">{totalBookings}</span>
                  <span className="text-xs text-[var(--text-tertiary)]">Total</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[var(--success)]" />
                  <span className="text-sm">Completed ({bookingStats.completed})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[var(--primary)]" />
                  <span className="text-sm">Active ({bookingStats.ongoing})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[var(--warning)]" />
                  <span className="text-sm">Pending ({bookingStats.pending})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[var(--error)]" />
                  <span className="text-sm">Cancelled ({bookingStats.cancelled})</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <Link href="/admin-approvals" className="feature-card gradient-warning">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold mb-1">Pending Approvals</h3>
              <p className="text-sm opacity-90">{pendingApprovals} workers waiting</p>
            </div>
            <Clock className="icon" />
          </Link>
          <Link href="/admin-workers" className="feature-card gradient-purple">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold mb-1">Manage Workers</h3>
              <p className="text-sm opacity-90">View all professionals</p>
            </div>
            <Settings className="icon" />
          </Link>
        </div>

        {/* Recent Bookings */}
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[var(--border-light)]">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Recent Bookings</h2>
            <Link href="/admin-bookings" className="text-[var(--primary)] font-medium text-sm flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Worker</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.slice(0, 5).map((booking) => {
                  const worker = workers.find(w => w.id === booking.workerId);
                  return (
                    <tr key={booking.id}>
                      <td className="font-medium text-[var(--text-primary)]">{booking.customerName}</td>
                      <td className="text-[var(--text-secondary)]">{booking.serviceType}</td>
                      <td className="text-[var(--text-secondary)]">{worker?.name || 'N/A'}</td>
                      <td className="font-semibold text-[var(--text-primary)]">₹{booking.amount}</td>
                      <td><span className={`badge badge-${booking.status}`}>{booking.status}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
