"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, ArrowRight, MapPin, Clock, FileText, Send, CheckCircle, 
  Calendar, Star, CreditCard, Smartphone, Wallet, ChevronLeft, ChevronRight,
  Upload, X, Check, Info, Sparkles, Bell, HelpCircle, User, Zap,
  FileUp, Image, Shield, Gift, Home, Wrench, Paintbrush, Wind, Bug,
  Scissors, Settings, Droplets
} from 'lucide-react';
import { useAuthStore, useWorkersStore, useBookingsStore, useUsersStore } from '@/lib/store';
import { formatCurrency, generateId } from '@/lib/utils';

type BookingStep = 'service' | 'date' | 'time' | 'details' | 'payment' | 'review';

// Demo services data
const services = [
  { id: 'electrician', name: 'Electrician', icon: Zap, price: 199, duration: '30 min', description: 'Electrical repairs and installations', popular: true },
  { id: 'plumber', name: 'Plumber', icon: Droplets, price: 249, duration: '45 min', description: 'Pipe repairs, leak fixes, installations', popular: false },
  { id: 'carpenter', name: 'Carpenter', icon: Home, price: 299, duration: '1 hr', description: 'Wood & furniture work', popular: false },
  { id: 'cleaner', name: 'Deep Cleaning', icon: Sparkles, price: 499, duration: '2 hrs', description: 'Full home deep cleaning service', popular: true },
  { id: 'ac-repair', name: 'AC Service', icon: Wind, price: 599, duration: '1 hr', description: 'AC repair, gas refill, cleaning', popular: true },
  { id: 'painter', name: 'Painter', icon: Paintbrush, price: 1499, duration: '4 hrs', description: 'Wall painting, per room pricing', popular: false },
  { id: 'pest-control', name: 'Pest Control', icon: Bug, price: 799, duration: '1.5 hrs', description: 'Complete pest treatment', popular: false },
  { id: 'appliance', name: 'Appliance Repair', icon: Settings, price: 349, duration: '45 min', description: 'Fix home appliances', popular: false },
];

// Generate calendar dates
const generateCalendarDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 35; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      date,
      available: Math.random() > 0.2,
      slots: Math.floor(Math.random() * 8) + 1,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    });
  }
  return dates;
};

// Time slots
const timeSlots = [
  { time: '09:00 AM', period: 'morning', available: true, popular: false },
  { time: '09:30 AM', period: 'morning', available: true, popular: false },
  { time: '10:00 AM', period: 'morning', available: true, popular: true },
  { time: '10:30 AM', period: 'morning', available: false, popular: false },
  { time: '11:00 AM', period: 'morning', available: true, popular: false },
  { time: '11:30 AM', period: 'morning', available: true, popular: false },
  { time: '12:00 PM', period: 'afternoon', available: false, popular: false },
  { time: '02:00 PM', period: 'afternoon', available: true, popular: true },
  { time: '02:30 PM', period: 'afternoon', available: true, popular: false },
  { time: '03:00 PM', period: 'afternoon', available: true, popular: false },
  { time: '03:30 PM', period: 'afternoon', available: false, popular: false },
  { time: '04:00 PM', period: 'afternoon', available: true, popular: false },
  { time: '05:00 PM', period: 'evening', available: true, popular: true },
  { time: '05:30 PM', period: 'evening', available: true, popular: false },
  { time: '06:00 PM', period: 'evening', available: true, popular: false },
  { time: '06:30 PM', period: 'evening', available: false, popular: false },
];

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workerId = searchParams.get('workerId');

  const { session } = useAuthStore();
  const { getWorker } = useWorkersStore();
  const { users } = useUsersStore();
  const { addBooking } = useBookingsStore();

  const [currentStep, setCurrentStep] = useState<BookingStep>('service');
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');
  const [calendarDates] = useState(generateCalendarDates());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'wallet' | 'cash'>('upi');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });

  const worker = workerId ? getWorker(workerId) : null;
  const currentUser = session ? users.find(u => u.id === session.userId) : null;

  const steps: { id: BookingStep; label: string }[] = [
    { id: 'service', label: 'Service' },
    { id: 'date', label: 'Date' },
    { id: 'time', label: 'Time' },
    { id: 'details', label: 'Details' },
    { id: 'payment', label: 'Payment' },
    { id: 'review', label: 'Confirm' },
  ];

  const stepIndex = steps.findIndex(s => s.id === currentStep);

  useEffect(() => {
    if (!session || session.userType !== 'user') {
      router.push('/login');
      return;
    }

    // Pre-fill user details
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
      }));
    }

    // If worker is passed, pre-select service
    if (worker) {
      const matchedService = services.find(s => 
        s.name.toLowerCase().includes(worker.skill.toLowerCase()) ||
        worker.skill.toLowerCase().includes(s.name.toLowerCase())
      );
      if (matchedService) {
        setSelectedService(matchedService);
        setCurrentStep('date');
      }
    }
  }, [session, router, currentUser, worker]);

  const goToStep = (step: BookingStep) => {
    setCurrentStep(step);
  };

  const nextStep = () => {
    const idx = steps.findIndex(s => s.id === currentStep);
    if (idx < steps.length - 1) {
      setCurrentStep(steps[idx + 1].id);
    }
  };

  const prevStep = () => {
    const idx = steps.findIndex(s => s.id === currentStep);
    if (idx > 0) {
      setCurrentStep(steps[idx - 1].id);
    }
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'FIRST50' || couponCode.toUpperCase() === 'WELCOME200') {
      setCouponApplied(true);
    }
  };

  const getDiscount = () => {
    if (!couponApplied || !selectedService) return 0;
    if (couponCode.toUpperCase() === 'FIRST50') {
      return Math.round(selectedService.price * 0.5);
    }
    if (couponCode.toUpperCase() === 'WELCOME200') {
      return 200;
    }
    return 0;
  };

  const getFinalPrice = () => {
    if (!selectedService) return 0;
    return Math.max(0, selectedService.price - getDiscount());
  };

  const handleConfirmBooking = async () => {
    if (!session || !selectedService || !selectedDate || !selectedTime) return;

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const bookingId = `booking-${generateId()}`;
      const newBooking = {
        id: bookingId,
        userId: session.userId,
        workerId: worker?.id || 'worker-1',
        categoryId: selectedService.id,
        serviceType: selectedService.name,
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        address: formData.address,
        description: formData.notes,
        amount: getFinalPrice(),
        scheduledDate: selectedDate,
        timeSlot: selectedTime,
        status: 'pending' as const,
        createdAt: new Date(),
        timeline: [
          { status: 'pending', time: new Date(), note: 'Booking confirmed' }
        ],
      };

      addBooking(newBooking);
      setShowSuccess(true);
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;

  // Success Screen
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center animate-fade-in">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-500 mb-6">
            Your appointment has been successfully booked. You&apos;ll receive a confirmation shortly.
          </p>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Service</span>
                <span className="font-medium text-gray-900">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="font-medium text-gray-900">
                  {selectedDate?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time</span>
                <span className="font-medium text-gray-900">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-bold text-indigo-600">₹{getFinalPrice()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-6 text-sm text-gray-500">
            <Bell className="w-4 h-4" />
            <span>Reminders will be sent via SMS & Email</span>
          </div>

          <div className="space-y-3">
            <button 
              onClick={() => router.push('/my-bookings')}
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
            >
              View My Bookings
            </button>
            <button 
              onClick={() => router.push('/home')}
              className="w-full py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Wrench className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-900">QuickFix</span>
              </Link>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/workers" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">Services</Link>
              <Link href="/my-bookings" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">My Appointments</Link>
              <Link href="#" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">Help</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Page Title */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
              <p className="text-gray-500 mt-1">Complete your booking in a few simple steps</p>
            </div>

            {/* Progress Bar */}
            <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => index <= stepIndex && goToStep(step.id)}
                      disabled={index > stepIndex}
                      className={`flex items-center gap-2 ${index <= stepIndex ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                        index < stepIndex 
                          ? 'bg-indigo-600 text-white' 
                          : index === stepIndex 
                            ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' 
                            : 'bg-gray-100 text-gray-400'
                      }`}>
                        {index < stepIndex ? <Check className="w-4 h-4" /> : index + 1}
                      </div>
                      <span className={`hidden sm:block text-sm font-medium ${
                        index <= stepIndex ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </span>
                    </button>
                    {index < steps.length - 1 && (
                      <div className={`w-8 sm:w-16 h-0.5 mx-2 ${
                        index < stepIndex ? 'bg-indigo-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Step 1: Select Service */}
              {currentStep === 'service' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Select Service</h2>
                  <p className="text-gray-500 text-sm mb-6">Choose the service you need help with</p>
                  
                  {/* Duration Filter */}
                  <div className="flex gap-2 mb-6">
                    {['All', '30 min', '1 hr', '2+ hrs'].map((filter) => (
                      <button
                        key={filter}
                        className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className={`relative p-5 rounded-xl border-2 text-left transition-all hover:shadow-md ${
                          selectedService?.id === service.id
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-100 hover:border-indigo-200'
                        }`}
                      >
                        {service.popular && (
                          <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-amber-400 text-amber-900 text-xs font-semibold rounded-full">
                            Popular
                          </span>
                        )}
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            selectedService?.id === service.id ? 'bg-indigo-600' : 'bg-gray-100'
                          }`}>
                            <service.icon className={`w-6 h-6 ${
                              selectedService?.id === service.id ? 'text-white' : 'text-gray-600'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{service.name}</h3>
                            <p className="text-sm text-gray-500 mt-0.5">{service.description}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-sm font-bold text-indigo-600">₹{service.price}</span>
                              <span className="text-xs text-gray-400">• {service.duration}</span>
                            </div>
                          </div>
                        </div>
                        {selectedService?.id === service.id && (
                          <div className="absolute top-4 right-4">
                            <CheckCircle className="w-5 h-5 text-indigo-600" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Select Date */}
              {currentStep === 'date' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Select Date</h2>
                  <p className="text-gray-500 text-sm mb-6">Choose your preferred appointment date</p>

                  {/* Quick Actions */}
                  <div className="flex gap-2 mb-6">
                    <button 
                      onClick={() => {
                        const nextAvailable = calendarDates.find(d => d.available);
                        if (nextAvailable) setSelectedDate(nextAvailable.date);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                      Next Available
                    </button>
                  </div>

                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-4">
                    <button 
                      onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h3 className="font-semibold text-gray-900">
                      {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <button 
                      onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">
                        {day}
                      </div>
                    ))}
                    {calendarDates.slice(0, 28).map((dateInfo, index) => {
                      const isSelected = selectedDate?.toDateString() === dateInfo.date.toDateString();
                      const isToday = dateInfo.date.toDateString() === new Date().toDateString();
                      
                      return (
                        <button
                          key={index}
                          onClick={() => dateInfo.available && setSelectedDate(dateInfo.date)}
                          disabled={!dateInfo.available}
                          className={`relative p-3 rounded-xl text-center transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : dateInfo.available
                                ? 'hover:bg-indigo-50 text-gray-900'
                                : 'text-gray-300 cursor-not-allowed'
                          } ${dateInfo.isWeekend && !isSelected ? 'bg-gray-50' : ''}`}
                        >
                          <span className={`text-sm font-medium ${isToday && !isSelected ? 'text-indigo-600' : ''}`}>
                            {dateInfo.date.getDate()}
                          </span>
                          {dateInfo.available && (
                            <div className={`w-1.5 h-1.5 rounded-full mx-auto mt-1 ${
                              isSelected ? 'bg-white' : dateInfo.slots > 3 ? 'bg-emerald-400' : 'bg-amber-400'
                            }`} />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Date Info */}
                  {selectedDate && (
                    <div className="p-4 bg-indigo-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                          <p className="text-sm text-indigo-600">
                            {calendarDates.find(d => d.date.toDateString() === selectedDate.toDateString())?.slots} slots available
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Select Time */}
              {currentStep === 'time' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Select Time Slot</h2>
                  <p className="text-gray-500 text-sm mb-6">
                    {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>

                  {/* Time Filter */}
                  <div className="flex gap-2 mb-6">
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'morning', label: 'Morning' },
                      { id: 'afternoon', label: 'Afternoon' },
                      { id: 'evening', label: 'Evening' },
                    ].map((filter) => (
                      <button
                        key={filter.id}
                        onClick={() => setTimeFilter(filter.id as typeof timeFilter)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
                          timeFilter === filter.id
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                            : 'border-gray-200 text-gray-600 hover:border-indigo-300'
                        }`}
                      >
                        {filter.label}
                      </button>
                    ))}
                  </div>

                  {/* Time Slots Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {timeSlots
                      .filter(slot => timeFilter === 'all' || slot.period === timeFilter)
                      .map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => slot.available && setSelectedTime(slot.time)}
                          disabled={!slot.available}
                          className={`relative py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                            selectedTime === slot.time
                              ? 'bg-indigo-600 text-white'
                              : slot.available
                                ? 'border-2 border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                          }`}
                        >
                          {slot.time}
                          {slot.popular && slot.available && selectedTime !== slot.time && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full" />
                          )}
                        </button>
                      ))}
                  </div>

                  {/* Smart Suggestion */}
                  <div className="mt-6 p-4 bg-amber-50 rounded-xl flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-amber-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">Smart Suggestion</p>
                      <p className="text-sm text-amber-700">Most users choose 10:00 AM or 2:00 PM for this service</p>
                    </div>
                  </div>

                  {/* Selected Time Info */}
                  {selectedTime && (
                    <div className="mt-4 p-4 bg-indigo-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            You selected {selectedTime}
                          </p>
                          <p className="text-sm text-indigo-600">
                            Duration: {selectedService?.duration}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Your Details */}
              {currentStep === 'details' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Details</h2>
                  <p className="text-gray-500 text-sm mb-6">Please verify your contact information</p>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                          placeholder="+91 98765 43210"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                          placeholder="you@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Service Address</label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 resize-none"
                        rows={3}
                        placeholder="Enter your complete address with landmarks"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes (Optional)</label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 resize-none"
                        rows={3}
                        placeholder="Describe what you need help with..."
                      />
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Attach Files (Optional)</label>
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-indigo-300 transition-colors cursor-pointer">
                        <FileUp className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Click or drag to upload</p>
                        <p className="text-xs text-gray-400 mt-1">PDF, Images, Docs (Max 10MB)</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Payment */}
              {currentStep === 'payment' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Payment</h2>
                  <p className="text-gray-500 text-sm mb-6">Choose your preferred payment method</p>

                  {/* Payment Methods */}
                  <div className="space-y-3 mb-6">
                    {[
                      { id: 'upi', label: 'UPI', desc: 'Pay via any UPI app', icon: Smartphone },
                      { id: 'card', label: 'Card', desc: 'Debit or Credit Card', icon: CreditCard },
                      { id: 'wallet', label: 'Wallet', desc: 'Paytm, PhonePe, etc.', icon: Wallet },
                      { id: 'cash', label: 'Pay Later', desc: 'Cash on service completion', icon: CreditCard },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as typeof paymentMethod)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                          paymentMethod === method.id
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-100 hover:border-indigo-200'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          paymentMethod === method.id ? 'bg-indigo-600' : 'bg-gray-100'
                        }`}>
                          <method.icon className={`w-6 h-6 ${
                            paymentMethod === method.id ? 'text-white' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-gray-900">{method.label}</p>
                          <p className="text-sm text-gray-500">{method.desc}</p>
                        </div>
                        {paymentMethod === method.id && (
                          <CheckCircle className="w-5 h-5 text-indigo-600" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Coupon Code */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Have a coupon?</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                        placeholder="Enter code e.g. FIRST50"
                        disabled={couponApplied}
                      />
                      <button
                        onClick={applyCoupon}
                        disabled={couponApplied || !couponCode}
                        className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                          couponApplied
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      >
                        {couponApplied ? 'Applied!' : 'Apply'}
                      </button>
                    </div>
                    {couponApplied && (
                      <p className="text-sm text-emerald-600 mt-2 flex items-center gap-1">
                        <Gift className="w-4 h-4" />
                        You saved ₹{getDiscount()}!
                      </p>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Price Breakdown</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Service Fee</span>
                        <span className="text-gray-900">₹{selectedService?.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Platform Fee</span>
                        <span className="text-gray-900">₹0</span>
                      </div>
                      {couponApplied && (
                        <div className="flex justify-between text-emerald-600">
                          <span>Discount</span>
                          <span>-₹{getDiscount()}</span>
                        </div>
                      )}
                      <div className="border-t border-gray-200 pt-2 mt-2">
                        <div className="flex justify-between font-semibold">
                          <span className="text-gray-900">Total</span>
                          <span className="text-indigo-600">₹{getFinalPrice()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Review & Confirm */}
              {currentStep === 'review' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Review & Confirm</h2>
                  <p className="text-gray-500 text-sm mb-6">Please review your booking details</p>

                  <div className="bg-gray-50 rounded-xl p-5 mb-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 pb-4 border-b border-gray-200">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                          {selectedService && <selectedService.icon className="w-6 h-6 text-indigo-600" />}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{selectedService?.name}</p>
                          <p className="text-sm text-gray-500">{selectedService?.duration} session</p>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-400 uppercase mb-1">Date</p>
                          <p className="font-medium text-gray-900">
                            {selectedDate?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase mb-1">Time</p>
                          <p className="font-medium text-gray-900">{selectedTime}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase mb-1">Name</p>
                          <p className="font-medium text-gray-900">{formData.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 uppercase mb-1">Contact</p>
                          <p className="font-medium text-gray-900">{formData.phone}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-400 uppercase mb-1">Address</p>
                        <p className="text-sm text-gray-700">{formData.address}</p>
                      </div>

                      {formData.notes && (
                        <div className="pt-4 border-t border-gray-200">
                          <p className="text-xs text-gray-400 uppercase mb-1">Notes</p>
                          <p className="text-sm text-gray-700">{formData.notes}</p>
                        </div>
                      )}

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-xs text-gray-400 uppercase mb-1">Payment</p>
                            <p className="font-medium text-gray-900 capitalize">{paymentMethod}</p>
                          </div>
                          <p className="text-2xl font-bold text-indigo-600">₹{getFinalPrice()}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reminders Toggle */}
                  <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-xl mb-6">
                    <div className="flex items-center gap-3">
                      <Bell className="w-5 h-5 text-indigo-600" />
                      <div>
                        <p className="font-medium text-gray-900">Send me reminders</p>
                        <p className="text-sm text-gray-500">Get SMS & Email notifications</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  {/* Cancellation Policy */}
                  <div className="p-4 border border-gray-200 rounded-xl mb-6">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Cancellation Policy</p>
                        <p className="text-sm text-gray-500">Free cancellation up to 2 hours before the appointment</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50">
                {currentStep !== 'service' ? (
                  <button
                    onClick={prevStep}
                    className="flex items-center gap-2 px-5 py-2.5 text-gray-600 font-medium hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Go Back
                  </button>
                ) : (
                  <div />
                )}
                
                {currentStep === 'review' ? (
                  <button
                    onClick={handleConfirmBooking}
                    disabled={loading}
                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Confirm Appointment
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={nextStep}
                    disabled={
                      (currentStep === 'service' && !selectedService) ||
                      (currentStep === 'date' && !selectedDate) ||
                      (currentStep === 'time' && !selectedTime) ||
                      (currentStep === 'details' && (!formData.name || !formData.phone || !formData.address))
                    }
                    className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Floating Summary Sidebar (Desktop) */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Your Appointment</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                    {selectedService ? (
                      <>
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <selectedService.icon className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{selectedService.name}</p>
                          <p className="text-sm text-gray-500">{selectedService.duration}</p>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-400 text-sm">Select a service</p>
                    )}
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Date
                      </span>
                      <span className={selectedDate ? 'font-medium text-gray-900' : 'text-gray-400'}>
                        {selectedDate 
                          ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                          : 'Not selected'
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Time
                      </span>
                      <span className={selectedTime ? 'font-medium text-gray-900' : 'text-gray-400'}>
                        {selectedTime || 'Not selected'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="text-gray-900">₹{selectedService?.price || 0}</span>
                    </div>
                    {couponApplied && (
                      <div className="flex justify-between items-center mb-2 text-emerald-600">
                        <span>Discount</span>
                        <span>-₹{getDiscount()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-indigo-600">₹{getFinalPrice()}</span>
                    </div>
                  </div>
                </div>

                {/* Help Section */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <HelpCircle className="w-4 h-4" />
                    <span>Need help? <a href="#" className="text-indigo-600 hover:underline">Contact support</a></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
