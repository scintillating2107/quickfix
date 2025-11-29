"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Clock, CheckCircle, XCircle, Play, MapPin, Phone, 
  MessageCircle, Calendar, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from '@/components/ui/dialog';
import { useAuthStore, useWorkersStore, useBookingsStore, useUsersStore } from '@/lib/store';
import { formatDate, formatDateTime, getStatusColor, formatCurrency } from '@/lib/utils';
import { Booking } from '@/types';
import { categories } from '@/data/mock-data';

export default function WorkerJobsPage() {
  const router = useRouter();
  const { session } = useAuthStore();
  const { getWorker } = useWorkersStore();
  const { getWorkerBookings, updateBooking } = useBookingsStore();
  const { getUser } = useUsersStore();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [price, setPrice] = useState('');

  const worker = session?.userId ? getWorker(session.userId) : null;

  useEffect(() => {
    if (!session || session.userType !== 'worker') {
      router.push('/worker-login');
      return;
    }

    if (worker) {
      const allBookings = getWorkerBookings(worker.id);
      setBookings(
        allBookings.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    }
  }, [session, router, worker, getWorkerBookings]);

  if (!session || !worker) return null;

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'active') {
      return ['pending', 'accepted', 'ongoing'].includes(booking.status);
    }
    if (filter === 'completed') {
      return ['completed', 'cancelled', 'rejected'].includes(booking.status);
    }
    return true;
  });

  const handleStartJob = (booking: Booking) => {
    updateBooking(booking.id, { 
      status: 'ongoing',
      updatedAt: new Date().toISOString()
    });
    setBookings(prev => prev.map(b => 
      b.id === booking.id ? { ...b, status: 'ongoing' as const } : b
    ));
  };

  const handleCompleteJob = () => {
    if (selectedBooking && price) {
      updateBooking(selectedBooking.id, { 
        status: 'completed',
        price: parseInt(price),
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setBookings(prev => prev.map(b => 
        b.id === selectedBooking.id 
          ? { ...b, status: 'completed' as const, price: parseInt(price) } 
          : b
      ));
      setShowCompleteDialog(false);
      setSelectedBooking(null);
      setPrice('');
    }
  };

  const handleCall = (userId: string) => {
    const user = getUser(userId);
    if (user) {
      window.location.href = `tel:${user.phone}`;
    }
  };

  const handleWhatsApp = (userId: string) => {
    const user = getUser(userId);
    if (user) {
      const message = encodeURIComponent(`Hi, I'm ${worker.name} from SmartHousehold regarding your service request.`);
      window.open(`https://wa.me/${user.phone.replace(/\D/g, '')}?text=${message}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push('/worker-dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-semibold text-gray-900">My Jobs</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-4 space-y-4">
        {/* Filter Tabs */}
        <div className="flex gap-2 animate-fade-in">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            className={filter === 'all' ? 'bg-orange-500 hover:bg-orange-600' : ''}
            onClick={() => setFilter('all')}
          >
            All ({bookings.length})
          </Button>
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            size="sm"
            className={filter === 'active' ? 'bg-orange-500 hover:bg-orange-600' : ''}
            onClick={() => setFilter('active')}
          >
            Active ({bookings.filter(b => ['pending', 'accepted', 'ongoing'].includes(b.status)).length})
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            size="sm"
            className={filter === 'completed' ? 'bg-orange-500 hover:bg-orange-600' : ''}
            onClick={() => setFilter('completed')}
          >
            Past ({bookings.filter(b => ['completed', 'cancelled', 'rejected'].includes(b.status)).length})
          </Button>
        </div>

        {/* Jobs List */}
        <div className="space-y-3 animate-slide-up">
          {filteredBookings.length === 0 ? (
            <Card className="p-8 text-center">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No jobs found</p>
            </Card>
          ) : (
            filteredBookings.map((booking, index) => {
              const customer = getUser(booking.userId);
              const category = categories.find(c => c.id === booking.categoryId);

              return (
                <Card 
                  key={booking.id} 
                  className="animate-fade-in hover:shadow-lg transition-all"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                      <span className="text-xs text-gray-500">{formatDate(booking.createdAt)}</span>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${customer?.name}`} />
                        <AvatarFallback>{customer?.name?.[0] || 'C'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{customer?.name || 'Customer'}</p>
                        <p className="text-sm text-blue-600">{category?.name}</p>
                      </div>
                      {booking.price && (
                        <p className="text-lg font-bold text-green-600">{formatCurrency(booking.price)}</p>
                      )}
                    </div>

                    <p className="text-sm text-gray-700 mb-3">{booking.problemDescription}</p>

                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {booking.preferredTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {booking.address.split(',')[0]}
                      </span>
                    </div>

                    {/* Action Buttons based on status */}
                    {booking.status === 'accepted' && (
                      <div className="flex gap-2 pt-3 border-t">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleCall(booking.userId)}
                        >
                          <Phone className="w-4 h-4 mr-1" />
                          Call
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 text-green-600 border-green-200"
                          onClick={() => handleWhatsApp(booking.userId)}
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          WhatsApp
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1 bg-blue-500 hover:bg-blue-600"
                          onClick={() => handleStartJob(booking)}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Start
                        </Button>
                      </div>
                    )}

                    {booking.status === 'ongoing' && (
                      <div className="flex gap-2 pt-3 border-t">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleCall(booking.userId)}
                        >
                          <Phone className="w-4 h-4 mr-1" />
                          Call
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1 bg-green-500 hover:bg-green-600"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowCompleteDialog(true);
                          }}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Complete
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </main>

      {/* Complete Job Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Job</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Enter the final amount charged for this service:
            </p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <Input
                type="number"
                placeholder="Enter amount"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowCompleteDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              className="bg-green-500 hover:bg-green-600"
              onClick={handleCompleteJob}
              disabled={!price}
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Mark Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

