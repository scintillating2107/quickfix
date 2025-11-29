import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Worker, Booking, Session, ChatMessage, Notification } from '@/types';
import { users as initialUsers, workers as initialWorkers, bookings as initialBookings, admins, chatMessages as initialChats, notifications as initialNotifications } from '@/data/mock-data';

// Auth Store
interface AuthState {
  session: Session | null;
  setSession: (session: Session) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (session) => set({ session }),
      logout: () => set({ session: null }),
    }),
    { name: 'quickfix-auth' }
  )
);

// Users Store
interface UsersState {
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  getUserByEmail: (email: string) => User | undefined;
}

export const useUsersStore = create<UsersState>()(
  persist(
    (set, get) => ({
      users: initialUsers,
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      updateUser: (id, updates) => set((state) => ({
        users: state.users.map(u => u.id === id ? { ...u, ...updates } : u)
      })),
      getUserByEmail: (email) => get().users.find(u => u.email === email),
    }),
    { name: 'quickfix-users' }
  )
);

// Workers Store
interface WorkersState {
  workers: Worker[];
  addWorker: (worker: Worker) => void;
  updateWorker: (id: string, updates: Partial<Worker>) => void;
  getWorkerByEmail: (email: string) => Worker | undefined;
  getWorkerById: (id: string) => Worker | undefined;
}

export const useWorkersStore = create<WorkersState>()(
  persist(
    (set, get) => ({
      workers: initialWorkers,
      addWorker: (worker) => set((state) => ({ workers: [...state.workers, worker] })),
      updateWorker: (id, updates) => set((state) => ({
        workers: state.workers.map(w => w.id === id ? { ...w, ...updates } : w)
      })),
      getWorkerByEmail: (email) => get().workers.find(w => w.email === email),
      getWorkerById: (id) => get().workers.find(w => w.id === id),
    }),
    { name: 'quickfix-workers' }
  )
);

// Bookings Store
interface BookingsState {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  getBookingById: (id: string) => Booking | undefined;
  getBookingsByUserId: (userId: string) => Booking[];
  getBookingsByWorkerId: (workerId: string) => Booking[];
}

export const useBookingsStore = create<BookingsState>()(
  persist(
    (set, get) => ({
      bookings: initialBookings,
      addBooking: (booking) => set((state) => ({ bookings: [...state.bookings, booking] })),
      updateBooking: (id, updates) => set((state) => ({
        bookings: state.bookings.map(b => b.id === id ? { ...b, ...updates } : b)
      })),
      getBookingById: (id) => get().bookings.find(b => b.id === id),
      getBookingsByUserId: (userId) => get().bookings.filter(b => b.userId === userId),
      getBookingsByWorkerId: (workerId) => get().bookings.filter(b => b.workerId === workerId),
    }),
    { name: 'quickfix-bookings' }
  )
);

// Chat Store
interface ChatState {
  messages: ChatMessage[];
  addMessage: (message: ChatMessage) => void;
  getMessagesByBookingId: (bookingId: string) => ChatMessage[];
  markAsRead: (messageId: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: initialChats,
      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
      getMessagesByBookingId: (bookingId) => get().messages.filter(m => m.bookingId === bookingId),
      markAsRead: (messageId) => set((state) => ({
        messages: state.messages.map(m => m.id === messageId ? { ...m, read: true } : m)
      })),
    }),
    { name: 'quickfix-chat' }
  )
);

// Notifications Store
interface NotificationsState {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: (userId: string) => void;
  getUnreadCount: (userId: string) => number;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: initialNotifications,
      addNotification: (notification) => set((state) => ({ 
        notifications: [notification, ...state.notifications] 
      })),
      markAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),
      markAllAsRead: (userId) => set((state) => ({
        notifications: state.notifications.map(n => 
          n.userId === userId ? { ...n, read: true } : n
        )
      })),
      getUnreadCount: (userId) => get().notifications.filter(n => n.userId === userId && !n.read).length,
    }),
    { name: 'quickfix-notifications' }
  )
);

// Admins Store
interface AdminsState {
  admins: typeof admins;
  getAdminByEmail: (email: string) => typeof admins[0] | undefined;
}

export const useAdminsStore = create<AdminsState>()(() => ({
  admins,
  getAdminByEmail: (email) => admins.find(a => a.email === email),
}));

// Location Store
interface LocationState {
  userLocation: { lat: number; lng: number } | null;
  setUserLocation: (location: { lat: number; lng: number }) => void;
}

export const useLocationStore = create<LocationState>()((set) => ({
  userLocation: { lat: 28.6139, lng: 77.2090 }, // Default to Delhi
  setUserLocation: (location) => set({ userLocation: location }),
}));

// UI Store for global state
interface UIState {
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));
