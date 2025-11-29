"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Briefcase, LogOut, Bell, MapPin, Star, IndianRupee, 
  Clock, CheckCircle, XCircle, Play, Check, TrendingUp,
  Calendar, Coffee, FileText, Upload, Send, Paperclip,
  ChevronRight, Download, Eye, MessageSquare, User,
  CreditCard, History, AlertCircle, Filter, Search,
  MoreVertical, Phone, Mail, Award, BarChart3, Wallet,
  FileUp, X, Image, File
} from 'lucide-react';
import { useAuthStore, useWorkersStore, useBookingsStore } from '@/lib/store';
import { Booking } from '@/types';

type TabType = 'tasks' | 'completed' | 'payments' | 'notifications';
type TaskViewType = 'list' | 'detail';

// Demo transaction history
const demoTransactions = [
  { id: 1, date: 'Nov 27, 2024', orderId: '#ORD-44755', amount: 600, status: 'paid' },
  { id: 2, date: 'Nov 25, 2024', orderId: '#ORD-44712', amount: 850, status: 'pending' },
  { id: 3, date: 'Nov 22, 2024', orderId: '#ORD-44698', amount: 450, status: 'paid' },
  { id: 4, date: 'Nov 20, 2024', orderId: '#ORD-44651', amount: 1200, status: 'paid' },
  { id: 5, date: 'Nov 18, 2024', orderId: '#ORD-44623', amount: 550, status: 'paid' },
];

// Demo notifications
const demoNotifications = [
  { id: 1, type: 'task', message: 'Admin assigned you a new task (#ORD-44785)', time: '2 min ago', read: false },
  { id: 2, type: 'payment', message: 'Payment for Order #44755 has been processed', time: '1 hour ago', read: false },
  { id: 3, type: 'revision', message: 'File revision requested by Admin for #ORD-44712', time: '3 hours ago', read: true },
  { id: 4, type: 'reminder', message: 'Deadline approaching: Order #44798 due in 2 hours', time: '5 hours ago', read: true },
  { id: 5, type: 'task', message: 'New task available: Academic Research Writing', time: '1 day ago', read: true },
];

// Demo chat messages
const demoChatMessages = [
  { id: 1, sender: 'admin', message: 'Hi Akash, please make sure the script includes API integration.', time: '10:30 AM' },
  { id: 2, sender: 'worker', message: 'Sure, I will update it and submit by tonight.', time: '10:32 AM' },
  { id: 3, sender: 'admin', message: 'Great! Also, please add error handling for edge cases.', time: '10:35 AM' },
  { id: 4, sender: 'worker', message: 'Noted. I\'ll include comprehensive error handling.', time: '10:36 AM' },
];

export default function WorkerDashboardPage() {
  const router = useRouter();
  const { session, logout } = useAuthStore();
  const { workers, updateWorker } = useWorkersStore();
  const { bookings, updateBooking } = useBookingsStore();
  
  const [activeTab, setActiveTab] = useState<TabType>('tasks');
  const [taskView, setTaskView] = useState<TaskViewType>('list');
  const [selectedTask, setSelectedTask] = useState<Booking | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [busyMode, setBusyMode] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showChatPanel, setShowChatPanel] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadNotes, setUploadNotes] = useState('');

  const worker = workers.find(w => w.id === session?.userId);
  
  const pendingJobs = bookings.filter(b => b.workerId === session?.userId && b.status === 'pending');
  const activeJobs = bookings.filter(b => b.workerId === session?.userId && (b.status === 'accepted' || b.status === 'ongoing'));
  const completedJobs = bookings.filter(b => b.workerId === session?.userId && b.status === 'completed');
  const allAssignedJobs = [...pendingJobs, ...activeJobs];
  
  const todayEarnings = completedJobs
    .filter(b => b.completedDate && new Date(b.completedDate).toDateString() === new Date().toDateString())
    .reduce((sum, job) => sum + job.amount, 0);
  
  const totalEarnings = completedJobs.reduce((sum, job) => sum + job.amount, 0);
  const pendingPayments = 1400; // Demo value

  useEffect(() => {
    if (!session || session.userType !== 'worker') {
      router.push('/worker-login');
      return;
    }
    
    if (worker) {
      setIsAvailable(worker.isAvailable);
    }
  }, [session, router, worker]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const toggleAvailability = () => {
    if (!worker) return;
    const newStatus = !isAvailable;
    setIsAvailable(newStatus);
    updateWorker(worker.id, { isAvailable: newStatus });
  };

  const setBusyFor = (duration: string) => {
    if (!worker) return;
    setBusyMode(duration);
    setIsAvailable(false);
    updateWorker(worker.id, { isAvailable: false });
  };

  const handleAcceptJob = (jobId: string) => {
    updateBooking(jobId, { 
      status: 'accepted',
      timeline: [
        ...(bookings.find(b => b.id === jobId)?.timeline || []),
        { status: 'accepted', time: new Date(), note: 'Worker accepted the job' }
      ]
    });
  };

  const handleRejectJob = (jobId: string) => {
    updateBooking(jobId, { status: 'rejected' });
  };

  const handleStartJob = (jobId: string) => {
    updateBooking(jobId, { 
      status: 'ongoing',
      timeline: [
        ...(bookings.find(b => b.id === jobId)?.timeline || []),
        { status: 'ongoing', time: new Date(), note: 'Work started' }
      ]
    });
  };

  const handleCompleteJob = (jobId: string) => {
    updateBooking(jobId, { 
      status: 'completed',
      completedDate: new Date(),
      timeline: [
        ...(bookings.find(b => b.id === jobId)?.timeline || []),
        { status: 'completed', time: new Date(), note: 'Work completed successfully' }
      ]
    });
  };

  const handleUploadFile = () => {
    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowUploadModal(false);
            setUploadProgress(0);
            setUploadNotes('');
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const viewTaskDetails = (job: Booking) => {
    setSelectedTask(job);
    setTaskView('detail');
  };

  if (!session || !worker) return null;

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Top Navigation Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">QuickFix</span>
            </div>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { id: 'tasks', label: 'Dashboard', icon: BarChart3 },
                { id: 'completed', label: 'My Tasks', icon: FileText },
                { id: 'notifications', label: 'Messages', icon: MessageSquare },
                { id: 'profile', label: 'Profile', icon: User },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => item.id === 'profile' ? null : setActiveTab(item.id as TabType)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === item.id 
                      ? 'bg-indigo-50 text-indigo-600' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveTab('notifications')}
                className="relative p-2.5 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-500" />
                {demoNotifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
              <button 
                onClick={handleLogout} 
                className="p-2.5 hover:bg-red-50 rounded-xl text-gray-500 hover:text-red-500 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Welcome Header */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
            <div className="absolute right-20 bottom-0 w-32 h-32 bg-white/10 rounded-full -mb-16" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">👋</span>
                <h1 className="text-2xl font-bold">Hello, {worker.name.split(' ')[0]}!</h1>
              </div>
              <p className="text-indigo-100">
                You have {allAssignedJobs.length} tasks pending today. Let&apos;s get started.
              </p>
            </div>
          </div>
        </section>

        {/* Stat Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Assigned Tasks */}
          <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{String(allAssignedJobs.length).padStart(2, '0')}</p>
                <p className="text-sm text-gray-500 mt-1">Assigned Tasks</p>
                <p className="text-xs text-gray-400 mt-0.5">Tasks waiting for your action</p>
              </div>
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-indigo-500" />
              </div>
            </div>
          </div>

          {/* Tasks Completed */}
          <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{String(completedJobs.length).padStart(2, '0')}</p>
                <p className="text-sm text-gray-500 mt-1">Tasks Completed</p>
                <p className="text-xs text-gray-400 mt-0.5">Great job! Keep going.</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </div>

          {/* Pending Submissions */}
          <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{String(activeJobs.length).padStart(2, '0')}</p>
                <p className="text-sm text-gray-500 mt-1">Pending Submissions</p>
                <p className="text-xs text-gray-400 mt-0.5">Files awaiting upload</p>
              </div>
              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </div>

          {/* Earnings This Month */}
          <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">₹{totalEarnings.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">Earnings This Month</p>
                <p className="text-xs text-gray-400 mt-0.5">Based on completed tasks</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wallet className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </div>
        </section>

        {/* Main Tabs */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-100 px-6">
            <div className="flex gap-1">
              {[
                { id: 'tasks', label: 'My Tasks', icon: FileText },
                { id: 'completed', label: 'Completed', icon: CheckCircle },
                { id: 'payments', label: 'Payments', icon: CreditCard },
                { id: 'notifications', label: 'Notifications', icon: Bell },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as TabType);
                    setTaskView('list');
                  }}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-all ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {tab.id === 'notifications' && demoNotifications.filter(n => !n.read).length > 0 && (
                    <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {demoNotifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* My Tasks Tab */}
            {activeTab === 'tasks' && taskView === 'list' && (
              <div className="space-y-4">
                {/* Availability Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-6">
                  <div>
                    <h4 className="font-medium text-gray-900">Availability Status</h4>
                    <p className="text-sm text-gray-500">
                      {isAvailable ? 'You are visible to customers' : busyMode ? `Busy for ${busyMode}` : 'You are offline'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                      {['30min', '1hr', 'Lunch'].map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setBusyFor(mode)}
                          className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                            busyMode === mode 
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                              : 'border-gray-200 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {mode === 'Lunch' ? <Coffee className="w-3 h-3 inline mr-1" /> : <Clock className="w-3 h-3 inline mr-1" />}
                          {mode}
                        </button>
                      ))}
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={isAvailable} onChange={toggleAvailability} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>
                </div>

                {/* Task List */}
                {allAssignedJobs.length === 0 ? (
                  <div className="text-center py-16">
                    <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No active tasks</h3>
                    <p className="text-gray-500">New task assignments will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allAssignedJobs.map((job) => (
                      <TaskCard 
                        key={job.id} 
                        job={job}
                        onViewDetails={() => viewTaskDetails(job)}
                        onAccept={() => handleAcceptJob(job.id)}
                        onReject={() => handleRejectJob(job.id)}
                        onStart={() => handleStartJob(job.id)}
                        onComplete={() => handleCompleteJob(job.id)}
                        onUpload={() => setShowUploadModal(true)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Task Detail View */}
            {activeTab === 'tasks' && taskView === 'detail' && selectedTask && (
              <TaskDetailView 
                task={selectedTask}
                onBack={() => setTaskView('list')}
                onChat={() => setShowChatPanel(true)}
                onUpload={() => setShowUploadModal(true)}
                onUpdateStatus={(status) => {
                  if (status === 'started') handleStartJob(selectedTask.id);
                  if (status === 'completed') handleCompleteJob(selectedTask.id);
                }}
              />
            )}

            {/* Completed Tab */}
            {activeTab === 'completed' && (
              <div className="space-y-4">
                {/* Filters */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 hover:bg-gray-200 transition-colors">
                      <Filter className="w-4 h-4" />
                      Filter
                    </button>
                    <button className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">By Date</button>
                    <button className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">By Earning</button>
                    <button className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">By Rating</button>
                  </div>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search orders..."
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                    />
                  </div>
                </div>

                {completedJobs.length === 0 ? (
                  <div className="text-center py-16">
                    <CheckCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No completed tasks yet</h3>
                    <p className="text-gray-500">Completed tasks will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {completedJobs.map((job) => (
                      <CompletedTaskCard key={job.id} job={job} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                {/* Payment Summary Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                    <p className="text-sm text-emerald-600 font-medium">Total Earnings</p>
                    <p className="text-2xl font-bold text-emerald-700 mt-1">₹{(totalEarnings + 8200).toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
                    <p className="text-sm text-amber-600 font-medium">Pending</p>
                    <p className="text-2xl font-bold text-amber-700 mt-1">₹{pendingPayments.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
                    <p className="text-sm text-indigo-600 font-medium">Last Payment</p>
                    <p className="text-2xl font-bold text-indigo-700 mt-1">₹3,800</p>
                    <p className="text-xs text-indigo-500 mt-0.5">Nov 23, 2024</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                    <p className="text-sm text-purple-600 font-medium">Next Payout</p>
                    <p className="text-2xl font-bold text-purple-700 mt-1">Dec 7</p>
                    <p className="text-xs text-purple-500 mt-0.5">2024</p>
                  </div>
                </div>

                {/* Transaction History */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction History</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Order ID</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {demoTransactions.map((tx) => (
                          <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-4 text-sm text-gray-600">{tx.date}</td>
                            <td className="py-3 px-4 text-sm font-medium text-gray-900">{tx.orderId}</td>
                            <td className="py-3 px-4 text-sm font-semibold text-gray-900">₹{tx.amount}</td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                tx.status === 'paid' 
                                  ? 'bg-emerald-50 text-emerald-600' 
                                  : 'bg-amber-50 text-amber-600'
                              }`}>
                                {tx.status === 'paid' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                                {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-3">
                {demoNotifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                      notification.read 
                        ? 'bg-white border-gray-100' 
                        : 'bg-indigo-50 border-indigo-100'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      notification.type === 'task' ? 'bg-indigo-100' :
                      notification.type === 'payment' ? 'bg-emerald-100' :
                      notification.type === 'revision' ? 'bg-amber-100' :
                      'bg-red-100'
                    }`}>
                      {notification.type === 'task' && <FileText className="w-5 h-5 text-indigo-600" />}
                      {notification.type === 'payment' && <IndianRupee className="w-5 h-5 text-emerald-600" />}
                      {notification.type === 'revision' && <AlertCircle className="w-5 h-5 text-amber-600" />}
                      {notification.type === 'reminder' && <Bell className="w-5 h-5 text-red-600" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Upload Work</h3>
              <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              {/* Drag & Drop Zone */}
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors cursor-pointer">
                <FileUp className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-600 mb-1">Drag and drop your files here</p>
                <p className="text-xs text-gray-400">or click to browse</p>
                <p className="text-xs text-gray-400 mt-3">Maximum size: 50 MB • PDF, DOCX, ZIP, Images</p>
              </div>

              {/* Progress Bar */}
              {uploadProgress > 0 && (
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Uploading...</span>
                    <span className="text-indigo-600 font-medium">{uploadProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Notes Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  placeholder="Add any notes about your submission..."
                  className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 resize-none"
                  rows={3}
                />
              </div>

              <p className="text-xs text-gray-400 text-center">
                Upload your draft or final file. Maximum size: 50 MB.
              </p>
            </div>
            <div className="flex gap-3 p-5 border-t border-gray-100">
              <button 
                onClick={() => setShowUploadModal(false)}
                className="flex-1 py-2.5 px-4 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleUploadFile}
                className="flex-1 py-2.5 px-4 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Panel */}
      {showChatPanel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-end z-50">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Admin Support</h3>
                  <p className="text-xs text-emerald-500">● Online</p>
                </div>
              </div>
              <button onClick={() => setShowChatPanel(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {demoChatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'worker' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.sender === 'worker' 
                      ? 'bg-indigo-500 text-white rounded-br-md' 
                      : 'bg-gray-100 text-gray-900 rounded-bl-md'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'worker' ? 'text-indigo-200' : 'text-gray-400'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <button className="p-2.5 hover:bg-gray-100 rounded-xl">
                  <Paperclip className="w-5 h-5 text-gray-500" />
                </button>
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 py-2.5 px-4 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
                <button className="p-2.5 bg-indigo-500 hover:bg-indigo-600 rounded-xl transition-colors">
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 z-40">
        <div className="flex items-center justify-around">
          {[
            { id: 'tasks', label: 'Tasks', icon: FileText },
            { id: 'completed', label: 'Done', icon: CheckCircle },
            { id: 'payments', label: 'Pay', icon: Wallet },
            { id: 'notifications', label: 'Alerts', icon: Bell },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-colors ${
                activeTab === item.id ? 'text-indigo-600' : 'text-gray-400'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

// Task Card Component
interface TaskCardProps {
  job: Booking;
  onViewDetails: () => void;
  onAccept?: () => void;
  onReject?: () => void;
  onStart?: () => void;
  onComplete?: () => void;
  onUpload?: () => void;
}

function TaskCard({ job, onViewDetails, onAccept, onReject, onStart, onComplete, onUpload }: TaskCardProps) {
  const statusColors = {
    pending: 'bg-amber-50 text-amber-600 border-amber-200',
    accepted: 'bg-blue-50 text-blue-600 border-blue-200',
    ongoing: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    completed: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-gray-400">Order ID:</span>
            <span className="text-sm font-medium text-gray-900">#{job.id.slice(-8).toUpperCase()}</span>
          </div>
          <h4 className="font-semibold text-gray-900">{job.serviceType}</h4>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[job.status as keyof typeof statusColors] || statusColors.pending}`}>
          {job.status === 'ongoing' ? 'In Progress' : job.status.charAt(0).toUpperCase() + job.status.slice(1)}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <span className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          {job.status === 'pending' ? '2 days left' : new Date(job.scheduledDate).toLocaleDateString()}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4" />
          {job.address?.split(',')[0] || 'Location'}
        </span>
      </div>

      {job.description && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-600 line-clamp-2">
            <span className="font-medium">Instructions:</span> {job.description}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <p className="text-lg font-bold text-indigo-600">₹{job.amount}</p>
        
        <div className="flex gap-2">
          {job.status === 'pending' && (
            <>
              <button 
                onClick={onReject}
                className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
              <button 
                onClick={onAccept}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Accept
              </button>
            </>
          )}
          
          {job.status === 'accepted' && (
            <>
              <button 
                onClick={onViewDetails}
                className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
              <button 
                onClick={onStart}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-500 text-white rounded-xl text-sm font-medium hover:bg-indigo-600 transition-colors"
              >
                <Play className="w-4 h-4" />
                Start Job
              </button>
            </>
          )}
          
          {job.status === 'ongoing' && (
            <>
              <button 
                onClick={onUpload}
                className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload File
              </button>
              <button 
                onClick={onComplete}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors"
              >
                <Check className="w-4 h-4" />
                Complete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Completed Task Card Component
function CompletedTaskCard({ job }: { job: Booking }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-medium text-gray-900">#{job.id.slice(-8).toUpperCase()}</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span className="text-sm text-gray-500">{job.serviceType}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Delivered: {job.completedDate ? new Date(job.completedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-emerald-600">₹{job.amount}</p>
          <div className="flex items-center gap-1 justify-end mt-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">
              Paid
            </span>
            <div className="flex items-center text-amber-400">
              {[1, 2, 3, 4].map((i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
              <Star className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Task Detail View Component
interface TaskDetailViewProps {
  task: Booking;
  onBack: () => void;
  onChat: () => void;
  onUpload: () => void;
  onUpdateStatus: (status: string) => void;
}

function TaskDetailView({ task, onBack, onChat, onUpload, onUpdateStatus }: TaskDetailViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronRight className="w-5 h-5 text-gray-500 rotate-180" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
          <p className="text-sm text-gray-500">#{task.id.slice(-8).toUpperCase()}</p>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-xl p-5 space-y-4">
        <h3 className="font-semibold text-gray-900">Order Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="font-medium text-gray-900">#{task.id.slice(-8).toUpperCase()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Service Type</p>
            <p className="font-medium text-gray-900">{task.serviceType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Deadline</p>
            <p className="font-medium text-gray-900">{new Date(task.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {task.timeSlot}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Amount</p>
            <p className="font-bold text-indigo-600">₹{task.amount}</p>
          </div>
        </div>
      </div>

      {/* Order Description */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <h3 className="font-semibold text-gray-900 mb-3">Order Description</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {task.description || 'Complete the service as per customer requirements. Ensure quality work and timely completion.'}
        </p>
      </div>

      {/* Documents Provided */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <h3 className="font-semibold text-gray-900 mb-3">Documents Provided</h3>
        <div className="space-y-2">
          {['problem_statement.pdf', 'sample_output.csv', 'reference_materials.zip'].map((doc, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <File className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-700">{doc}</span>
              </div>
              <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                <Download className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Status Update Workflow */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Update Status</h3>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => onUpdateStatus('started')}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-sm font-medium hover:bg-amber-100 transition-colors"
          >
            <Clock className="w-4 h-4" />
            Work Started
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors">
            <FileText className="w-4 h-4" />
            Draft Submitted
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-purple-50 border border-purple-200 text-purple-700 rounded-xl text-sm font-medium hover:bg-purple-100 transition-colors">
            <History className="w-4 h-4" />
            Revisions in Progress
          </button>
          <button 
            onClick={() => onUpdateStatus('completed')}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Final Submitted
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button 
          onClick={onChat}
          className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
          Chat with Admin
        </button>
        <button 
          onClick={onUpload}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-600 transition-colors"
        >
          <Upload className="w-5 h-5" />
          Upload File
        </button>
      </div>
    </div>
  );
}
