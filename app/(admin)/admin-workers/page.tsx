"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Search, Wrench, Mail, Phone, Star, Calendar, 
  ToggleLeft, ToggleRight, Ban, CheckCircle, XCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore, useWorkersStore } from '@/lib/store';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Worker } from '@/types';

export default function AdminWorkersPage() {
  const router = useRouter();
  const { session } = useAuthStore();
  const { workers, updateWorker } = useWorkersStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all');

  useEffect(() => {
    if (!session || session.userType !== 'admin') {
      router.push('/admin-login');
      return;
    }
  }, [session, router]);

  if (!session) return null;

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = 
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.skill.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'approved') return matchesSearch && worker.isApproved;
    if (filter === 'pending') return matchesSearch && !worker.isApproved && worker.isActive;
    return matchesSearch && worker.isActive;
  });

  const handleToggleActive = (workerId: string, isActive: boolean) => {
    updateWorker(workerId, { isActive: !isActive });
  };

  const stats = {
    total: workers.filter(w => w.isActive).length,
    approved: workers.filter(w => w.isApproved && w.isActive).length,
    pending: workers.filter(w => !w.isApproved && w.isActive).length,
    online: workers.filter(w => w.isAvailable && w.isApproved).length,
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
              <h1 className="font-semibold text-gray-900">Worker Management</h1>
              <p className="text-xs text-gray-500">{filteredWorkers.length} workers</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        {/* Search */}
        <div className="animate-fade-in">
          <Input
            type="text"
            placeholder="Search workers by name, email or skill..."
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
              <p className="text-2xl font-bold text-orange-600">{stats.total}</p>
              <p className="text-xs text-gray-500">Total</p>
            </CardContent>
          </Card>
          <Card className="text-center cursor-pointer" onClick={() => setFilter('approved')}>
            <CardContent className="p-3">
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              <p className="text-xs text-gray-500">Approved</p>
            </CardContent>
          </Card>
          <Card className="text-center cursor-pointer" onClick={() => setFilter('pending')}>
            <CardContent className="p-3">
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              <p className="text-xs text-gray-500">Pending</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-3">
              <p className="text-2xl font-bold text-blue-600">{stats.online}</p>
              <p className="text-xs text-gray-500">Online</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 animate-slide-up animate-delay-100">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            className={filter === 'all' ? 'bg-purple-500 hover:bg-purple-600' : ''}
            onClick={() => setFilter('all')}
          >
            All Workers
          </Button>
          <Button
            variant={filter === 'approved' ? 'default' : 'outline'}
            size="sm"
            className={filter === 'approved' ? 'bg-purple-500 hover:bg-purple-600' : ''}
            onClick={() => setFilter('approved')}
          >
            Approved
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            size="sm"
            className={filter === 'pending' ? 'bg-purple-500 hover:bg-purple-600' : ''}
            onClick={() => setFilter('pending')}
          >
            Pending Approval
          </Button>
        </div>

        {/* Workers List */}
        <div className="space-y-3 animate-slide-up animate-delay-200">
          {filteredWorkers.length === 0 ? (
            <Card className="p-8 text-center">
              <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No workers found</p>
            </Card>
          ) : (
            filteredWorkers.map((worker, index) => (
              <Card 
                key={worker.id} 
                className="hover:shadow-lg transition-all animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-14 h-14 border-2 border-gray-100">
                      <AvatarImage src={worker.profilePicture} />
                      <AvatarFallback>{worker.name[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold text-gray-900">{worker.name}</h3>
                        <Badge variant={worker.isApproved ? 'success' : 'warning'}>
                          {worker.isApproved ? 'Approved' : 'Pending'}
                        </Badge>
                        {worker.isApproved && (
                          <Badge variant={worker.isAvailable ? 'success' : 'secondary'}>
                            {worker.isAvailable ? 'Online' : 'Offline'}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-blue-600 font-medium mb-2">{worker.skill}</p>
                      
                      <div className="grid sm:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4 text-blue-500" />
                          <span className="truncate">{worker.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4 text-green-500" />
                          <span>{worker.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>{worker.rating} ({worker.totalReviews} reviews)</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <span className="text-green-600 font-medium">{formatCurrency(worker.minCharge)} min</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>Joined {formatDate(worker.createdAt)}</span>
                        <span>•</span>
                        <span>{worker.experience}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {!worker.isApproved ? (
                        <>
                          <Button 
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() => updateWorker(worker.id, { isApproved: true })}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200"
                            onClick={() => handleToggleActive(worker.id, true)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Button 
                          size="sm"
                          variant="outline"
                          className={worker.isActive ? 'text-red-600 border-red-200' : 'text-green-600 border-green-200'}
                          onClick={() => handleToggleActive(worker.id, worker.isActive)}
                        >
                          {worker.isActive ? (
                            <>
                              <Ban className="w-4 h-4 mr-1" />
                              Suspend
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Activate
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

