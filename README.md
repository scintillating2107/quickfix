# 🔧 QuickFix - Real-Time Household Service Finder Platform

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14.0.4-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.3.3-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3.3.6-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
</p>

## 📖 Overview

**QuickFix** is a comprehensive real-time household service platform that connects customers with verified service professionals. The platform features three distinct portals:

- **👤 User App** - Browse services, book appointments, track workers, chat & pay
- **👷 Worker App** - Manage jobs, update status, track earnings, communicate
- **👨‍💼 Admin Panel** - Oversee operations, approve workers, manage bookings

## ✨ Features

### For Customers
- 🔍 Browse 10+ service categories (Electrician, Plumber, Carpenter, etc.)
- 📅 Multi-step appointment booking with calendar & time slots
- 📍 Real-time worker tracking
- 💬 In-app chat with service providers
- ⭐ Ratings & reviews system
- 💳 Multiple payment options (UPI, Card, Wallet, Cash)
- 🎫 Coupon & discount system

### For Workers
- 📊 Dashboard with earnings & statistics
- ✅ Accept/reject job requests
- 📤 Upload work files
- 💰 Track payments & transactions
- 🔔 Real-time notifications
- 💬 Chat with admin support

### For Admins
- 📈 Analytics dashboard with charts
- 👥 Worker approval & management
- 📋 Booking management
- 🔍 Filter by date, status, service type

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | Tailwind CSS, Radix UI |
| **State Management** | Zustand |
| **Icons** | Lucide React |
| **Utilities** | date-fns, clsx, tailwind-merge |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/scintillating2107/quickfix.git
   cd quickfix
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🔑 Demo Credentials

| Portal | Email | Password |
|--------|-------|----------|
| **User** | aditya@example.com | password123 |
| **Worker** | amit@demo.com | password123 |
| **Admin** | admin@quickfix.com | admin123 |

## 📱 Screenshots

### Homepage
- Modern hero section with search
- Service categories with colorful icons
- Most booked services carousel
- How it works section
- Customer testimonials

### User Dashboard
- Personalized greeting
- Service categories grid
- Nearby available workers
- Quick actions

### Worker Dashboard
- Earnings statistics
- Task management with status updates
- Payment history
- Notifications

### Admin Panel
- Analytics charts
- Worker approvals
- Booking management

## 📂 Project Structure

```
quickfix/
├── app/
│   ├── (admin)/          # Admin portal routes
│   ├── (user)/           # User portal routes
│   ├── (worker)/         # Worker portal routes
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/
│   └── ui/               # Reusable UI components
├── data/
│   └── mock-data.ts      # Demo data
├── lib/
│   ├── store.ts          # Zustand stores
│   └── utils.ts          # Utility functions
├── types/
│   └── index.ts          # TypeScript types
└── public/               # Static assets
```

## 🎯 Development Methodology

1. **Research & Analysis** - Market study, user personas, feature mapping
2. **UI/UX Design** - Wireframes, design system, high-fidelity mockups
3. **Development** - Component-based architecture, state management
4. **Testing & Deployment** - Functional testing, responsive design, optimization

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👨‍💻 Author

**Srishti Singh**
- GitHub: [@scintillating2107](https://github.com/scintillating2107)

---

<p align="center">Made with ❤️</p>

