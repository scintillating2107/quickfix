"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { 
  Wrench, Shield, ArrowRight, Zap, Droplets, Hammer, 
  Sparkles, Snowflake, Paintbrush, Bug, Star, MapPin, Users, 
  UserCheck, Clock, Search, ChevronRight, CheckCircle, Scissors, 
  Settings, Play, Quote, BadgeCheck, Headphones, CreditCard,
  Percent, Gift, ChevronDown, Phone, MessageCircle, TrendingUp,
  Award, Timer, Flame, Heart, ThumbsUp, Smartphone
} from 'lucide-react';
import { useWorkersStore, useLocationStore } from '@/lib/store';
import { categories, calculateDistance } from '@/data/mock-data';
import { WorkerWithDistance } from '@/types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Zap, Droplets, Hammer, Sparkles, Snowflake, Paintbrush, Wrench, Bug, Scissors, Settings
};

// Most booked services with detailed info
const mostBookedServices = [
  { name: 'Fan Repair', desc: 'Ceiling/Exhaust fan fix', rating: 4.81, reviews: '93K', price: 109, originalPrice: 199, icon: 'Zap', gradient: 'from-amber-400 to-orange-500', tag: 'Popular' },
  { name: 'Tap & Leak Repair', desc: 'All pipe leakages', rating: 4.81, reviews: '119K', price: 49, originalPrice: 99, icon: 'Droplets', gradient: 'from-blue-400 to-cyan-500', tag: 'Best Value' },
  { name: 'AC Service', desc: 'Foam-jet deep clean', rating: 4.77, reviews: '1.8M', price: 599, originalPrice: 999, icon: 'Snowflake', gradient: 'from-cyan-400 to-teal-500', tag: 'Trending' },
  { name: 'Deep Cleaning', desc: 'Bathroom/Kitchen', rating: 4.79, reviews: '3.7M', price: 519, originalPrice: 799, icon: 'Sparkles', gradient: 'from-green-400 to-emerald-500', tag: 'Top Rated' },
  { name: 'Door Hinge Fix', desc: 'All door repairs', rating: 4.80, reviews: '50K', price: 129, originalPrice: 249, icon: 'Hammer', gradient: 'from-orange-400 to-red-500', tag: null },
  { name: 'Wall Painting', desc: 'Per room pricing', rating: 4.85, reviews: '99K', price: 1499, originalPrice: 2499, icon: 'Paintbrush', gradient: 'from-purple-400 to-pink-500', tag: 'Premium' },
];

// Live activity feed
const liveActivities = [
  { user: 'Rahul S.', action: 'booked AC Service', location: 'Noida', time: '2 min ago' },
  { user: 'Priya M.', action: 'rated 5 stars', location: 'Delhi', time: '5 min ago' },
  { user: 'Amit K.', action: 'booked Electrician', location: 'Gurgaon', time: '8 min ago' },
  { user: 'Sneha R.', action: 'booked Plumber', location: 'Delhi', time: '12 min ago' },
];

// Trust badges
const trustBadges = [
  { icon: BadgeCheck, label: 'Verified Pros', value: '500+' },
  { icon: Users, label: 'Happy Customers', value: '50K+' },
  { icon: Star, label: 'Avg Rating', value: '4.8★' },
  { icon: Headphones, label: 'Support', value: '24/7' },
];

// Testimonials
const testimonials = [
  { name: 'Priya Sharma', location: 'Delhi', rating: 5, text: 'Amazing service! The electrician was professional and fixed my issue in no time. Will definitely use again!', avatar: 'P', service: 'Electrician' },
  { name: 'Rahul Verma', location: 'Noida', rating: 5, text: 'Best platform for home services. Very easy to book and workers are highly skilled. Impressed!', avatar: 'R', service: 'Plumber' },
  { name: 'Anita Singh', location: 'Gurgaon', rating: 5, text: 'Quick response and excellent work quality. The AC technician was punctual and thorough.', avatar: 'A', service: 'AC Service' },
];

// FAQ items
const faqs = [
  { q: 'How do I book a service?', a: 'Simply select a service category, choose a professional based on ratings and reviews, pick a time slot, and confirm your booking. It takes less than 2 minutes!' },
  { q: 'Are the professionals verified?', a: 'Yes! All our professionals undergo thorough background checks, skill assessments, and training before joining our platform.' },
  { q: 'What if I am not satisfied?', a: 'We offer a 100% satisfaction guarantee. If you are not happy with the service, we will send another professional or refund your money.' },
  { q: 'How do I pay?', a: 'We accept all payment methods - UPI, cards, net banking, and cash. You can pay after the service is completed.' },
];

// Animated counter hook
function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return { count, ref };
}

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { workers } = useWorkersStore();
  const { userLocation } = useLocationStore();
  const [topWorkers, setTopWorkers] = useState<WorkerWithDistance[]>([]);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activityIndex, setActivityIndex] = useState(0);

  // Animated counters
  const bookingsCounter = useCounter(50000, 2500);
  const workersCounter = useCounter(500, 2000);
  const citiesCounter = useCounter(25, 1500);

  useEffect(() => {
    setMounted(true);
    
    // Rotate testimonials
    const testimonialInterval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    // Rotate live activities
    const activityInterval = setInterval(() => {
      setActivityIndex((prev) => (prev + 1) % liveActivities.length);
    }, 3000);

    return () => {
      clearInterval(testimonialInterval);
      clearInterval(activityInterval);
    };
  }, []);

  useEffect(() => {
    if (userLocation && workers.length > 0) {
      const workersWithDistance = workers
        .filter(w => w.isApproved && w.isActive)
        .map(worker => ({
          ...worker,
          distance: calculateDistance(userLocation.lat, userLocation.lng, worker.location.lat, worker.location.lng),
        }))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);
      
      setTopWorkers(workersWithDistance);
    }
  }, [userLocation, workers]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="absolute inset-0 bg-white/90 backdrop-blur-xl border-b border-gray-100/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center justify-between h-[72px]">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-gradient-to-br from-[#4C8CFF] to-[#3B7AE8] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200/50 group-hover:shadow-blue-300/50 transition-shadow">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-[#4C8CFF] to-[#3B7AE8] bg-clip-text text-transparent">
                QuickFix
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="#services" className="text-gray-600 hover:text-[#4C8CFF] font-medium transition-colors">Services</Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-[#4C8CFF] font-medium transition-colors">How it works</Link>
              <Link href="#reviews" className="text-gray-600 hover:text-[#4C8CFF] font-medium transition-colors">Reviews</Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login" className="px-5 py-2.5 text-gray-700 hover:text-[#4C8CFF] font-medium transition-colors">
                Login
              </Link>
              <Link href="/signup" className="px-5 py-2.5 bg-gradient-to-r from-[#4C8CFF] to-[#3B7AE8] text-white font-semibold rounded-xl shadow-lg shadow-blue-200/50 hover:shadow-blue-300/60 hover:scale-[1.02] transition-all">
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Promo Banner */}
      <div className="pt-[72px]">
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white py-2.5 overflow-hidden">
          <div className="flex items-center justify-center gap-3 animate-pulse">
            <Gift className="w-5 h-5" />
            <span className="font-medium">🎉 New User Offer: Get 50% OFF on your first booking! Use code <span className="font-bold">FIRST50</span></span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-purple-50/50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Live Activity Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-full shadow-lg shadow-gray-100 border border-gray-100 mb-6 animate-fadeIn">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{liveActivities[activityIndex].user}</span> {liveActivities[activityIndex].action} in {liveActivities[activityIndex].location}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6 animate-slideUp">
                Expert Home Services,
                <span className="block mt-2 bg-gradient-to-r from-[#4C8CFF] via-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">
                  At Your Doorstep
                </span>
              </h1>

              <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0 animate-slideUp" style={{ animationDelay: '100ms' }}>
                From electricians to plumbers, find verified professionals for all your home needs. 
                <span className="font-semibold text-[#4C8CFF]"> Book in 2 minutes</span>, get service in hours.
              </p>

              {/* Search Box */}
              <div className="relative max-w-md mx-auto lg:mx-0 mb-8 animate-slideUp" style={{ animationDelay: '150ms' }}>
                <div className="flex items-center bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-2">
                  <div className="flex-1 flex items-center gap-3 px-4">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="What service do you need?"
                      className="w-full py-3 outline-none text-gray-700 placeholder-gray-400"
                    />
                  </div>
                  <button className="px-6 py-3 bg-gradient-to-r from-[#4C8CFF] to-[#3B7AE8] text-white font-semibold rounded-xl hover:shadow-lg transition-all">
                    Search
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-xs text-gray-500">Popular:</span>
                  {['AC Service', 'Electrician', 'Plumber', 'Cleaning'].map((tag) => (
                    <Link key={tag} href="/workers" className="text-xs text-[#4C8CFF] hover:underline">{tag}</Link>
                  ))}
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 animate-slideUp" style={{ animationDelay: '200ms' }}>
                {trustBadges.map((badge) => (
                  <div key={badge.label} className="flex items-center gap-2 group cursor-pointer">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <badge.icon className="w-5 h-5 text-[#4C8CFF]" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900">{badge.value}</p>
                      <p className="text-xs text-gray-500">{badge.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Hero Image Collage */}
            <div className="relative hidden lg:block">
              <div className="grid grid-cols-2 gap-3">
                <img 
                  src="https://th.bing.com/th/id/OIP.iz3Wu6pfGy-A1mI6lZQsdAHaE8?w=262&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3" 
                  alt="Professional worker"
                  className="w-full h-40 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform"
                />
                <img 
                  src="https://cdn.thezebra.com/zfront/media/production/images/iStock-1205228815.format-jpeg.jpg" 
                  alt="Home repair service"
                  className="w-full h-40 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform"
                />
                <img 
                  src="https://www.stylemotivation.com/wp-content/uploads/2021/07/AdobeStock_188386439-1600x1067.jpeg" 
                  alt="Professional handyman"
                  className="w-full h-40 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform"
                />
                <img 
                  src="https://hometriangle.com/blogs/content/images/2024/05/hometriangle-blog-metal-electrical-repairs.jpg" 
                  alt="Electrical repairs"
                  className="w-full h-40 object-cover rounded-2xl shadow-lg hover:scale-105 transition-transform"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔥 Most Booked Services */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-semibold text-orange-500 uppercase tracking-wide">Most Booked</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Popular Services</h2>
            </div>
            <Link href="/workers" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {mostBookedServices.map((service, index) => {
              const IconComponent = iconMap[service.icon] || Wrench;
              return (
                <Link 
                  key={index} 
                  href="/workers"
                  className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-[#4C8CFF]/30 transition-all duration-300"
                >
                  {/* Tag */}
                  {service.tag && (
                    <div className={`absolute top-3 left-3 z-10 px-2 py-1 rounded-lg text-xs font-bold text-white ${
                      service.tag === 'Popular' ? 'bg-orange-500' :
                      service.tag === 'Trending' ? 'bg-pink-500' :
                      service.tag === 'Best Value' ? 'bg-green-500' :
                      service.tag === 'Top Rated' ? 'bg-blue-500' :
                      service.tag === 'Premium' ? 'bg-purple-500' : 'bg-gray-500'
                    }`}>
                      {service.tag}
                    </div>
                  )}
                  
                  {/* Icon Header */}
                  <div className={`h-28 bg-gradient-to-br ${service.gradient} flex items-center justify-center relative overflow-hidden`}>
                    <IconComponent className="w-12 h-12 text-white group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-[#4C8CFF] transition-colors">{service.name}</h4>
                    <p className="text-xs text-gray-500 mb-3">{service.desc}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-900">{service.rating}</span>
                      <span className="text-xs text-gray-400">({service.reviews})</span>
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">₹{service.price}</span>
                      <span className="text-sm text-gray-400 line-through">₹{service.originalPrice}</span>
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                        {Math.round((1 - service.price / service.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-16 bg-gradient-to-r from-[#4C8CFF] to-[#6366f1] text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div ref={bookingsCounter.ref} className="group cursor-pointer">
              <div className="text-4xl md:text-5xl font-extrabold mb-2 group-hover:scale-110 transition-transform">
                {bookingsCounter.count.toLocaleString()}+
              </div>
              <p className="text-white/80">Bookings Completed</p>
            </div>
            <div ref={workersCounter.ref} className="group cursor-pointer">
              <div className="text-4xl md:text-5xl font-extrabold mb-2 group-hover:scale-110 transition-transform">
                {workersCounter.count}+
              </div>
              <p className="text-white/80">Verified Professionals</p>
            </div>
            <div ref={citiesCounter.ref} className="group cursor-pointer">
              <div className="text-4xl md:text-5xl font-extrabold mb-2 group-hover:scale-110 transition-transform">
                {citiesCounter.count}+
              </div>
              <p className="text-white/80">Cities Served</p>
            </div>
            <div className="group cursor-pointer">
              <div className="text-4xl md:text-5xl font-extrabold mb-2 group-hover:scale-110 transition-transform">
                4.8<Star className="w-8 h-8 inline fill-yellow-400 text-yellow-400 ml-1" />
              </div>
              <p className="text-white/80">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* All Services Section */}
      <section id="services" className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              Our Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              What can we help you with?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              From quick fixes to major repairs, our verified professionals handle it all.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {categories.map((category, index) => {
              const IconComponent = iconMap[category.icon] || Wrench;
              // Unique gradient colors for each category
              const colorStyles = [
                { gradient: 'from-blue-500 to-cyan-400', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', hoverBg: 'group-hover:bg-blue-100' },
                { gradient: 'from-amber-500 to-orange-400', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', hoverBg: 'group-hover:bg-amber-100' },
                { gradient: 'from-emerald-500 to-teal-400', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', hoverBg: 'group-hover:bg-emerald-100' },
                { gradient: 'from-violet-500 to-purple-400', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-600', hoverBg: 'group-hover:bg-violet-100' },
                { gradient: 'from-rose-500 to-pink-400', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-600', hoverBg: 'group-hover:bg-rose-100' },
                { gradient: 'from-indigo-500 to-blue-400', bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600', hoverBg: 'group-hover:bg-indigo-100' },
                { gradient: 'from-cyan-500 to-sky-400', bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-600', hoverBg: 'group-hover:bg-cyan-100' },
                { gradient: 'from-lime-500 to-green-400', bg: 'bg-lime-50', border: 'border-lime-200', text: 'text-lime-600', hoverBg: 'group-hover:bg-lime-100' },
                { gradient: 'from-fuchsia-500 to-pink-400', bg: 'bg-fuchsia-50', border: 'border-fuchsia-200', text: 'text-fuchsia-600', hoverBg: 'group-hover:bg-fuchsia-100' },
                { gradient: 'from-teal-500 to-emerald-400', bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-600', hoverBg: 'group-hover:bg-teal-100' },
              ];
              const style = colorStyles[index % colorStyles.length];
              
              return (
                <Link
                  key={category.id}
                  href={`/workers?category=${category.id}`}
                  className={`group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 text-center overflow-hidden border ${style.border} hover:border-transparent hover:-translate-y-1`}
                >
                  {/* Colorful gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  {/* Colorful top accent line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${style.gradient}`} />
                  
                  {/* Colored Icon with gradient background */}
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-xl ${style.bg} ${style.hoverBg} flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-sm`}>
                    <IconComponent className={`w-6 h-6 ${style.text}`} />
                  </div>
                  
                  {/* Text */}
                  <h3 className="font-semibold text-gray-900 mb-1 transition-colors">{category.name}</h3>
                  <p className="text-xs text-gray-400">{category.subtitle}</p>
                  
                  {/* Colored arrow indicator on hover */}
                  <div className="mt-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className={`text-xs ${style.text} font-medium flex items-center gap-1`}>
                      Book now <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-100 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-1/4 w-64 h-64 bg-blue-200 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-64 h-64 bg-purple-200 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-[#4C8CFF]/10 text-[#4C8CFF] text-sm font-semibold rounded-full mb-4">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Book in 3 simple steps
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Getting home services has never been easier. Follow these simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              { step: '1', icon: Search, title: 'Choose Service', desc: 'Browse our wide range of home services and select what you need', color: 'bg-blue-50 text-blue-600', borderColor: 'border-blue-200' },
              { step: '2', icon: UserCheck, title: 'Select Professional', desc: 'View profiles, ratings & reviews. Pick the perfect pro for your job', color: 'bg-purple-50 text-purple-600', borderColor: 'border-purple-200' },
              { step: '3', icon: CheckCircle, title: 'Get It Done', desc: 'Schedule at your convenience. Sit back while we handle the rest', color: 'bg-green-50 text-green-600', borderColor: 'border-green-200' },
            ].map((item, index) => (
              <div key={item.step} className="relative group">
                {/* Card */}
                <div className={`bg-white rounded-2xl p-6 h-full border-2 ${item.borderColor} hover:shadow-lg hover:shadow-gray-100 transition-all duration-300`}>
                  {/* Step number & Icon row */}
                  <div className="flex items-center gap-4 mb-5">
                    <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-gray-300 bg-gray-50 px-3 py-1 rounded-full">
                      Step {item.step}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
                
                {/* Connector Arrow */}
                {index < 2 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 w-8 h-8 items-center justify-center z-10">
                    <div className="w-8 h-8 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center shadow-sm">
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Optional: CTA below */}
          <div className="text-center mt-10">
            <Link href="/signup" className="inline-flex items-center gap-2 px-6 py-3 bg-[#4C8CFF] text-white font-semibold rounded-xl hover:bg-[#3B7AE8] transition-colors shadow-lg shadow-blue-200/50">
              Get Started Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Top Workers */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-[#4C8CFF]" />
                <span className="text-sm font-semibold text-[#4C8CFF] uppercase tracking-wide">Top Rated</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Meet our experts</h2>
            </div>
            <Link href="/workers" className="hidden sm:flex items-center gap-2 text-[#4C8CFF] font-semibold hover:underline">
              View all <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topWorkers.map((worker) => (
              <Link 
                key={worker.id} 
                href={`/worker/${worker.id}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-[#4C8CFF]/20 transition-all duration-300"
              >
                <div className="h-24 bg-gradient-to-br from-[#4C8CFF] to-blue-600 relative">
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-2xl font-bold text-[#4C8CFF] border-4 border-white group-hover:scale-110 transition-transform">
                      {worker.name[0]}
                    </div>
                  </div>
                </div>
                
                <div className="pt-12 pb-6 px-5 text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{worker.name}</h3>
                    {worker.isVerified && <BadgeCheck className="w-4 h-4 text-[#4C8CFF]" />}
                  </div>
                  <p className="text-[#4C8CFF] text-sm font-medium mb-3">{worker.skill}</p>
                  
                  <div className="flex items-center justify-center gap-3 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {worker.rating}
                    </span>
                    <span>•</span>
                    <span>{worker.completedJobs} jobs</span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="font-bold text-gray-900">₹{worker.minCharge}+</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      worker.isAvailable 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {worker.isAvailable ? 'Available' : 'Busy'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-white text-[#4C8CFF] text-sm font-semibold rounded-full mb-4 shadow-sm">
              TESTIMONIALS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Loved by thousands
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 relative">
              <Quote className="absolute top-6 left-6 w-12 h-12 text-[#4C8CFF]/10" />
              
              <div className="text-center">
                <div className="flex justify-center gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-7 h-7 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <p className="text-xl text-gray-700 mb-8 leading-relaxed italic">
                  &ldquo;{testimonials[activeTestimonial].text}&rdquo;
                </p>
                
                <div className="flex items-center justify-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#4C8CFF] to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {testimonials[activeTestimonial].avatar}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{testimonials[activeTestimonial].name}</p>
                    <p className="text-sm text-gray-500">{testimonials[activeTestimonial].location} • {testimonials[activeTestimonial].service}</p>
                  </div>
                </div>
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      index === activeTestimonial 
                        ? 'bg-[#4C8CFF] w-8' 
                        : 'bg-gray-300 hover:bg-gray-400 w-2.5'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-[#4C8CFF] text-sm font-semibold rounded-full mb-4">
              FAQ
            </span>
            <h2 className="text-3xl font-bold text-gray-900">Common Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className={`border border-gray-200 rounded-2xl overflow-hidden transition-all ${
                  activeFaq === index ? 'shadow-lg border-[#4C8CFF]/30' : ''
                }`}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${
                    activeFaq === index ? 'rotate-180' : ''
                  }`} />
                </button>
                <div className={`overflow-hidden transition-all ${
                  activeFaq === index ? 'max-h-40 pb-5 px-5' : 'max-h-0'
                }`}>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Download CTA */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Get the QuickFix App
              </h2>
              <p className="text-gray-400 mb-6">Book services on the go. Available on iOS and Android.</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <button className="flex items-center gap-3 px-6 py-3 bg-white rounded-xl hover:bg-gray-100 transition-colors">
                  <Smartphone className="w-6 h-6 text-gray-900" />
                  <div className="text-left">
                    <p className="text-xs text-gray-500">Download on</p>
                    <p className="font-semibold text-gray-900">App Store</p>
                  </div>
                </button>
                <button className="flex items-center gap-3 px-6 py-3 bg-white rounded-xl hover:bg-gray-100 transition-colors">
                  <Play className="w-6 h-6 text-gray-900" />
                  <div className="text-left">
                    <p className="text-xs text-gray-500">Get it on</p>
                    <p className="font-semibold text-gray-900">Google Play</p>
                  </div>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-1">4.8</div>
                <div className="flex gap-0.5 mb-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-xs text-gray-400">50K+ Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#4C8CFF] via-[#6366f1] to-[#8b5cf6] p-10 sm:p-16">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
            </div>
            
            <div className="relative text-center text-white">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to get your home fixed?
              </h2>
              <p className="text-white/80 mb-8 max-w-2xl mx-auto text-lg">
                Join thousands of happy customers. Book your first service today and experience the difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup" className="group px-8 py-4 bg-white text-[#4C8CFF] font-semibold rounded-2xl hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                  Book Now <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/worker-signup" className="px-8 py-4 bg-white/10 text-white font-semibold rounded-2xl border-2 border-white/30 hover:bg-white/20 transition-all">
                  Become a Pro
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#4C8CFF] to-[#3B7AE8] rounded-xl flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">QuickFix</span>
              </Link>
              <p className="text-sm mb-4">Your trusted partner for all home services.</p>
              <div className="flex gap-3">
                {['f', 't', 'in', 'ig'].map((social) => (
                  <a key={social} href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-[#4C8CFF] transition-colors">
                    <span className="text-xs font-bold text-white">{social}</span>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block hover:text-[#4C8CFF]">About Us</a>
                <a href="#" className="block hover:text-[#4C8CFF]">Careers</a>
                <a href="#" className="block hover:text-[#4C8CFF]">Blog</a>
                <a href="#" className="block hover:text-[#4C8CFF]">Press</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Customers</h4>
              <div className="space-y-2 text-sm">
                <Link href="/login" className="block hover:text-[#4C8CFF]">Login</Link>
                <Link href="/signup" className="block hover:text-[#4C8CFF]">Sign Up</Link>
                <a href="#" className="block hover:text-[#4C8CFF]">Help Center</a>
                <a href="#" className="block hover:text-[#4C8CFF]">Safety</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">For Professionals</h4>
              <div className="space-y-2 text-sm">
                <Link href="/worker-signup" className="block hover:text-[#4C8CFF]">Register</Link>
                <Link href="/worker-login" className="block hover:text-[#4C8CFF]">Login</Link>
                <a href="#" className="block hover:text-[#4C8CFF]">Resources</a>
                <a href="#" className="block hover:text-[#4C8CFF]">Support</a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-sm">
            <p>© 2024 QuickFix. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-[#4C8CFF]">Privacy Policy</a>
              <a href="#" className="hover:text-[#4C8CFF]">Terms of Service</a>
              <a href="#" className="hover:text-[#4C8CFF]">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a 
        href="https://wa.me/919876543210" 
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all group"
      >
        <MessageCircle className="w-7 h-7 text-white" />
        <span className="absolute right-full mr-3 px-3 py-2 bg-white rounded-lg shadow-lg text-sm font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Chat with us!
        </span>
      </a>
    </div>
  );
}

