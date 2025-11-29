"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Zap, Droplets, Hammer, Sparkles, Snowflake, Paintbrush, Bug, 
  ChevronRight, Star, MapPin, ClipboardList, Users, Bell, Heart,
  Scissors, Settings, CheckCircle
} from 'lucide-react';
import { GlassHeader } from '@/components/ui/GlassHeader';
import { BottomNavbar } from '@/components/ui/BottomNavbar';
import { ShimmerWorkerList } from '@/components/ui/Shimmer';
import { useAuthStore, useWorkersStore, useLocationStore } from '@/lib/store';
import { categories, calculateDistance } from '@/data/mock-data';
import { WorkerWithDistance } from '@/types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap, Droplets, Hammer, Sparkles, Snowflake, Paintbrush, Wrench: Settings, Bug, Scissors, Settings
};

export default function HomePage() {
  const router = useRouter();
  const { session } = useAuthStore();
  const { workers } = useWorkersStore();
  const { userLocation, setUserLocation } = useLocationStore();
  const [loading, setLoading] = useState(true);
  const [nearbyWorkers, setNearbyWorkers] = useState<WorkerWithDistance[]>([]);

  useEffect(() => {
    if (!session || session.userType !== 'user') {
      router.push('/login');
      return;
    }

    const timer = setTimeout(() => setLoading(false), 800);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        () => setUserLocation({ lat: 28.6139, lng: 77.2090 })
      );
    }

    return () => clearTimeout(timer);
  }, [session, router, setUserLocation]);

  useEffect(() => {
    if (userLocation) {
      const workersWithDistance = workers
        .filter(w => w.isApproved && w.isActive && w.isAvailable)
        .map(worker => ({
          ...worker,
          distance: calculateDistance(userLocation.lat, userLocation.lng, worker.location.lat, worker.location.lng),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 4);
      
      setNearbyWorkers(workersWithDistance);
    }
  }, [userLocation, workers]);

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] pb-24">
      <GlassHeader />

      <main className="max-w-7xl mx-auto px-4 pt-[90px] space-y-8">
        {/* Welcome Section */}
        <section className="animate-fadeIn">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            Hello, {session.name.split(' ')[0]} 👋
          </h2>
          <p className="text-[var(--text-secondary)]">What service do you need today?</p>
        </section>

        {/* Categories */}
        <section className="animate-slideUp">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Service Categories</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
            {categories.map((category, index) => {
              const IconComponent = iconMap[category.icon] || Settings;
              return (
                <Link
                  key={category.id}
                  href={`/workers?category=${category.id}`}
                  className={`category-card ${category.gradient} p-4`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="category-icon bg-white/80 w-12 h-12 mb-3">
                    <IconComponent className="w-5 h-5 text-[var(--text-primary)]" />
                  </div>
                  <h4 className="font-semibold text-[var(--text-primary)] text-sm">{category.name}</h4>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{category.subtitle}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Nearby Workers */}
        <section className="animate-slideUp" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Available Nearby</h3>
            <Link href="/workers" className="text-[var(--primary)] font-medium text-sm flex items-center gap-1 hover:underline">
              See all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <ShimmerWorkerList count={4} />
          ) : nearbyWorkers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl">
              <Users className="w-12 h-12 mx-auto mb-3 text-[var(--border-color)]" />
              <p className="text-[var(--text-secondary)]">No workers available nearby</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {nearbyWorkers.map((worker, index) => (
                <Link 
                  key={worker.id} 
                  href={`/worker/${worker.id}`}
                  className="worker-card"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="worker-avatar w-14 h-14 text-lg">
                      {worker.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-[var(--text-primary)] truncate">{worker.name}</h4>
                        {worker.isVerified && (
                          <CheckCircle className="w-4 h-4 text-[var(--primary)]" />
                        )}
                      </div>
                      <p className="text-[var(--primary)] text-sm">{worker.skill}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)] mb-3">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {worker.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-[var(--accent)]" />
                      {worker.distance} km
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--primary)]">₹{worker.minCharge}+</span>
                    <span className="badge badge-available">Available</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="animate-slideUp" style={{ animationDelay: '200ms' }}>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/my-bookings" className="feature-card gradient-primary">
              <div className="relative z-10">
                <h4 className="text-lg font-semibold mb-1">My Bookings</h4>
                <p className="text-sm opacity-90">View your service history</p>
              </div>
              <ClipboardList className="icon" />
            </Link>
            <Link href="/favorites" className="feature-card bg-gradient-to-br from-pink-500 to-rose-600">
              <div className="relative z-10">
                <h4 className="text-lg font-semibold mb-1">Favorites</h4>
                <p className="text-sm opacity-90">Your saved workers</p>
              </div>
              <Heart className="icon" />
            </Link>
            <Link href="/notifications" className="feature-card bg-gradient-to-br from-amber-500 to-orange-500">
              <div className="relative z-10">
                <h4 className="text-lg font-semibold mb-1">Notifications</h4>
                <p className="text-sm opacity-90">Updates & offers</p>
              </div>
              <Bell className="icon" />
            </Link>
          </div>
        </section>
      </main>

      <BottomNavbar />
    </div>
  );
}
