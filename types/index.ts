export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  location: { lat: number; lng: number };
  favorites: string[];
  createdAt: Date;
}

export interface Worker {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  skill: string;
  skills: string[];
  experience: string;
  rating: number;
  totalReviews: number;
  completedJobs: number;
  minCharge: number;
  priceRange: { min: number; max: number };
  area: string;
  location: { lat: number; lng: number };
  isApproved: boolean;
  isActive: boolean;
  isAvailable: boolean;
  isVerified: boolean;
  profilePicture: string;
  portfolio: string[];
  availability: Record<string, boolean>;
  createdAt: Date;
}

export interface WorkerWithDistance extends Worker {
  distance: number;
  score?: number;
}

export interface TimelineEvent {
  status: string;
  time: Date;
  note: string;
}

export interface Booking {
  id: string;
  userId: string;
  workerId: string;
  customerName: string;
  workerName: string;
  serviceType: string;
  description: string;
  status: 'pending' | 'accepted' | 'ongoing' | 'completed' | 'cancelled' | 'rejected';
  amount: number;
  address: string;
  scheduledDate: Date;
  completedDate?: Date;
  createdAt: Date;
  timeline: TimelineEvent[];
}

export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  workerId: string;
  userName: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subtitle: string;
  gradient: string;
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  senderId: string;
  receiverId: string;
  message: string;
  image?: string;
  timestamp: Date;
  read: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  discountType: 'percentage' | 'flat';
  maxDiscount?: number;
  minOrder: number;
  validUntil: Date;
  isActive: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'booking' | 'promo' | 'job' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export interface Session {
  userId: string;
  userType: 'user' | 'worker' | 'admin';
  name: string;
  email: string;
}

export interface FilterOptions {
  category?: string;
  sortBy: 'rating' | 'distance' | 'price';
  priceRange: { min: number; max: number };
  availableOnly: boolean;
}
