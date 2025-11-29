import { User, Worker, Booking, Review, Category, ChatMessage, Coupon, Notification } from '@/types';

// Categories with enhanced data
export const categories: Category[] = [
  { id: 'cat-1', name: 'Electrician', icon: 'Zap', subtitle: 'Fix electrical issues fast', gradient: 'category-electrician' },
  { id: 'cat-2', name: 'Plumber', icon: 'Droplets', subtitle: 'Pipes & leak repairs', gradient: 'category-plumber' },
  { id: 'cat-3', name: 'Carpenter', icon: 'Hammer', subtitle: 'Wood & furniture work', gradient: 'category-carpenter' },
  { id: 'cat-4', name: 'Cleaner', icon: 'Sparkles', subtitle: 'Deep cleaning services', gradient: 'category-cleaner' },
  { id: 'cat-5', name: 'AC Technician', icon: 'Snowflake', subtitle: 'AC & fridge repair', gradient: 'category-ac' },
  { id: 'cat-6', name: 'Painter', icon: 'Paintbrush', subtitle: 'Wall & home painting', gradient: 'category-painter' },
  { id: 'cat-7', name: 'Appliance Repair', icon: 'Wrench', subtitle: 'Fix home appliances', gradient: 'category-appliance' },
  { id: 'cat-8', name: 'Pest Control', icon: 'Bug', subtitle: 'Remove pests safely', gradient: 'category-pest' },
  { id: 'cat-9', name: 'Beauty Services', icon: 'Scissors', subtitle: 'Salon at home', gradient: 'category-beauty' },
  { id: 'cat-10', name: 'General Repair', icon: 'Settings', subtitle: 'All-purpose fixes', gradient: 'category-repair' },
];

// Demo users
export const users: User[] = [
  {
    id: 'user-1',
    name: 'Aditya Kumar',
    email: 'aditya@example.com',
    password: 'password123',
    phone: '9876543210',
    address: '123, Sector 18, Noida, UP',
    location: { lat: 28.5700, lng: 77.3200 },
    favorites: ['worker-1', 'worker-3'],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'user-2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'password123',
    phone: '9876543211',
    address: '456, Dwarka, Delhi',
    location: { lat: 28.5921, lng: 77.0460 },
    favorites: ['worker-2'],
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 'user-3',
    name: 'Rahul Verma',
    email: 'rahul@example.com',
    password: 'password123',
    phone: '9876543212',
    address: '789, Gurgaon, Haryana',
    location: { lat: 28.4595, lng: 77.0266 },
    favorites: [],
    createdAt: new Date('2024-03-10'),
  },
];

// Demo workers with skills
export const workers: Worker[] = [
  {
    id: 'worker-1',
    name: 'Amit Sharma',
    email: 'amit.electrician@example.com',
    password: 'worker123',
    phone: '9988776655',
    skill: 'Electrician',
    skills: ['Wiring', 'Fan Repair', 'MCB Installation', 'Emergency Services'],
    experience: '5+ years',
    rating: 4.8,
    totalReviews: 156,
    completedJobs: 234,
    minCharge: 199,
    priceRange: { min: 199, max: 2500 },
    area: 'Noida, Greater Noida',
    location: { lat: 28.5355, lng: 77.3910 },
    isApproved: true,
    isActive: true,
    isAvailable: true,
    isVerified: true,
    profilePicture: '',
    portfolio: [],
    availability: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: false },
    createdAt: new Date('2023-06-15'),
  },
  {
    id: 'worker-2',
    name: 'Rohan Verma',
    email: 'rohan.plumber@example.com',
    password: 'worker123',
    phone: '9988776656',
    skill: 'Plumber',
    skills: ['Pipe Fitting', 'Leak Repair', 'Bathroom Fitting', 'Water Tank'],
    experience: '7+ years',
    rating: 4.5,
    totalReviews: 89,
    completedJobs: 178,
    minCharge: 149,
    priceRange: { min: 149, max: 3000 },
    area: 'Delhi, Noida',
    location: { lat: 28.6139, lng: 77.2090 },
    isApproved: true,
    isActive: true,
    isAvailable: true,
    isVerified: true,
    profilePicture: '',
    portfolio: [],
    availability: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: false, sunday: false },
    createdAt: new Date('2023-08-20'),
  },
  {
    id: 'worker-3',
    name: 'Suresh Kumar',
    email: 'suresh.carpenter@example.com',
    password: 'worker123',
    phone: '9988776657',
    skill: 'Carpenter',
    skills: ['Furniture Repair', 'Door Fitting', 'Wood Polish', 'Custom Furniture'],
    experience: '8+ years',
    rating: 4.9,
    totalReviews: 234,
    completedJobs: 312,
    minCharge: 250,
    priceRange: { min: 250, max: 5000 },
    area: 'Gurgaon, Delhi',
    location: { lat: 28.4595, lng: 77.0266 },
    isApproved: true,
    isActive: true,
    isAvailable: false,
    isVerified: true,
    profilePicture: '',
    portfolio: [],
    availability: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: true },
    createdAt: new Date('2023-04-10'),
  },
  {
    id: 'worker-4',
    name: 'Manoj Tiwari',
    email: 'manoj.ac@example.com',
    password: 'worker123',
    phone: '9988776658',
    skill: 'AC Technician',
    skills: ['AC Service', 'Gas Refill', 'Installation', 'Fridge Repair'],
    experience: '6+ years',
    rating: 4.7,
    totalReviews: 198,
    completedJobs: 267,
    minCharge: 350,
    priceRange: { min: 350, max: 4000 },
    area: 'Delhi NCR',
    location: { lat: 28.5921, lng: 77.0460 },
    isApproved: true,
    isActive: true,
    isAvailable: true,
    isVerified: false,
    profilePicture: '',
    portfolio: [],
    availability: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: false },
    createdAt: new Date('2023-09-05'),
  },
  {
    id: 'worker-5',
    name: 'Vijay Pandey',
    email: 'vijay.painter@example.com',
    password: 'worker123',
    phone: '9988776659',
    skill: 'Painter',
    skills: ['Wall Painting', 'Texture', 'Waterproofing', 'Wood Polish'],
    experience: '10+ years',
    rating: 4.9,
    totalReviews: 312,
    completedJobs: 445,
    minCharge: 500,
    priceRange: { min: 500, max: 15000 },
    area: 'Delhi, Gurgaon',
    location: { lat: 28.6280, lng: 77.2175 },
    isApproved: true,
    isActive: true,
    isAvailable: false,
    isVerified: true,
    profilePicture: '',
    portfolio: [],
    availability: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: false, sunday: false },
    createdAt: new Date('2022-12-01'),
  },
  {
    id: 'worker-6',
    name: 'Rahul Singh',
    email: 'rahul.electric@example.com',
    password: 'worker123',
    phone: '9988776660',
    skill: 'Electrician',
    skills: ['Switch Board', 'Lighting', 'Inverter Setup'],
    experience: '3+ years',
    rating: 4.6,
    totalReviews: 67,
    completedJobs: 98,
    minCharge: 150,
    priceRange: { min: 150, max: 2000 },
    area: 'Noida',
    location: { lat: 28.5355, lng: 77.3910 },
    isApproved: true,
    isActive: true,
    isAvailable: true,
    isVerified: false,
    profilePicture: '',
    portfolio: [],
    availability: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: true },
    createdAt: new Date('2024-01-20'),
  },
  {
    id: 'worker-7',
    name: 'Deepak Yadav',
    email: 'deepak.cleaner@example.com',
    password: 'worker123',
    phone: '9988776661',
    skill: 'Cleaner',
    skills: ['Deep Cleaning', 'Sofa Cleaning', 'Bathroom Cleaning', 'Kitchen Cleaning'],
    experience: '4+ years',
    rating: 4.4,
    totalReviews: 145,
    completedJobs: 289,
    minCharge: 299,
    priceRange: { min: 299, max: 3500 },
    area: 'Delhi NCR',
    location: { lat: 28.6139, lng: 77.2090 },
    isApproved: true,
    isActive: true,
    isAvailable: true,
    isVerified: true,
    profilePicture: '',
    portfolio: [],
    availability: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: true },
    createdAt: new Date('2023-11-15'),
  },
  {
    id: 'worker-8',
    name: 'Pending Worker',
    email: 'pending@example.com',
    password: 'worker123',
    phone: '9988776662',
    skill: 'Electrician',
    skills: ['Basic Electrical'],
    experience: '1+ years',
    rating: 0,
    totalReviews: 0,
    completedJobs: 0,
    minCharge: 100,
    priceRange: { min: 100, max: 500 },
    area: 'Delhi',
    location: { lat: 28.6139, lng: 77.2090 },
    isApproved: false,
    isActive: false,
    isAvailable: false,
    isVerified: false,
    profilePicture: '',
    portfolio: [],
    availability: { monday: true, tuesday: true, wednesday: true, thursday: true, friday: true, saturday: true, sunday: true },
    createdAt: new Date('2024-11-01'),
  },
];

// Demo bookings
export const bookings: Booking[] = [
  {
    id: 'booking-1',
    userId: 'user-1',
    workerId: 'worker-1',
    customerName: 'Aditya Kumar',
    workerName: 'Amit Sharma',
    serviceType: 'Electrician',
    description: 'Fan not working, need repair',
    status: 'completed',
    amount: 350,
    address: '123, Sector 18, Noida',
    scheduledDate: new Date('2024-11-20'),
    completedDate: new Date('2024-11-20'),
    createdAt: new Date('2024-11-19'),
    timeline: [
      { status: 'pending', time: new Date('2024-11-19T10:00:00'), note: 'Booking created' },
      { status: 'accepted', time: new Date('2024-11-19T10:15:00'), note: 'Worker accepted' },
      { status: 'ongoing', time: new Date('2024-11-20T09:30:00'), note: 'Work started' },
      { status: 'completed', time: new Date('2024-11-20T11:00:00'), note: 'Work completed' },
    ],
  },
  {
    id: 'booking-2',
    userId: 'user-1',
    workerId: 'worker-2',
    customerName: 'Aditya Kumar',
    workerName: 'Rohan Verma',
    serviceType: 'Plumber',
    description: 'Bathroom tap leaking',
    status: 'ongoing',
    amount: 200,
    address: '123, Sector 18, Noida',
    scheduledDate: new Date('2024-11-28'),
    createdAt: new Date('2024-11-27'),
    timeline: [
      { status: 'pending', time: new Date('2024-11-27T14:00:00'), note: 'Booking created' },
      { status: 'accepted', time: new Date('2024-11-27T14:30:00'), note: 'Worker accepted' },
      { status: 'ongoing', time: new Date('2024-11-28T10:00:00'), note: 'Worker arrived' },
    ],
  },
  {
    id: 'booking-3',
    userId: 'user-2',
    workerId: 'worker-3',
    customerName: 'Priya Sharma',
    workerName: 'Suresh Kumar',
    serviceType: 'Carpenter',
    description: 'Door hinge repair needed',
    status: 'accepted',
    amount: 450,
    address: '456, Dwarka, Delhi',
    scheduledDate: new Date('2024-11-30'),
    createdAt: new Date('2024-11-28'),
    timeline: [
      { status: 'pending', time: new Date('2024-11-28T16:00:00'), note: 'Booking created' },
      { status: 'accepted', time: new Date('2024-11-28T16:45:00'), note: 'Worker accepted' },
    ],
  },
  {
    id: 'booking-4',
    userId: 'user-1',
    workerId: 'worker-4',
    customerName: 'Aditya Kumar',
    workerName: 'Manoj Tiwari',
    serviceType: 'AC Technician',
    description: 'AC service and gas refill',
    status: 'pending',
    amount: 599,
    address: '123, Sector 18, Noida',
    scheduledDate: new Date('2024-12-02'),
    createdAt: new Date('2024-11-29'),
    timeline: [
      { status: 'pending', time: new Date('2024-11-29T09:00:00'), note: 'Booking created' },
    ],
  },
  {
    id: 'booking-5',
    userId: 'user-3',
    workerId: 'worker-1',
    customerName: 'Rahul Verma',
    workerName: 'Amit Sharma',
    serviceType: 'Electrician',
    description: 'MCB tripping issue',
    status: 'completed',
    amount: 500,
    address: '789, Gurgaon',
    scheduledDate: new Date('2024-11-15'),
    completedDate: new Date('2024-11-15'),
    createdAt: new Date('2024-11-14'),
    timeline: [
      { status: 'pending', time: new Date('2024-11-14T11:00:00'), note: 'Booking created' },
      { status: 'accepted', time: new Date('2024-11-14T11:20:00'), note: 'Worker accepted' },
      { status: 'ongoing', time: new Date('2024-11-15T10:00:00'), note: 'Work started' },
      { status: 'completed', time: new Date('2024-11-15T12:30:00'), note: 'Work completed' },
    ],
  },
];

// Demo reviews
export const reviews: Review[] = [
  {
    id: 'review-1',
    bookingId: 'booking-1',
    userId: 'user-1',
    workerId: 'worker-1',
    userName: 'Aditya Kumar',
    rating: 5,
    comment: 'Excellent service! Fixed the fan quickly and professionally.',
    createdAt: new Date('2024-11-20'),
  },
  {
    id: 'review-2',
    bookingId: 'booking-5',
    userId: 'user-3',
    workerId: 'worker-1',
    userName: 'Rahul Verma',
    rating: 4,
    comment: 'Good work, arrived on time. Slightly expensive.',
    createdAt: new Date('2024-11-15'),
  },
  {
    id: 'review-3',
    bookingId: 'booking-3',
    userId: 'user-2',
    workerId: 'worker-3',
    userName: 'Priya Sharma',
    rating: 5,
    comment: 'Best carpenter in the area! Highly recommended.',
    createdAt: new Date('2024-10-25'),
  },
];

// Demo chat messages
export const chatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    bookingId: 'booking-2',
    senderId: 'user-1',
    receiverId: 'worker-2',
    message: 'Hi, are you on the way?',
    timestamp: new Date('2024-11-28T09:45:00'),
    read: true,
  },
  {
    id: 'msg-2',
    bookingId: 'booking-2',
    senderId: 'worker-2',
    receiverId: 'user-1',
    message: 'Yes, reaching in 10 minutes',
    timestamp: new Date('2024-11-28T09:46:00'),
    read: true,
  },
  {
    id: 'msg-3',
    bookingId: 'booking-2',
    senderId: 'user-1',
    receiverId: 'worker-2',
    message: 'Great, see you soon!',
    timestamp: new Date('2024-11-28T09:47:00'),
    read: false,
  },
];

// Demo coupons
export const coupons: Coupon[] = [
  {
    id: 'coupon-1',
    code: 'FIRST50',
    discount: 50,
    discountType: 'percentage',
    maxDiscount: 200,
    minOrder: 299,
    validUntil: new Date('2024-12-31'),
    isActive: true,
  },
  {
    id: 'coupon-2',
    code: 'SAVE100',
    discount: 100,
    discountType: 'flat',
    minOrder: 500,
    validUntil: new Date('2024-12-31'),
    isActive: true,
  },
  {
    id: 'coupon-3',
    code: 'WELCOME20',
    discount: 20,
    discountType: 'percentage',
    maxDiscount: 150,
    minOrder: 199,
    validUntil: new Date('2024-12-15'),
    isActive: true,
  },
];

// Demo notifications
export const notifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    type: 'booking',
    title: 'Booking Confirmed',
    message: 'Your AC service booking has been confirmed for Dec 2',
    read: false,
    createdAt: new Date('2024-11-29T09:00:00'),
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    type: 'promo',
    title: '50% Off on First Booking!',
    message: 'Use code FIRST50 to get 50% off',
    read: true,
    createdAt: new Date('2024-11-28T10:00:00'),
  },
  {
    id: 'notif-3',
    userId: 'worker-1',
    type: 'job',
    title: 'New Job Request',
    message: 'You have a new booking request from Aditya Kumar',
    read: false,
    createdAt: new Date('2024-11-29T09:05:00'),
  },
];

// Admin users
export const admins = [
  {
    id: 'admin-1',
    name: 'Admin',
    email: 'admin@quickfix.com',
    password: 'admin123',
    role: 'super_admin',
  },
];

// Helper functions
export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c * 10) / 10;
}

export function calculateWorkerScore(worker: Worker, userLat: number, userLng: number): number {
  const distance = calculateDistance(userLat, userLng, worker.location.lat, worker.location.lng);
  const availabilityScore = worker.isAvailable ? 1 : 0;
  const distanceScore = Math.max(0, 1 - (distance / 20));
  const ratingScore = worker.rating / 5;
  const priceScore = 1 - (worker.minCharge / 1000);
  
  return (availabilityScore * 0.4) + (distanceScore * 0.3) + (ratingScore * 0.2) + (priceScore * 0.1);
}

export function validateCoupon(code: string, orderAmount: number): { valid: boolean; discount: number; message: string } {
  const coupon = coupons.find(c => c.code === code && c.isActive);
  
  if (!coupon) {
    return { valid: false, discount: 0, message: 'Invalid coupon code' };
  }
  
  if (new Date() > coupon.validUntil) {
    return { valid: false, discount: 0, message: 'Coupon has expired' };
  }
  
  if (orderAmount < coupon.minOrder) {
    return { valid: false, discount: 0, message: `Minimum order amount is ₹${coupon.minOrder}` };
  }
  
  let discount = coupon.discountType === 'percentage' 
    ? (orderAmount * coupon.discount / 100)
    : coupon.discount;
    
  if (coupon.maxDiscount && discount > coupon.maxDiscount) {
    discount = coupon.maxDiscount;
  }
  
  return { valid: true, discount, message: `₹${discount} discount applied!` };
}
