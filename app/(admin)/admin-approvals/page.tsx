"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Shield, LogOut, Users, UserCheck, ClipboardList, Clock,
  LayoutDashboard, CheckCircle, XCircle, Star, MapPin, Briefcase
} from 'lucide-react';
import { useAuthStore, useWorkersStore } from '@/lib/store';
import { Worker } from '@/types';

export default function AdminApprovalsPage() {
  const router = useRouter();
  const { session, logout } = useAuthStore();
  const { workers, updateWorker } = useWorkersStore();
  const [loading, setLoading] = useState(true);

  const pendingWorkers = workers.filter(w => !w.isApproved);

  useEffect(() => {
    if (!session || session.userType !== 'admin') {
      router.push('/admin-login');
      return;
    }

    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [session, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleApprove = (workerId: string) => {
    updateWorker(workerId, { isApproved: true, isActive: true });
  };

  const handleReject = (workerId: string) => {
    updateWorker(workerId, { isApproved: false, isActive: false });
  };

  if (!session) return null;

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin-dashboard' },
    { icon: Clock, label: 'Approvals', href: '/admin-approvals', active: true, badge: pendingWorkers.length },
    { icon: Users, label: 'Users', href: '/admin-users' },
    { icon: UserCheck, label: 'Workers', href: '/admin-workers' },
    { icon: ClipboardList, label: 'Bookings', href: '/admin-bookings' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="sidebar">
        <Link href="/" className="flex items-center gap-2.5 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-white">QuickFix Admin</span>
        </Link>

        <nav className="sidebar-menu space-y-1">
          {menuItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href}
              className={`${item.active ? 'active' : ''}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/10 hover:text-white transition-all w-full"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[260px] p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Worker Approvals</h1>
            <p className="text-gray-600">{pendingWorkers.length} pending requests</p>
          </div>
        </div>

        {pendingWorkers.length === 0 ? (
          <div className="empty-state bg-white rounded-2xl">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
            <p className="text-gray-600">No pending worker approvals</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {pendingWorkers.map((worker) => (
              <WorkerApprovalCard 
                key={worker.id}
                worker={worker}
                onApprove={() => handleApprove(worker.id)}
                onReject={() => handleReject(worker.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

interface WorkerApprovalCardProps {
  worker: Worker;
  onApprove: () => void;
  onReject: () => void;
}

function WorkerApprovalCard({ worker, onApprove, onReject }: WorkerApprovalCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-orange-400">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
          {worker.name[0]}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg">{worker.name}</h3>
          <p className="text-indigo-600 font-medium">{worker.skill}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              {worker.experience}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {worker.area}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-xl text-sm">
        <p className="text-gray-600">
          <span className="font-medium">Email:</span> {worker.email}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Phone:</span> {worker.phone}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Min Charge:</span> ₹{worker.minCharge}
        </p>
      </div>

      <div className="flex gap-3 mt-5">
        <button 
          onClick={onReject}
          className="btn btn-secondary flex-1 py-2.5"
        >
          <XCircle className="w-5 h-5" />
          Reject
        </button>
        <button 
          onClick={onApprove}
          className="btn btn-success flex-1 py-2.5"
        >
          <CheckCircle className="w-5 h-5" />
          Approve
        </button>
      </div>
    </div>
  );
}
