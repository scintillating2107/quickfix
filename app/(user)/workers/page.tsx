"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Star, MapPin, Search, CheckCircle,
  Zap, Droplets, Hammer, Sparkles, Snowflake, Paintbrush, Bug, Settings, Scissors
} from 'lucide-react';
import { FilterChips } from '@/components/ui/FilterChips';
import { ShimmerWorkerList } from '@/components/ui/Shimmer';
import { useAuthStore, useWorkersStore, useLocationStore } from '@/lib/store';
import { categories, calculateDistance, calculateWorkerScore } from '@/data/mock-data';
import { WorkerWithDistance } from '@/types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap, Droplets, Hammer, Sparkles, Snowflake, Paintbrush, Wrench: Settings, Bug, Scissors, Settings
};

function WorkersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('category');
  
  const { session } = useAuthStore();
  const { workers } = useWorkersStore();
  const { userLocation } = useLocationStore();
  
  const [filteredWorkers, setFilteredWorkers] = useState<WorkerWithDistance[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryId);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('rating');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [availableOnly, setAvailableOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session || session.userType !== 'user') {
      router.push('/login');
      return;
    }

    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [session, router]);

  useEffect(() => {
    let result = workers.filter(w => w.isApproved && w.isActive);

    // Filter by category
    if (selectedCategory) {
      const category = categories.find(c => c.id === selectedCategory);
      if (category) {
        result = result.filter(w => 
          w.skill.toLowerCase().includes(category.name.toLowerCase()) ||
          w.skills.some(s => s.toLowerCase().includes(category.name.toLowerCase()))
        );
      }
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(w => 
        w.name.toLowerCase().includes(query) ||
        w.skill.toLowerCase().includes(query) ||
        w.area.toLowerCase().includes(query) ||
        w.skills.some(s => s.toLowerCase().includes(query))
      );
    }

    // Filter by availability
    if (availableOnly) {
      result = result.filter(w => w.isAvailable);
    }

    // Filter by price range
    result = result.filter(w => w.minCharge >= priceRange.min && w.minCharge <= priceRange.max);

    // Add distance and score
    const userLat = userLocation?.lat || 28.6139;
    const userLng = userLocation?.lng || 77.2090;
    
    result = result.map(worker => ({
      ...worker,
      distance: calculateDistance(userLat, userLng, worker.location.lat, worker.location.lng),
      score: calculateWorkerScore(worker, userLat, userLng),
    }));

    // Sort
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'distance':
        result.sort((a, b) => a.distance - b.distance);
        break;
      case 'price':
        result.sort((a, b) => a.minCharge - b.minCharge);
        break;
      default:
        result.sort((a, b) => (b.score || 0) - (a.score || 0));
    }

    setFilteredWorkers(result);
  }, [workers, selectedCategory, searchQuery, userLocation, sortBy, priceRange, availableOnly]);

  if (!session) return null;

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      {/* Header */}
      <header className="glass-header">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-[var(--bg-secondary)] rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
            <div className="flex-1">
              <h1 className="font-semibold text-[var(--text-primary)]">
                {selectedCategoryData ? selectedCategoryData.name : 'All Workers'}
              </h1>
              <p className="text-sm text-[var(--text-tertiary)]">
                {filteredWorkers.length} professionals available
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-[90px] pb-8">
        {/* Search */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)]" />
            <input
              type="text"
              placeholder="Search by name, skill, or area..."
              className="form-input pl-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 overflow-x-auto hide-scrollbar pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`filter-chip ${!selectedCategory ? 'active' : ''}`}
            >
              All
            </button>
            {categories.map((category) => {
              const IconComponent = iconMap[category.icon] || Settings;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                  className={`filter-chip ${selectedCategory === category.id ? 'active' : ''}`}
                >
                  <IconComponent className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* Filters */}
          <FilterChips
            onSortChange={setSortBy}
            onPriceChange={setPriceRange}
            onAvailabilityChange={setAvailableOnly}
            currentSort={sortBy}
            availableOnly={availableOnly}
          />
        </div>

        {/* Workers Grid */}
        {loading ? (
          <ShimmerWorkerList count={6} />
        ) : filteredWorkers.length === 0 ? (
          <div className="empty-state bg-white rounded-2xl">
            <Search className="w-16 h-16 mx-auto mb-4 text-[var(--border-color)]" />
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">No workers found</h3>
            <p className="text-[var(--text-secondary)] mb-4">Try adjusting your filters</p>
            <button 
              onClick={() => { setSelectedCategory(null); setSearchQuery(''); setAvailableOnly(false); }}
              className="btn btn-primary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredWorkers.map((worker, index) => (
              <Link 
                key={worker.id} 
                href={`/worker/${worker.id}`}
                className="worker-card animate-slideUp"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="worker-avatar text-xl">
                    {worker.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-[var(--text-primary)] truncate">{worker.name}</h3>
                      {worker.isVerified && (
                        <span className="badge badge-verified text-xs">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                    <p className="text-[var(--primary)] text-sm font-medium">{worker.skill}</p>
                    <p className="text-[var(--text-tertiary)] text-xs">{worker.experience}</p>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {worker.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="skill-badge">{skill}</span>
                  ))}
                  {worker.skills.length > 3 && (
                    <span className="skill-badge">+{worker.skills.length - 3}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-4 py-3 border-t border-b border-[var(--border-light)] mb-3 text-sm">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {worker.rating} ({worker.totalReviews})
                  </span>
                  <span className="flex items-center gap-1 text-[var(--text-tertiary)]">
                    <MapPin className="w-4 h-4 text-[var(--accent)]" />
                    {worker.distance.toFixed(1)} km
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xl font-bold text-[var(--primary)]">
                    ₹{worker.minCharge} <span className="text-sm font-normal text-[var(--text-tertiary)]">onwards</span>
                  </p>
                  <span className={`badge ${worker.isAvailable ? 'badge-available' : 'badge-busy'}`}>
                    {worker.isAvailable ? 'Available' : 'Busy'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function WorkersPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    }>
      <WorkersContent />
    </Suspense>
  );
}
