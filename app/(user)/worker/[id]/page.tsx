"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, Star, MapPin, Phone, MessageCircle, Heart, Share2,
  CheckCircle, Clock, Calendar, IndianRupee, Briefcase, Award
} from 'lucide-react';
import { useAuthStore, useWorkersStore, useUsersStore } from '@/lib/store';
import { reviews as allReviews } from '@/data/mock-data';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function WorkerProfilePage() {
  const router = useRouter();
  const params = useParams();
  const workerId = params.id as string;
  
  const { session } = useAuthStore();
  const { workers } = useWorkersStore();
  const { users, updateUser } = useUsersStore();
  
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const worker = workers.find(w => w.id === workerId);
  const workerReviews = allReviews.filter(r => r.workerId === workerId);
  const currentUser = users.find(u => u.id === session?.userId);

  useEffect(() => {
    if (!session || session.userType !== 'user') {
      router.push('/login');
      return;
    }

    const timer = setTimeout(() => setLoading(false), 500);
    
    if (currentUser) {
      setIsFavorite(currentUser.favorites.includes(workerId));
    }

    return () => clearTimeout(timer);
  }, [session, router, currentUser, workerId]);

  const toggleFavorite = () => {
    if (!currentUser) return;
    
    const newFavorites = isFavorite
      ? currentUser.favorites.filter(id => id !== workerId)
      : [...currentUser.favorites, workerId];
    
    updateUser(currentUser.id, { favorites: newFavorites });
    setIsFavorite(!isFavorite);
  };

  if (!session) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-[var(--text-secondary)] mb-4">Worker not found</p>
        <button onClick={() => router.back()} className="btn btn-primary">Go Back</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
          <button 
            onClick={() => router.back()}
            className="p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex gap-2">
            <button 
              onClick={toggleFavorite}
              className="p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl transition-colors"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            </button>
            <button className="p-2.5 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl transition-colors">
              <Share2 className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="profile-avatar-large">
          {worker.name[0]}
        </div>
        
        <div className="flex items-center justify-center gap-2 mb-2">
          <h1 className="text-2xl font-bold">{worker.name}</h1>
          {worker.isVerified && (
            <span className="badge badge-verified">
              <CheckCircle className="w-3 h-3" /> Verified
            </span>
          )}
        </div>
        
        <p className="text-white/90 mb-1">{worker.skill}</p>
        <p className="text-white/70 text-sm flex items-center justify-center gap-1">
          <MapPin className="w-4 h-4" /> {worker.area}
        </p>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 -mt-16 relative z-10 pb-32">
        {/* Stats Card */}
        <div className="card p-6 mb-6">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 text-xl font-bold text-[var(--text-primary)]">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                {worker.rating}
              </div>
              <p className="text-xs text-[var(--text-tertiary)]">{worker.totalReviews} reviews</p>
            </div>
            <div>
              <p className="text-xl font-bold text-[var(--text-primary)]">{worker.completedJobs}</p>
              <p className="text-xs text-[var(--text-tertiary)]">Jobs Done</p>
            </div>
            <div>
              <p className="text-xl font-bold text-[var(--text-primary)]">{worker.experience}</p>
              <p className="text-xs text-[var(--text-tertiary)]">Experience</p>
            </div>
            <div>
              <p className="text-xl font-bold text-[var(--primary)]">₹{worker.minCharge}+</p>
              <p className="text-xs text-[var(--text-tertiary)]">Starting</p>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="card p-6 mb-6">
          <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-[var(--primary)]" />
            Skills & Expertise
          </h3>
          <div className="flex flex-wrap gap-2">
            {worker.skills.map((skill) => (
              <span key={skill} className="skill-badge primary">{skill}</span>
            ))}
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="card p-6 mb-6">
          <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-[var(--primary)]" />
            Service Pricing
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-[var(--border-light)]">
              <span className="text-[var(--text-secondary)]">Inspection / Visit Charge</span>
              <span className="font-medium">₹{worker.minCharge}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--border-light)]">
              <span className="text-[var(--text-secondary)]">Basic Service</span>
              <span className="font-medium">₹{worker.priceRange.min} - ₹{Math.round(worker.priceRange.max * 0.3)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[var(--border-light)]">
              <span className="text-[var(--text-secondary)]">Major Repair</span>
              <span className="font-medium">₹{Math.round(worker.priceRange.max * 0.3)} - ₹{worker.priceRange.max}</span>
            </div>
            <p className="text-xs text-[var(--text-tertiary)] mt-2">
              * Final price depends on the nature of work. Parts/materials charged separately.
            </p>
          </div>
        </div>

        {/* Availability */}
        <div className="card p-6 mb-6">
          <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[var(--primary)]" />
            Weekly Availability
          </h3>
          <div className="flex justify-between">
            {dayNames.map((day, index) => {
              const dayKey = day.toLowerCase().slice(0, 3) === 'sun' ? 'sunday' 
                : day.toLowerCase().slice(0, 3) === 'mon' ? 'monday'
                : day.toLowerCase().slice(0, 3) === 'tue' ? 'tuesday'
                : day.toLowerCase().slice(0, 3) === 'wed' ? 'wednesday'
                : day.toLowerCase().slice(0, 3) === 'thu' ? 'thursday'
                : day.toLowerCase().slice(0, 3) === 'fri' ? 'friday'
                : 'saturday';
              const isAvailable = worker.availability[dayKey];
              
              return (
                <div 
                  key={day}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium ${
                    isAvailable 
                      ? 'bg-[var(--primary-50)] text-[var(--primary)]' 
                      : 'bg-[var(--bg-secondary)] text-[var(--text-tertiary)]'
                  }`}
                >
                  {day[0]}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-[var(--text-tertiary)] mt-3 text-center">
            Working hours: 9:00 AM - 7:00 PM
          </p>
        </div>

        {/* Reviews */}
        <div className="card p-6 mb-6">
          <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-[var(--primary)]" />
            Reviews ({workerReviews.length})
          </h3>
          
          {workerReviews.length === 0 ? (
            <p className="text-center text-[var(--text-tertiary)] py-4">No reviews yet</p>
          ) : (
            <div className="space-y-4">
              {workerReviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="flex items-start gap-3">
                    <div className="review-avatar">{review.userName[0]}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-[var(--text-primary)]">{review.userName}</span>
                        <span className="text-xs text-[var(--text-tertiary)]">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="star-rating mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${star <= review.rating ? 'fill-current' : 'empty'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--border-color)] p-4 z-50">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <div className="flex gap-2">
            <a 
              href={`tel:${worker.phone}`}
              className="p-3 bg-[var(--bg-secondary)] rounded-xl hover:bg-[var(--primary-50)] transition-colors"
            >
              <Phone className="w-5 h-5 text-[var(--primary)]" />
            </a>
            <Link 
              href={`/chat/${worker.id}`}
              className="p-3 bg-[var(--bg-secondary)] rounded-xl hover:bg-[var(--primary-50)] transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-[var(--primary)]" />
            </Link>
          </div>
          <Link href={`/booking/${worker.id}`} className="btn btn-primary flex-1">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
