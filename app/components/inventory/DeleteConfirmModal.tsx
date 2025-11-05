'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { gsap } from 'gsap';

interface Item {
  _id: string;
  name: string;
}

interface DeleteConfirmModalProps {
  isOpen: boolean;
  item: Item | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteConfirmModal({ isOpen, item, onClose, onSuccess }: DeleteConfirmModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
          setError('');
        },
      });
    } else {
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!item) return;
    
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`/api/inventory/${item._id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete item');
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

  return (
    <div ref={modalRef} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={handleClose}>
      <div ref={contentRef} className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <AlertTriangle size={20} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Delete Item</h2>
          </div>
          <button onClick={handleClose} className="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={32} className="text-red-600" />
            </div>
            
            <div>
              <p className="text-lg text-gray-900 mb-2">Are you sure you want to delete</p>
              <p className="text-xl font-bold text-gray-900 mb-2">"{item.name}"?</p>
              <p className="text-sm text-gray-600">This action cannot be undone. All data associated with this item will be permanently removed.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={handleClose} disabled={loading}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50">
              Cancel
            </button>
            <button onClick={handleDelete} disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
              {loading ? 'Deleting...' : 'Delete Item'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}