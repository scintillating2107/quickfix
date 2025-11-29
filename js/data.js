// ===== QuickFix Demo Data =====

// Service Categories
const categories = [
    {
        id: 'electrician',
        name: 'Electrician',
        icon: 'fas fa-bolt',
        description: 'Electrical repairs, wiring & installations',
        color: '#fef3c7',
        iconColor: '#d97706',
        services: ['Fan repair', 'Light installation', 'Switchboard repair', 'Wiring', 'MCB repair']
    },
    {
        id: 'plumber',
        name: 'Plumber',
        icon: 'fas fa-faucet',
        description: 'Pipe repairs, tap & bathroom fixtures',
        color: '#dbeafe',
        iconColor: '#2563eb',
        services: ['Tap repair', 'Pipe leakage', 'Drain cleaning', 'Toilet repair', 'Geyser service']
    },
    {
        id: 'carpenter',
        name: 'Carpenter',
        icon: 'fas fa-hammer',
        description: 'Furniture repair & woodwork',
        color: '#fde68a',
        iconColor: '#92400e',
        services: ['Door repair', 'Furniture assembly', 'Cabinet repair', 'Bed repair', 'Wardrobe fix']
    },
    {
        id: 'cleaner',
        name: 'Cleaning',
        icon: 'fas fa-broom',
        description: 'Deep cleaning & sanitization',
        color: '#d1fae5',
        iconColor: '#059669',
        services: ['Bathroom cleaning', 'Kitchen cleaning', 'Full home', 'Sofa cleaning', 'Carpet wash']
    },
    {
        id: 'ac-technician',
        name: 'AC Repair',
        icon: 'fas fa-snowflake',
        description: 'AC service, repair & installation',
        color: '#cffafe',
        iconColor: '#0891b2',
        services: ['AC service', 'Gas refill', 'Installation', 'AC repair', 'Deep cleaning']
    },
    {
        id: 'painter',
        name: 'Painter',
        icon: 'fas fa-paint-roller',
        description: 'Wall painting & home renovation',
        color: '#ede9fe',
        iconColor: '#7c3aed',
        services: ['Wall painting', 'Texture paint', 'Waterproofing', 'Wood polish', 'POP work']
    },
    {
        id: 'pest-control',
        name: 'Pest Control',
        icon: 'fas fa-bug',
        description: 'Termite, cockroach & pest removal',
        color: '#fee2e2',
        iconColor: '#dc2626',
        services: ['Cockroach control', 'Termite treatment', 'Bed bug removal', 'Ant control', 'Rodent control']
    },
    {
        id: 'appliance',
        name: 'Appliance Repair',
        icon: 'fas fa-tv',
        description: 'TV, Fridge, Washing machine repairs',
        color: '#fef3c7',
        iconColor: '#ea580c',
        services: ['Fridge repair', 'Washing machine', 'Microwave', 'TV repair', 'Chimney service']
    }
];

// Popular Services
const popularServices = [
    { name: 'Fan repair (ceiling/exhaust)', rating: 4.81, reviews: '93K', price: 109, category: 'electrician', icon: 'fas fa-fan' },
    { name: 'Tap repair', rating: 4.81, reviews: '119K', price: 49, category: 'plumber', icon: 'fas fa-faucet' },
    { name: 'Switchboard repair', rating: 4.85, reviews: '68K', price: 79, category: 'electrician', icon: 'fas fa-plug' },
    { name: 'AC Foam-jet service', rating: 4.77, reviews: '1.8M', price: 599, category: 'ac-technician', icon: 'fas fa-snowflake' },
    { name: 'Bathroom deep cleaning', rating: 4.79, reviews: '3.7M', price: 519, category: 'cleaner', icon: 'fas fa-bath' },
    { name: 'Door hinge repair', rating: 4.80, reviews: '50K', price: 129, category: 'carpenter', icon: 'fas fa-door-open' },
    { name: 'Drill & hang (wall decor)', rating: 4.85, reviews: '99K', price: 49, category: 'carpenter', icon: 'fas fa-tools' },
    { name: 'Kitchen cleaning', rating: 4.82, reviews: '1.5M', price: 428, category: 'cleaner', icon: 'fas fa-utensils' }
];

// Demo Users
const users = [
    {
        id: 'user-1',
        name: 'Aditya Kumar',
        email: 'aditya@example.com',
        phone: '+91 9876543210',
        address: 'C-43, Shastri Nagar, Delhi',
        password: 'password123',
        createdAt: '2024-01-15',
        location: { lat: 28.6139, lng: 77.2090 }
    },
    {
        id: 'user-2',
        name: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '+91 9876543211',
        address: 'B-22, Rajouri Garden, Delhi',
        password: 'password123',
        createdAt: '2024-01-20',
        location: { lat: 28.6448, lng: 77.1198 }
    },
    {
        id: 'user-3',
        name: 'Rahul Gupta',
        email: 'rahul@example.com',
        phone: '+91 9876543212',
        address: 'A-15, Laxmi Nagar, Delhi',
        password: 'password123',
        createdAt: '2024-02-05',
        location: { lat: 28.6304, lng: 77.2772 }
    },
    {
        id: 'user-4',
        name: 'Sneha Verma',
        email: 'sneha@example.com',
        phone: '+91 9876543213',
        address: 'D-78, Dwarka Sector 12, Delhi',
        password: 'password123',
        createdAt: '2024-02-10',
        location: { lat: 28.5921, lng: 77.0460 }
    },
    {
        id: 'user-5',
        name: 'Vikram Singh',
        email: 'vikram@example.com',
        phone: '+91 9876543214',
        address: 'E-34, Rohini Sector 9, Delhi',
        password: 'password123',
        createdAt: '2024-02-15',
        location: { lat: 28.7041, lng: 77.1025 }
    }
];

// Demo Workers
const workers = [
    {
        id: 'worker-1',
        name: 'Amit Sharma',
        email: 'amit.electrician@example.com',
        phone: '+91 9988776601',
        password: 'worker123',
        skill: 'Electrician',
        categoryId: 'electrician',
        experience: '5+ years experience',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
        rating: 4.8,
        totalReviews: 156,
        minCharge: 199,
        isAvailable: true,
        isApproved: true,
        isActive: true,
        location: { lat: 28.6229, lng: 77.2080 },
        completedJobs: 234,
        createdAt: '2023-06-15'
    },
    {
        id: 'worker-2',
        name: 'Rohan Verma',
        email: 'rohan.plumber@example.com',
        phone: '+91 9988776602',
        password: 'worker123',
        skill: 'Plumber',
        categoryId: 'plumber',
        experience: '3+ years experience',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan',
        rating: 4.5,
        totalReviews: 89,
        minCharge: 150,
        isAvailable: true,
        isApproved: true,
        isActive: true,
        location: { lat: 28.6100, lng: 77.2150 },
        completedJobs: 156,
        createdAt: '2023-07-20'
    },
    {
        id: 'worker-3',
        name: 'Suresh Kumar',
        email: 'suresh.carpenter@example.com',
        phone: '+91 9988776603',
        password: 'worker123',
        skill: 'Carpenter',
        categoryId: 'carpenter',
        experience: '8+ years experience',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh',
        rating: 4.9,
        totalReviews: 234,
        minCharge: 250,
        isAvailable: false,
        isApproved: true,
        isActive: true,
        location: { lat: 28.6350, lng: 77.2200 },
        completedJobs: 412,
        createdAt: '2023-05-10'
    },
    {
        id: 'worker-4',
        name: 'Rahul Singh',
        email: 'rahul.electrician@example.com',
        phone: '+91 9988776604',
        password: 'worker123',
        skill: 'Electrician',
        categoryId: 'electrician',
        experience: '4+ years experience',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RahulS',
        rating: 4.6,
        totalReviews: 112,
        minCharge: 180,
        isAvailable: true,
        isApproved: true,
        isActive: true,
        location: { lat: 28.6180, lng: 77.2000 },
        completedJobs: 189,
        createdAt: '2023-08-05'
    },
    {
        id: 'worker-5',
        name: 'Deepak Yadav',
        email: 'deepak.cleaner@example.com',
        phone: '+91 9988776605',
        password: 'worker123',
        skill: 'Cleaner',
        categoryId: 'cleaner',
        experience: '2+ years experience',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deepak',
        rating: 4.3,
        totalReviews: 67,
        minCharge: 299,
        isAvailable: true,
        isApproved: true,
        isActive: true,
        location: { lat: 28.6400, lng: 77.1900 },
        completedJobs: 98,
        createdAt: '2023-09-12'
    },
    {
        id: 'worker-6',
        name: 'Manoj Tiwari',
        email: 'manoj.actechnician@example.com',
        phone: '+91 9988776606',
        password: 'worker123',
        skill: 'AC Technician',
        categoryId: 'ac-technician',
        experience: '6+ years experience',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manoj',
        rating: 4.7,
        totalReviews: 198,
        minCharge: 350,
        isAvailable: true,
        isApproved: true,
        isActive: true,
        location: { lat: 28.6050, lng: 77.2250 },
        completedJobs: 345,
        createdAt: '2023-04-25'
    },
    {
        id: 'worker-7',
        name: 'Vijay Pandey',
        email: 'vijay.painter@example.com',
        phone: '+91 9988776607',
        password: 'worker123',
        skill: 'Painter',
        categoryId: 'painter',
        experience: '10+ years experience',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vijay',
        rating: 4.9,
        totalReviews: 312,
        minCharge: 500,
        isAvailable: false,
        isApproved: true,
        isActive: true,
        location: { lat: 28.6280, lng: 77.1950 },
        completedJobs: 567,
        createdAt: '2023-03-18'
    },
    {
        id: 'worker-8',
        name: 'Prakash Jha',
        email: 'prakash.repair@example.com',
        phone: '+91 9988776608',
        password: 'worker123',
        skill: 'Appliance Repair',
        categoryId: 'appliance',
        experience: '7+ years experience',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Prakash',
        rating: 4.4,
        totalReviews: 145,
        minCharge: 200,
        isAvailable: true,
        isApproved: true,
        isActive: true,
        location: { lat: 28.6320, lng: 77.2100 },
        completedJobs: 278,
        createdAt: '2023-07-01'
    },
    {
        id: 'worker-9',
        name: 'Arvind Mishra',
        email: 'arvind.pest@example.com',
        phone: '+91 9988776609',
        password: 'worker123',
        skill: 'Pest Control',
        categoryId: 'pest-control',
        experience: '4+ years experience',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arvind',
        rating: 4.6,
        totalReviews: 78,
        minCharge: 450,
        isAvailable: true,
        isApproved: true,
        isActive: true,
        location: { lat: 28.6150, lng: 77.2300 },
        completedJobs: 134,
        createdAt: '2023-08-20'
    },
    {
        id: 'worker-10',
        name: 'Ramesh Chauhan',
        email: 'ramesh.plumber@example.com',
        phone: '+91 9988776610',
        password: 'worker123',
        skill: 'Plumber',
        categoryId: 'plumber',
        experience: '5+ years experience',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ramesh',
        rating: 4.2,
        totalReviews: 56,
        minCharge: 175,
        isAvailable: false,
        isApproved: false,
        isActive: true,
        location: { lat: 28.6200, lng: 77.1800 },
        completedJobs: 89,
        createdAt: '2024-01-10'
    }
];

// Demo Bookings
const bookings = [
    {
        id: 'booking-1',
        oderId: 'QF-2024-001',
        userId: 'user-1',
        workerId: 'worker-1',
        categoryId: 'electrician',
        service: 'Fan repair',
        problemDescription: 'Ceiling fan making noise and not rotating properly. Also sparks coming from regulator.',
        preferredTime: 'As soon as possible',
        address: 'C-43, Shastri Nagar, Delhi',
        status: 'completed',
        createdAt: '2024-02-20T10:30:00',
        updatedAt: '2024-02-20T12:45:00',
        completedAt: '2024-02-20T12:45:00',
        price: 350
    },
    {
        id: 'booking-2',
        orderId: 'QF-2024-002',
        userId: 'user-2',
        workerId: 'worker-2',
        categoryId: 'plumber',
        service: 'Pipe leakage',
        problemDescription: 'Kitchen sink pipe is leaking badly. Water spreading on floor.',
        preferredTime: 'Today evening after 5 PM',
        address: 'B-22, Rajouri Garden, Delhi',
        status: 'ongoing',
        createdAt: '2024-02-25T14:00:00',
        updatedAt: '2024-02-25T15:30:00',
        price: 200
    },
    {
        id: 'booking-3',
        orderId: 'QF-2024-003',
        userId: 'user-3',
        workerId: 'worker-3',
        categoryId: 'carpenter',
        service: 'Door repair',
        problemDescription: 'Wardrobe door hinges broken. Door falling off.',
        preferredTime: 'Tomorrow morning',
        address: 'A-15, Laxmi Nagar, Delhi',
        status: 'accepted',
        createdAt: '2024-02-26T09:15:00',
        updatedAt: '2024-02-26T09:45:00',
        price: 400
    },
    {
        id: 'booking-4',
        orderId: 'QF-2024-004',
        userId: 'user-1',
        workerId: 'worker-6',
        categoryId: 'ac-technician',
        service: 'AC service',
        problemDescription: 'AC not cooling properly. Makes noise when started.',
        preferredTime: 'Weekend',
        address: 'C-43, Shastri Nagar, Delhi',
        status: 'pending',
        createdAt: '2024-02-27T16:20:00',
        updatedAt: '2024-02-27T16:20:00'
    },
    {
        id: 'booking-5',
        orderId: 'QF-2024-005',
        userId: 'user-4',
        workerId: 'worker-5',
        categoryId: 'cleaner',
        service: 'Full home cleaning',
        problemDescription: 'Full house deep cleaning needed. 3BHK apartment.',
        preferredTime: 'Next Monday',
        address: 'D-78, Dwarka Sector 12, Delhi',
        status: 'completed',
        createdAt: '2024-02-15T11:00:00',
        updatedAt: '2024-02-15T17:00:00',
        completedAt: '2024-02-15T17:00:00',
        price: 1500
    }
];

// Demo Reviews
const reviews = [
    {
        id: 'review-1',
        bookingId: 'booking-1',
        userId: 'user-1',
        workerId: 'worker-1',
        rating: 5,
        comment: 'Excellent work! Amit fixed the issue quickly and professionally. Very satisfied with the service.',
        createdAt: '2024-02-20T13:00:00'
    },
    {
        id: 'review-2',
        bookingId: 'booking-5',
        userId: 'user-4',
        workerId: 'worker-5',
        rating: 4,
        comment: 'Good cleaning service. House looks spotless now. Slightly late but overall good work.',
        createdAt: '2024-02-15T18:00:00'
    },
    {
        id: 'review-3',
        userId: 'user-2',
        workerId: 'worker-1',
        rating: 5,
        comment: 'Very professional and knowledgeable. Fixed multiple electrical issues in one visit. Highly recommend!',
        createdAt: '2024-01-25T14:30:00'
    },
    {
        id: 'review-4',
        userId: 'user-3',
        workerId: 'worker-2',
        rating: 4,
        comment: 'Good plumbing work. Reasonable pricing. Would definitely recommend to others.',
        createdAt: '2024-02-01T16:00:00'
    },
    {
        id: 'review-5',
        userId: 'user-5',
        workerId: 'worker-3',
        rating: 5,
        comment: 'Suresh is a master carpenter! Beautiful furniture work. Highly skilled and professional.',
        createdAt: '2024-02-10T11:00:00'
    }
];

// Admin credentials
const adminCredentials = {
    email: 'admin@quickfix.com',
    password: 'admin123',
    name: 'Admin User'
};

// ===== LocalStorage Helper Functions =====
function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function initializeData() {
    // Initialize data in localStorage if not present
    if (!getFromStorage('qf_users')) {
        saveToStorage('qf_users', users);
    }
    if (!getFromStorage('qf_workers')) {
        saveToStorage('qf_workers', workers);
    }
    if (!getFromStorage('qf_bookings')) {
        saveToStorage('qf_bookings', bookings);
    }
    if (!getFromStorage('qf_reviews')) {
        saveToStorage('qf_reviews', reviews);
    }
}

// Initialize on load
initializeData();

// ===== Data Access Functions =====
function getUsers() {
    return getFromStorage('qf_users') || users;
}

function getWorkers() {
    return getFromStorage('qf_workers') || workers;
}

function getBookings() {
    return getFromStorage('qf_bookings') || bookings;
}

function getReviews() {
    return getFromStorage('qf_reviews') || reviews;
}

function getUserById(id) {
    return getUsers().find(u => u.id === id);
}

function getWorkerById(id) {
    return getWorkers().find(w => w.id === id);
}

function getBookingById(id) {
    return getBookings().find(b => b.id === id);
}

function getWorkersByCategory(categoryId) {
    return getWorkers().filter(w => w.categoryId === categoryId && w.isApproved && w.isActive);
}

function getApprovedWorkers() {
    return getWorkers().filter(w => w.isApproved && w.isActive);
}

function getPendingWorkers() {
    return getWorkers().filter(w => !w.isApproved && w.isActive);
}

function getUserBookings(userId) {
    return getBookings().filter(b => b.userId === userId);
}

function getWorkerBookings(workerId) {
    return getBookings().filter(b => b.workerId === workerId);
}

function getWorkerReviews(workerId) {
    return getReviews().filter(r => r.workerId === workerId);
}

function getCategoryById(id) {
    return categories.find(c => c.id === id);
}

// ===== Auth Functions =====
function getCurrentUser() {
    return getFromStorage('qf_currentUser');
}

function setCurrentUser(user) {
    saveToStorage('qf_currentUser', user);
}

function logout() {
    localStorage.removeItem('qf_currentUser');
}

function loginUser(email, password) {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        setCurrentUser({ ...user, type: 'user' });
        return user;
    }
    return null;
}

function loginWorker(email, password) {
    const workers = getWorkers();
    const worker = workers.find(w => w.email === email && w.password === password);
    if (worker) {
        if (!worker.isApproved) {
            return { error: 'pending' };
        }
        setCurrentUser({ ...worker, type: 'worker' });
        return worker;
    }
    return null;
}

function loginAdmin(email, password) {
    if (email === adminCredentials.email && password === adminCredentials.password) {
        setCurrentUser({ ...adminCredentials, type: 'admin' });
        return adminCredentials;
    }
    return null;
}

function registerUser(userData) {
    const users = getUsers();
    const exists = users.find(u => u.email === userData.email);
    if (exists) return { error: 'Email already registered' };
    
    const newUser = {
        id: 'user-' + Date.now(),
        ...userData,
        createdAt: new Date().toISOString().split('T')[0],
        location: { lat: 28.6139, lng: 77.2090 }
    };
    users.push(newUser);
    saveToStorage('qf_users', users);
    setCurrentUser({ ...newUser, type: 'user' });
    return newUser;
}

function registerWorker(workerData) {
    const workers = getWorkers();
    const exists = workers.find(w => w.email === workerData.email);
    if (exists) return { error: 'Email already registered' };
    
    const category = getCategoryById(workerData.categoryId);
    const newWorker = {
        id: 'worker-' + Date.now(),
        ...workerData,
        skill: category ? category.name : workerData.skill,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${workerData.name}`,
        rating: 0,
        totalReviews: 0,
        minCharge: 200,
        isAvailable: false,
        isApproved: false,
        isActive: true,
        location: { lat: 28.6139, lng: 77.2090 },
        completedJobs: 0,
        createdAt: new Date().toISOString().split('T')[0]
    };
    workers.push(newWorker);
    saveToStorage('qf_workers', workers);
    return newWorker;
}

// ===== Booking Functions =====
function createBooking(bookingData) {
    const bookings = getBookings();
    const newBooking = {
        id: 'booking-' + Date.now(),
        orderId: 'QF-' + new Date().getFullYear() + '-' + String(bookings.length + 1).padStart(3, '0'),
        ...bookingData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    bookings.push(newBooking);
    saveToStorage('qf_bookings', bookings);
    return newBooking;
}

function updateBookingStatus(bookingId, status, price = null) {
    const bookings = getBookings();
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index !== -1) {
        bookings[index].status = status;
        bookings[index].updatedAt = new Date().toISOString();
        if (status === 'completed') {
            bookings[index].completedAt = new Date().toISOString();
            if (price) bookings[index].price = price;
        }
        saveToStorage('qf_bookings', bookings);
        return bookings[index];
    }
    return null;
}

// ===== Worker Functions =====
function updateWorkerAvailability(workerId, isAvailable) {
    const workers = getWorkers();
    const index = workers.findIndex(w => w.id === workerId);
    if (index !== -1) {
        workers[index].isAvailable = isAvailable;
        saveToStorage('qf_workers', workers);
        return workers[index];
    }
    return null;
}

function approveWorker(workerId) {
    const workers = getWorkers();
    const index = workers.findIndex(w => w.id === workerId);
    if (index !== -1) {
        workers[index].isApproved = true;
        saveToStorage('qf_workers', workers);
        return workers[index];
    }
    return null;
}

function rejectWorker(workerId) {
    const workers = getWorkers();
    const index = workers.findIndex(w => w.id === workerId);
    if (index !== -1) {
        workers[index].isActive = false;
        saveToStorage('qf_workers', workers);
        return workers[index];
    }
    return null;
}

// ===== Utility Functions =====
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 10) / 10;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

function generateId() {
    return Math.random().toString(36).substring(2, 15);
}

