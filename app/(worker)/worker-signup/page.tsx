"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Wrench, Mail, Lock, User, Phone, MapPin, ArrowRight, Eye, EyeOff,
  Briefcase, Clock, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useWorkersStore } from '@/lib/store';
import { categories } from '@/data/mock-data';
import { generateId } from '@/lib/utils';

export default function WorkerSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    skill: '',
    experience: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { addWorker, getWorkerByEmail } = useWorkersStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      if (getWorkerByEmail(formData.email)) {
        setError('An account with this email already exists');
        setLoading(false);
        return;
      }

      const selectedCategory = categories.find(c => c.name === formData.skill);

      const newWorker = {
        id: `worker-${generateId()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        skill: formData.skill,
        categoryId: selectedCategory?.id || 'cat-7',
        experience: formData.experience,
        profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
        rating: 0,
        totalReviews: 0,
        minCharge: 200,
        isAvailable: false,
        isApproved: false, // Needs admin approval
        isActive: true,
        location: { lat: 28.6139, lng: 77.2090 },
        createdAt: new Date().toISOString(),
      };

      addWorker(newWorker);
      setShowSuccess(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 flex items-center justify-center p-4 py-8">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-6 animate-fade-in">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Wrench className="w-6 h-6 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Join as Worker</h1>
          <p className="text-gray-600 mt-1">Register to offer your services</p>
        </div>

        <Card className="animate-slide-up">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl">Worker Registration</CardTitle>
            <CardDescription>Fill in your details to register</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-sm animate-fade-in">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <Input
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  icon={<User className="w-5 h-5" />}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  icon={<Mail className="w-5 h-5" />}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <Input
                  name="phone"
                  type="tel"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  icon={<Phone className="w-5 h-5" />}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Skill Category</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    name="skill"
                    value={formData.skill}
                    onChange={handleChange}
                    className="flex h-11 w-full rounded-xl border-2 border-gray-200 bg-white pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    required
                  >
                    <option value="">Select your skill</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Experience</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="flex h-11 w-full rounded-xl border-2 border-gray-200 bg-white pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    required
                  >
                    <option value="">Select experience</option>
                    <option value="Less than 1 year">Less than 1 year</option>
                    <option value="1-2 years experience">1-2 years</option>
                    <option value="2-3 years experience">2-3 years</option>
                    <option value="3-5 years experience">3-5 years</option>
                    <option value="5+ years experience">5+ years</option>
                    <option value="10+ years experience">10+ years</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    icon={<Lock className="w-5 h-5" />}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  icon={<Lock className="w-5 h-5" />}
                  required
                />
              </div>

              <Button type="submit" className="w-full gap-2 bg-orange-500 hover:bg-orange-600" disabled={loading}>
                {loading ? (
                  <>
                    <div className="w-5 h-5 spinner" />
                    Registering...
                  </>
                ) : (
                  <>
                    Register
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link href="/worker-login" className="text-orange-600 hover:underline font-medium">
                Sign In
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Success Dialog */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <DialogTitle className="text-xl">Registration Successful!</DialogTitle>
              <DialogDescription className="text-center">
                Your worker account has been created. Please wait for admin approval 
                before you can start accepting jobs.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2 mt-4">
              <Button onClick={() => router.push('/worker-login')}>
                Go to Login
              </Button>
              <Button variant="outline" onClick={() => router.push('/')}>
                Back to Home
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

