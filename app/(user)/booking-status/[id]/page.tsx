"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, Clock, CheckCircle, XCircle, Loader2, 
  MapPin, Phone, MessageCircle, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore, useBookingsStore, useWorkersStore } from '@/lib/store';
import { formatDateTime, getStatusColor, formatCurrency } from '@/lib/utils';
import { categories } from '@/data/mock-data';

const statusSteps = [
  { key: 'pending', label: 'Request Sent', icon: Clock },
  { key: 'accepted', label: 'Accepted', icon: CheckCircle },
  { key: 'ongoing', label: 'In Progress', icon: Loader2 },
  { key: 'completed', label: 'Completed', icon: CheckCircle },
];

export default function BookingStatusPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;

  const { session } = useAuthStore();
  const { getBooking, updateBooking } = useBookingsStore();
  const { getWorker } = useWorkersStore();

  const [booking, setBooking] = useState(getBooking(bookingId));

  useEffect(() => {
    if (!session || session.userType !== 'user') {
      router.push('/login');
      return;
    }

    // Poll for updates
    const interval = setInterval(() => {
      const updatedBooking = getBooking(bookingId);
      if (updatedBooking) {
        setBooking(updatedBooking);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [session, router, bookingId, getBooking]);

  if (!session || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Booking not found</p>
      </div>
    );
  }

  const worker = getWorker(booking.workerId);
  const category = categories.find(c => c.id === booking.categoryId);

  const currentStepIndex = statusSteps.findIndex(s => s.key === booking.status);

  const handleCall = () => {
    if (worker) {
      window.location.href = `tel:${worker.phone}`;
    }
  };

  const handleWhatsApp = () => {
    if (worker) {
      const message = encodeURIComponent(`Hi ${worker.name}, regarding my booking...`);
      window.open(`https://wa.me/${worker.phone.replace(/\D/g, '')}?text=${message}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-semibold text-gray-900">Booking Status</h1>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Status Banner */}
        <Card className={`animate-fade-in ${
          booking.status === 'completed' ? 'bg-green-50 border-green-200' :
          booking.status === 'cancelled' || booking.status === 'rejected' ? 'bg-red-50 border-red-200' :
          'bg-blue-50 border-blue-200'
        }`}>
          <CardContent className="p-4 text-center">
            <Badge className={getStatusColor(booking.status)}>
              {booking.status.toUpperCase()}
            </Badge>
            <p className="text-sm text-gray-600 mt-2">
              {booking.status === 'pending' && 'Waiting for worker to accept your request'}
              {booking.status === 'accepted' && 'Worker has accepted! They will arrive soon'}
              {booking.status === 'ongoing' && 'Service is in progress'}
              {booking.status === 'completed' && 'Service completed successfully!'}
              {booking.status === 'cancelled' && 'This booking was cancelled'}
              {booking.status === 'rejected' && 'Worker could not accept this request'}
            </p>
          </CardContent>
        </Card>

        {/* Progress Steps */}
        {booking.status !== 'cancelled' && booking.status !== 'rejected' && (
          <Card className="animate-slide-up">
            <CardContent className="p-6">
              <div className="relative">
                {statusSteps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  const StepIcon = step.icon;

                  return (
                    <div key={step.key} className="flex items-start gap-4 mb-6 last:mb-0">
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                        } ${isCurrent ? 'ring-4 ring-green-100' : ''}`}>
                          <StepIcon className={`w-5 h-5 ${isCurrent && booking.status === 'ongoing' ? 'animate-spin' : ''}`} />
                        </div>
                        {index < statusSteps.length - 1 && (
                          <div className={`absolute top-10 left-1/2 w-0.5 h-8 -translate-x-1/2 ${
                            index < currentStepIndex ? 'bg-green-500' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                      <div className="pt-2">
                        <p className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Worker Info */}
        {worker && (
          <Card className="animate-slide-up animate-delay-100">
            <CardContent className="p-4">
              <h3 className="font-medium text-gray-900 mb-3">Service Provider</h3>
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14 border-2 border-gray-100">
                  <AvatarImage src={worker.profilePicture} />
                  <AvatarFallback>{worker.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{worker.name}</h4>
                  <p className="text-sm text-blue-600">{worker.skill}</p>
                  <p className="text-sm text-gray-500">{worker.phone}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={handleCall}>
                  <Phone className="w-4 h-4" />
                  Call
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-1 text-green-600 border-green-200" onClick={handleWhatsApp}>
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Booking Details */}
        <Card className="animate-slide-up animate-delay-200">
          <CardContent className="p-4 space-y-4">
            <h3 className="font-medium text-gray-900">Booking Details</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Badge variant="secondary" className="shrink-0">{category?.name}</Badge>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-700">Problem</p>
                  <p className="text-gray-600">{booking.problemDescription}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-700">Preferred Time</p>
                  <p className="text-gray-600">{booking.preferredTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-700">Address</p>
                  <p className="text-gray-600">{booking.address}</p>
                </div>
              </div>

              {booking.price && (
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Total Amount</span>
                    <span className="text-xl font-bold text-blue-600">{formatCurrency(booking.price)}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Timestamps */}
        <Card className="animate-slide-up animate-delay-300">
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">
              Booked on {formatDateTime(booking.createdAt)}
            </p>
            {booking.completedAt && (
              <p className="text-xs text-gray-500">
                Completed on {formatDateTime(booking.completedAt)}
              </p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

