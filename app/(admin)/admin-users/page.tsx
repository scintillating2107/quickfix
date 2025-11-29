"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Users, Mail, Phone, MapPin, Calendar, MoreVertical, Ban, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore, useUsersStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import { User } from '@/types';

export default function AdminUsersPage() {
  const router = useRouter();
  const { session } = useAuthStore();
  const { users } = useUsersStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [userList, setUserList] = useState<User[]>([]);

  useEffect(() => {
    if (!session || session.userType !== 'admin') {
      router.push('/admin-login');
      return;
    }

    setUserList(users);
  }, [session, router, users]);

  if (!session) return null;

  const filteredUsers = userList.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery)
  );

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
              <h1 className="font-semibold text-gray-900">User Management</h1>
              <p className="text-xs text-gray-500">{filteredUsers.length} total users</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        {/* Search */}
        <div className="animate-fade-in">
          <Input
            type="text"
            placeholder="Search users by name, email or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-5 h-5" />}
            className="bg-white"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 animate-slide-up">
          <Card className="text-center">
            <CardContent className="p-3">
              <p className="text-2xl font-bold text-blue-600">{users.length}</p>
              <p className="text-xs text-gray-500">Total Users</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-3">
              <p className="text-2xl font-bold text-green-600">{users.length}</p>
              <p className="text-xs text-gray-500">Active</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-3">
              <p className="text-2xl font-bold text-gray-400">0</p>
              <p className="text-xs text-gray-500">Suspended</p>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <div className="space-y-3 animate-slide-up animate-delay-100">
          {filteredUsers.length === 0 ? (
            <Card className="p-8 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No users found</p>
            </Card>
          ) : (
            filteredUsers.map((user, index) => (
              <Card 
                key={user.id} 
                className="hover:shadow-lg transition-all animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-14 h-14 border-2 border-gray-100">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <Badge variant="success" className="text-xs">Active</Badge>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4 text-blue-500" />
                          <span className="truncate">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4 text-green-500" />
                          <span>{user.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 sm:col-span-2">
                          <MapPin className="w-4 h-4 text-red-500" />
                          <span className="truncate">{user.address}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>Joined {formatDate(user.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="text-gray-400">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
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

