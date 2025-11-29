"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, MapPin, Clock, CheckCircle, Calendar, FileText, CreditCard } from 'lucide-react';
import { PaymentModal } from '@/components/ui/PaymentModal';
import { useAuthStore, useWorkersStore, useBookingsStore, useUsersStore } from '@/lib/store';

const steps = [
  { id: 1, title: 'Problem', icon: FileText },
  { id: 2, title: 'Schedule', icon: Calendar },
  { id: 3, title: 'Address', icon: MapPin },
  { id: 4, title: 'Review', icon: CheckCircle },
];

const timeSlots = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
];

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const workerId = params.id as string;
  
  const { session } = useAuthStore();
  const { getWorkerById } = useWorkersStore();
  const { addBooking } = useBookingsStore();
  const { users } = useUsersStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form data
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [address, setAddress] = useState('');

  const worker = getWorkerById(workerId);
  const currentUser = users.find(u => u.id === session?.userId);

  useEffect(() => {
    if (!session || session.userType !== 'user') {
      router.push('/login');
      return;
    }
    
    if (currentUser) {
      setAddress(currentUser.address);
    }
  }, [session, router, currentUser]);

  const canProceed = () => {
    switch (currentStep) {
      case 1: return description.length >= 10;
      case 2: return selectedDate && selectedTime;
      case 3: return address.length >= 10;
      default: return true;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowPayment(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handlePaymentComplete = () => {
    if (!worker || !session) return;

    const bookingId = `booking-${Date.now()}`;
    const scheduledDate = new Date(`${selectedDate} ${selectedTime}`);

    const newBooking = {
      id: bookingId,
      userId: session.userId,
      workerId: worker.id,
      customerName: session.name,
      workerName: worker.name,
      serviceType: worker.skill,
      description,
      status: 'pending' as const,
      amount: worker.minCharge,
      address,
      scheduledDate,
      createdAt: new Date(),
      timeline: [
        { status: 'pending', time: new Date(), note: 'Booking created' }
      ],
    };

    addBooking(newBooking);
    router.push(`/booking-status/${bookingId}`);
  };

  if (!session || !worker) return null;

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      {/* Header */}
      <header className="glass-header">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <button onClick={handleBack} className="p-2 hover:bg-[var(--bg-secondary)] rounded-xl">
              <ArrowLeft className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
            <div className="flex-1">
              <h1 className="font-semibold text-[var(--text-primary)]">Book {worker.skill}</h1>
              <p className="text-sm text-[var(--text-tertiary)]">{worker.name}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-[90px] pb-32">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isCompleted ? 'gradient-success text-white' :
                      isActive ? 'gradient-primary text-white animate-pulse-ring' :
                      'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)]'
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${
                    isActive || isCompleted ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-2 ${
                      isCompleted ? 'bg-[var(--success)]' : 'bg-[var(--border-color)]'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="card p-6 animate-fadeIn">
          {/* Step 1: Problem Description */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Describe your problem</h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Help us understand what needs to be fixed
              </p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g., My ceiling fan is making a loud noise and not rotating properly..."
                className="form-input min-h-[150px] resize-none"
                rows={5}
              />
              <p className="text-xs text-[var(--text-tertiary)]">
                Minimum 10 characters ({description.length}/10)
              </p>
            </div>
          )}

          {/* Step 2: Schedule */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Select Date</h2>
                <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                  {dates.map((date) => {
                    const dateStr = date.toISOString().split('T')[0];
                    const isSelected = selectedDate === dateStr;
                    
                    return (
                      <button
                        key={dateStr}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`flex flex-col items-center p-3 min-w-[70px] rounded-xl transition-all ${
                          isSelected 
                            ? 'gradient-primary text-white' 
                            : 'bg-[var(--bg-secondary)] hover:bg-[var(--primary-50)]'
                        }`}
                      >
                        <span className="text-xs">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                        <span className="text-xl font-bold">{date.getDate()}</span>
                        <span className="text-xs">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Select Time</h2>
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map((time) => {
                    const isSelected = selectedTime === time;
                    
                    return (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                          isSelected 
                            ? 'gradient-primary text-white' 
                            : 'bg-[var(--bg-secondary)] hover:bg-[var(--primary-50)] text-[var(--text-secondary)]'
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Address */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Service Address</h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Where should the worker come?
              </p>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full address including landmark..."
                className="form-input min-h-[120px] resize-none"
                rows={4}
              />
              <button className="btn btn-secondary w-full">
                <MapPin className="w-4 h-4" />
                Use Current Location
              </button>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Review Booking</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-[var(--bg-secondary)] rounded-xl">
                  <div className="worker-avatar w-14 h-14 text-lg">{worker.name[0]}</div>
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">{worker.name}</p>
                    <p className="text-sm text-[var(--primary)]">{worker.skill}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-[var(--text-tertiary)] mt-0.5" />
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Problem</p>
                      <p className="text-sm text-[var(--text-primary)]">{description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-[var(--text-tertiary)] mt-0.5" />
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Schedule</p>
                      <p className="text-sm text-[var(--text-primary)]">
                        {new Date(selectedDate).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric' 
                        })} at {selectedTime}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-[var(--text-tertiary)] mt-0.5" />
                    <div>
                      <p className="text-xs text-[var(--text-tertiary)]">Address</p>
                      <p className="text-sm text-[var(--text-primary)]">{address}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-[var(--border-color)] pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-secondary)]">Service Charge</span>
                    <span className="text-xl font-bold text-[var(--primary)]">₹{worker.minCharge}</span>
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1">
                    * Final amount may vary based on actual work
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[var(--border-color)] p-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="btn btn-primary w-full disabled:opacity-50"
          >
            {currentStep === 4 ? (
              <>
                <CreditCard className="w-5 h-5" />
                Proceed to Payment
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          amount={worker.minCharge}
          onClose={() => setShowPayment(false)}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
}

