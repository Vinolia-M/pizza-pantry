'use client';

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { gsap } from 'gsap';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddItemModal({ isOpen, onClose, onSuccess }: AddItemModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'other',
    unit: 'pcs',
    quantity: '',
    reorderThreshold: '',
    costPrice: '',
  });

  useEffect(() => {
    if (isOpen && modalRef.current && contentRef.current) {
      // Animation for modal entrance
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
          setFormData({
            name: '',
            category: 'other',
            unit: 'pcs',
            quantity: '',
            reorderThreshold: '',
            costPrice: '',
          });
          setError('');
        },
      });
    } else {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          quantity: parseFloat(formData.quantity),
          reorderThreshold: parseFloat(formData.reorderThreshold),
          costPrice: parseFloat(formData.costPrice),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create item');
      }

      // Close modal, then refresh items
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
            setFormData({
              name: '',
              category: 'other',
              unit: 'pcs',
              quantity: '',
              reorderThreshold: '',
              costPrice: '',
            });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  return (
    <div ref={modalRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={handleClose}>
      <div ref={contentRef} className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white">Add New Item</h2>
          <button onClick={handleClose} className="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g., Mozzarella Cheese"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all bg-white">
                <option value="dough">🍞 Dough</option>
                <option value="sauce">🍅 Sauce</option>
                <option value="cheese">🧀 Cheese</option>
                <option value="toppings">🥓 Toppings</option>
                <option value="packaging">📦 Packaging</option>
                <option value="beverages">🥤 Beverages</option>
                <option value="other">📝 Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Unit *</label>
              <select name="unit" value={formData.unit} onChange={handleChange} required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all bg-white">
                <option value="kg">Kilograms (kg)</option>
                <option value="g">Grams (g)</option>
                <option value="l">Liters (l)</option>
                <option value="ml">Milliliters (ml)</option>
                <option value="pcs">Pieces (pcs)</option>
                <option value="boxes">Boxes</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity *</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Reorder Alert</label>
              <input type="number" name="reorderThreshold" value={formData.reorderThreshold} onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                placeholder="10"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Cost Price ($)</label>
              <input type="number" name="costPrice" value={formData.costPrice} onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={handleClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
              {loading ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}