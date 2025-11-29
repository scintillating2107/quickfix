"use client";

import { useState } from 'react';
import { X, CreditCard, Smartphone, Banknote, CheckCircle, Tag } from 'lucide-react';
import { validateCoupon } from '@/data/mock-data';

interface PaymentModalProps {
  amount: number;
  onClose: () => void;
  onPaymentComplete: (method: string) => void;
}

const paymentMethods = [
  { id: 'upi', name: 'UPI Payment', icon: Smartphone, subtitle: 'GPay, PhonePe, Paytm' },
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, subtitle: 'Visa, Mastercard, RuPay' },
  { id: 'cash', name: 'Cash on Service', icon: Banknote, subtitle: 'Pay after completion' },
];

export function PaymentModal({ amount, onClose, onPaymentComplete }: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleApplyCoupon = () => {
    const result = validateCoupon(couponCode, amount);
    setCouponMessage(result.message);
    if (result.valid) {
      setDiscount(result.discount);
    }
  };

  const handlePayment = async () => {
    if (!selectedMethod) return;
    
    setProcessing(true);
    
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setProcessing(false);
    setSuccess(true);
    
    setTimeout(() => {
      onPaymentComplete(selectedMethod);
    }, 1500);
  };

  const finalAmount = amount - discount;

  if (success) {
    return (
      <div className="modal-overlay">
        <div className="modal p-8 text-center">
          <div className="w-20 h-20 gradient-success rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-soft">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Payment Successful!</h3>
          <p className="text-[var(--text-secondary)]">Your booking has been confirmed</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)]">
          <h3 className="text-lg font-semibold">Complete Payment</h3>
          <button onClick={onClose} className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Coupon Input */}
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
              Have a coupon?
            </label>
            <div className={`coupon-input ${discount > 0 ? 'valid' : ''}`}>
              <Tag className="w-5 h-5 text-[var(--text-tertiary)]" />
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                className="flex-1 bg-transparent outline-none"
              />
              <button
                onClick={handleApplyCoupon}
                className="px-4 py-2 text-sm font-medium text-[var(--primary)] hover:bg-[var(--primary-50)] rounded-lg"
              >
                Apply
              </button>
            </div>
            {couponMessage && (
              <p className={`text-sm mt-2 ${discount > 0 ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}>
                {couponMessage}
              </p>
            )}
          </div>

          {/* Payment Methods */}
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] mb-3 block">
              Select Payment Method
            </label>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`payment-option ${selectedMethod === method.id ? 'selected' : ''}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] flex items-center justify-center">
                    <method.icon className="w-6 h-6 text-[var(--primary)]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-[var(--text-primary)]">{method.name}</p>
                    <p className="text-sm text-[var(--text-tertiary)]">{method.subtitle}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 ${
                      selectedMethod === method.id
                        ? 'border-[var(--primary)] bg-[var(--primary)]'
                        : 'border-[var(--border-color)]'
                    }`}
                  >
                    {selectedMethod === method.id && (
                      <CheckCircle className="w-full h-full text-white" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Amount Summary */}
          <div className="bg-[var(--bg-secondary)] rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--text-secondary)]">Service Amount</span>
              <span>₹{amount}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-[var(--success)]">
                <span>Discount</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <hr className="border-[var(--border-color)]" />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-[var(--primary)]">₹{finalAmount}</span>
            </div>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={!selectedMethod || processing}
            className="btn btn-primary w-full"
          >
            {processing ? (
              <>
                <div className="spinner spinner-sm" style={{ borderTopColor: 'white' }} />
                Processing...
              </>
            ) : (
              `Pay ₹${finalAmount}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

