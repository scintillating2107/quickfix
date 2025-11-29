"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, ClipboardList, Calendar, MapPin, User, Wrench, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import { useAuthStore, useBookingsStore, useUsersStore, useWorkersStore } from '@/lib/store';
import { formatDate, formatDateTime, getStatusColor, formatCurrency } from '@/lib/utils';
import { categories } from '@/data/mock-data';
import { Booking } from '@/types';

export default function AdminBookingsPage() {
  const router = useRouter();
  const { session } = useAuthStore();
  const { bookings } = useBookingsStore();
  const { getUser } = useUsersStore();
  const { getWorker } = useWorkersStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'ongoing' | 'completed'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!session || session.userType !== 'admin') {
      router.push('/admin-login');
      return;
    }
  }, [session, router]);

  if (!session) return null;

  const filteredBookings = bookings
    .filter(booking => {
      const user = getUser(booking.userId);
      const worker = getWorker(booking.workerId);
      const matchesSearch = 
        booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker?.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (filter === 'pending') return matchesSearch && booking.status === 'pending';
      if (filter === 'ongoing') return matchesSearch && ['accepted', 'ongoing'].includes(booking.status);
      if (filter === 'completed') return matchesSearch && ['completed', 'cancelled', 'rejected'].includes(booking.status);
      return matchesSearch;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    ongoing: bookings.filter(b => ['accepted', 'ongoing'].includes(b.status)).length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };

  const handleViewDetails = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowDetails(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.push('/admin-dashboard')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-semibold text-gray-900">Booking Management</h1>
              <p className="text-xs text-gray-500">{filteredBookings.length} bookings</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        {/* Search */}
        <div className="animate-fade-in">
          <Input
            type="text"
            placeholder="Search by booking ID, customer or worker name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-5 h-5" />}
            className="bg-white"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 animate-slide-up">
          <Card className="text-center cursor-pointer" onClick={() => setFilter('all')}>
            <CardContent className="p-3">
              <p className="text-2xl font-bold text-purple-600">{stats.total}</p>
              <p className="text-xs text-gray-500">Total</p>
            </CardContent>
          </Card>
          <Card className="text-center cursor-pointer" onClick={() => setFilter('pending')}>
            <CardContent className="p-3">
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </CardContent>
          </Card>
          <Card className="text-center cursor-pointer" onClick={() => setFilter('ongoing')}>
            <CardContent className="p-3">
              <p className="text-2xl font-bold text-blue-600">{stats.ongoing}</p>
              <p className="text-xs text-gray-500">Ongoing</p>
            </CardContent>
          </Card>
          <Card className="text-center cursor-pointer" onClick={() => setFilter('completed')}>
            <CardContent className="p-3">
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-xs text-gray-500">Completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto animate-slide-up animate-delay-100">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            className={filter === 'all' ? 'bg-purple-500 hover:bg-purple-600' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            size="sm"
            className={filter === 'pending' ? 'bg-purple-500 hover:bg-purple-600' : ''}
            onClick={() => setFilter('pending')}
          >
            Pending
          </Button>
          <Button
            variant={filter === 'ongoing' ? 'default' : 'outline'}
            size="sm"
            className={filter === 'ongoing' ? 'bg-purple-500 hover:bg-purple-600' : ''}
            onClick={() => setFilter('ongoing')}
          >
            Ongoing
          </Button>
          <Button
            variant={filter === 'completed' ? 'default' : 'outline'}
            size="sm"
            className={filter === 'completed' ? 'bg-purple-500 hover:bg-purple-600' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed
          </Button>
        </div>

        {/* Bookings List */}
        <div className="space-y-3 animate-slide-up animate-delay-200">
          {filteredBookings.length === 0 ? (
            <Card className="p-8 text-center">
              <ClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No bookings found</p>
            </Card>
          ) : (
            filteredBookings.map((booking, index) => {
              const user = getUser(booking.userId);
              const worker = getWorker(booking.workerId);
              const category = categories.find(c => c.id === booking.categoryId);

              return (
                <Card 
                  key={booking.id} 
                  className="hover:shadow-lg transition-all animate-fade-in cursor-pointer"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => handleViewDetails(booking)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-mono text-sm text-gray-500">#{booking.id.slice(-8)}</p>
                        <Badge className={`${getStatusColor(booking.status)} mt-1`}>
                          {booking.status}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{formatDate(booking.createdAt)}</p>
                        {booking.price && (
                          <p className="text-lg font-bold text-green-600">{formatCurrency(booking.price)}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} />
                          <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs text-gray-500">Customer</p>
                          <p className="font-medium text-gray-900">{user?.name || 'Unknown'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={worker?.profilePicture} />
                          <AvatarFallback><Wrench className="w-4 h-4" /></AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs text-gray-500">Worker</p>
                          <p className="font-medium text-gray-900">{worker?.name || 'Unknown'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
                      <Badge variant="outline">{category?.name}</Badge>
                      <Button size="sm" variant="ghost" className="text-purple-600">
                        <Eye className="w-4 h-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </main>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-gray-500">#{selectedBooking.id.slice(-8)}</span>
                <Badge className={getStatusColor(selectedBooking.status)}>
                  {selectedBooking.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Customer</p>
                  <p className="font-medium">{getUser(selectedBooking.userId)?.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Worker</p>
                  <p className="font-medium">{getWorker(selectedBooking.workerId)?.name}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500">Service Category</p>
                <Badge variant="outline">
                  {categories.find(c => c.id === selectedBooking.categoryId)?.name}
                </Badge>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500">Problem Description</p>
                <p className="text-sm bg-gray-50 p-3 rounded-xl">{selectedBooking.problemDescription}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Preferred Time</p>
                  <p className="text-sm">{selectedBooking.preferredTime}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="text-lg font-bold text-green-600">
                    {selectedBooking.price ? formatCurrency(selectedBooking.price) : 'Pending'}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-gray-500">Address</p>
                <p className="text-sm flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
                  {selectedBooking.address}
                </p>
              </div>

              <div className="pt-3 border-t text-xs text-gray-500 space-y-1">
                <p>Created: {formatDateTime(selectedBooking.createdAt)}</p>
                <p>Updated: {formatDateTime(selectedBooking.updatedAt)}</p>
                {selectedBooking.completedAt && (
                  <p>Completed: {formatDateTime(selectedBooking.completedAt)}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

