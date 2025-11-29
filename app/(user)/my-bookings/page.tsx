"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, ClipboardList, Clock, CheckCircle, XCircle, 
  MapPin, Phone, Star, IndianRupee
} from 'lucide-react';
import { useAuthStore, useBookingsStore, useWorkersStore } from '@/lib/store';

export default function MyBookingsPage() {
  const router = useRouter();
  const { session } = useAuthStore();
  const { bookings } = useBookingsStore();
  const { workers } = useWorkersStore();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const userBookings = bookings.filter(b => b.userId === session?.userId);
  const activeBookings = userBookings.filter(b => 
    ['pending', 'accepted', 'ongoing'].includes(b.status)
  );
  const completedBookings = userBookings.filter(b => 
    ['completed', 'cancelled', 'rejected'].includes(b.status)
  );

  useEffect(() => {
    if (!session || session.userType !== 'user') {
      router.push('/login');
      return;
    }

    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [session, router]);

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="font-semibold text-gray-900">My Bookings</h1>
              <p className="text-sm text-gray-500">{userBookings.length} total bookings</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('active')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'active'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 shadow-sm'
            }`}
          >
            Active ({activeBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'completed'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 shadow-sm'
            }`}
          >
            Completed ({completedBookings.length})
          </button>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 h-40 animate-pulse" />
            ))}
          </div>
        ) : (activeTab === 'active' ? activeBookings : completedBookings).length === 0 ? (
          <div className="empty-state bg-white rounded-2xl">
            <ClipboardList className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {activeTab === 'active' ? 'No active bookings' : 'No completed bookings'}
            </h3>
            <p className="text-gray-600 mb-4">
              {activeTab === 'active' 
                ? 'Book a service to get started' 
                : 'Your completed bookings will appear here'}
            </p>
            {activeTab === 'active' && (
              <Link href="/home" className="btn btn-primary">
                Book a Service
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {(activeTab === 'active' ? activeBookings : completedBookings).map((booking, index) => {
              const worker = workers.find(w => w.id === booking.workerId);
              return (
                <div 
                  key={booking.id}
                  className="bg-white rounded-2xl p-5 shadow-sm animate-slideUp"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{booking.serviceType}</h3>
                      <p className="text-sm text-gray-600">{worker?.name || 'Worker'}</p>
                    </div>
                    <span className={`status-badge ${booking.status}`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(booking.scheduledDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <IndianRupee className="w-4 h-4" />
                      ₹{booking.amount}
                    </span>
                  </div>

                  {booking.description && (
                    <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg mb-4">
                      {booking.description}
                    </p>
                  )}

                  {worker && activeTab === 'active' && (
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
                          {worker.name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{worker.name}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {worker.rating}
                          </p>
                        </div>
                      </div>
                      <a 
                        href={`tel:${worker.phone}`}
                        className="btn btn-primary py-2 px-4"
                      >
                        <Phone className="w-4 h-4" />
                        Call
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
