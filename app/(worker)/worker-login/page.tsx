"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Wrench, Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles, Briefcase } from 'lucide-react';
import { useAuthStore, useWorkersStore } from '@/lib/store';

export default function WorkerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { setSession } = useAuthStore();
  const { getWorkerByEmail } = useWorkersStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const worker = getWorkerByEmail(email);
      
      if (!worker) {
        setError('No worker account found with this email');
        setLoading(false);
        return;
      }

      if (worker.password !== password) {
        setError('Incorrect password');
        setLoading(false);
        return;
      }

      if (!worker.isApproved) {
        setError('Your account is pending admin approval. Please wait.');
        setLoading(false);
        return;
      }

      setSession({
        userId: worker.id,
        userType: 'worker',
        name: worker.name,
        email: worker.email,
      });

      router.push('/worker-dashboard');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('amit.electrician@example.com');
    setPassword('worker123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fff7ed 100%)' }}>
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fadeIn">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Worker Login</h1>
          <p className="text-gray-600 mt-1">Access your professional dashboard</p>
        </div>

        <div className="auth-card animate-slideUp">
          {/* Demo Credentials Box */}
          <div className="demo-box">
            <h4 className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Demo Credentials
            </h4>
            <p>Email: amit.electrician@example.com</p>
            <p>Password: worker123</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm animate-fadeIn border border-red-100">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="form-input-icon">
                <Mail className="icon w-5 h-5" />
                <input
                  type="email"
                  className="form-input pl-11"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="form-input-icon relative">
                <Lock className="icon w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input pl-11 pr-11"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn w-full text-white"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
            >
              {loading ? (
                <>
                  <div className="spinner w-5 h-5" style={{ borderWidth: '2px', borderTopColor: '#fff' }} />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="btn btn-secondary w-full"
            >
              <Sparkles className="w-5 h-5" />
              Fill Demo Credentials
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Don&apos;t have an account? </span>
            <Link href="/worker-signup" className="text-orange-600 hover:underline font-semibold">
              Register as Worker
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm text-gray-500 hover:text-orange-600 transition-colors">
            Login as Customer →
          </Link>
        </div>
      </div>
    </div>
  );
}
