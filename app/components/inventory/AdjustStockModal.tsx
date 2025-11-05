'use client';

import { useEffect, useRef, useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { gsap } from 'gsap';

interface Item {
  _id: string;
  name: string;
  unit: string;
  quantity: number;
}

interface AdjustStockModalProps {
  isOpen: boolean;
  item: Item | null;
  action: 'add' | 'remove';
  onClose: () => void;
  onSuccess: () => void;
}

export default function AdjustStockModal({ isOpen, item, action, onClose, onSuccess }: AdjustStockModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (isOpen && modalRef.current && contentRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2 }
      );
      
      gsap.fromTo(
        contentRef.current,
        { scale: 0.9, y: 20, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );
    }
  }, [isOpen]);

  const handleClose = () => {
    if (modalRef.current && contentRef.current) {
      gsap.to(contentRef.current, {
        scale: 0.9,
        y: 20,
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
      });
      gsap.to(modalRef.current, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          onClose();
          setAmount('');
          setError('');
        },
      });
    } else {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    
    const adjustAmount = parseFloat(amount);
    if (isNaN(adjustAmount) || adjustAmount <= 0) {
      setError('Please enter a valid positive number');
      return;
    }

    if (action === 'remove' && adjustAmount > item.quantity) {
      setError(`Cannot remove more than current stock (${item.quantity} ${item.unit})`);
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`/api/inventory/${item._id}/adjust`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          amount: adjustAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to adjust stock');
      }

      if (modalRef.current && contentRef.current) {
        gsap.to(contentRef.current, {
          scale: 0.9,
          y: 20,
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in',
        });
        gsap.to(modalRef.current, {
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            onClose();
            setAmount('');
            setError('');
            onSuccess();
          },
        });
      } else {
        onClose();
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !item) return null;

  const isAdd = action === 'add';
  const Icon = isAdd ? Plus : Minus;
  const colorClasses = isAdd 
    ? 'from-green-500 to-emerald-600 focus:ring-green-500'
    : 'from-orange-500 to-red-600 focus:ring-orange-500';
  const bgColorClasses = isAdd ? 'bg-green-50' : 'bg-orange-50';

  return (
    <div ref={modalRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={handleClose}>
      <div ref={contentRef} className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className={`bg-gradient-to-r ${colorClasses} px-6 py-4 flex items-center justify-between rounded-t-2xl`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Icon size={20} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {isAdd ? 'Add Stock' : 'Remove Stock'}
            </h2>
          </div>
          <button onClick={handleClose} className="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className={`${bgColorClasses} rounded-xl p-4`}>
            <p className="text-sm text-gray-600 mb-1">Item</p>
            <p className="text-lg font-bold text-gray-900">{item.name}</p>
            <p className="text-sm text-gray-600 mt-2">Current Stock: <span className="font-semibold">{item.quantity} {item.unit}</span></p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {isAdd ? 'Amount to Add' : 'Amount to Remove'} *
            </label>
            <div className="relative">
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required min="0.01" step="0.01"
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 ${colorClasses.split(' ')[2]} focus:border-transparent outline-none transition-all text-lg`}
                placeholder="0.00"
                autoFocus
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                {item.unit}
              </span>
            </div>
          </div>

          {amount && !isNaN(parseFloat(amount)) && (
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">New Stock Level</p>
              <p className="text-2xl font-bold text-blue-600">
                {isAdd 
                  ? (item.quantity + parseFloat(amount)).toFixed(2)
                  : (item.quantity - parseFloat(amount)).toFixed(2)
                } {item.unit}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={handleClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className={`flex-1 px-6 py-3 bg-gradient-to-r ${colorClasses} text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}>
              {loading ? 'Processing...' : (isAdd ? 'Add Stock' : 'Remove Stock')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}