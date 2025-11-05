'use client';

import { useEffect, useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { gsap } from 'gsap';
import { Plus, Search, Filter } from 'lucide-react';
import AddItemModal from '@/app/components/inventory/AddItemModal';
import InventoryList from '@/app/components/inventory/InventoryList';

export default function InventoryPage() {
  const { user, isLoaded } = useUser();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const pageRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animate page entrance
    if (pageRef.current && headerRef.current) {
      gsap.from(headerRef.current.children, {
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      });
    }
  }, []);

  useEffect(() => {
    if (isLoaded && user) {
      fetchItems();
    }
  }, [isLoaded, user]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/inventory');
      
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'All Items' },
    { value: 'dough', label: '🍞 Dough' },
    { value: 'sauce', label: '🍅 Sauce' },
    { value: 'cheese', label: '🧀 Cheese' },
    { value: 'toppings', label: '🥓 Toppings' },
    { value: 'packaging', label: '📦 Packaging' },
    { value: 'beverages', label: '🥤 Beverages' },
    { value: 'other', label: '📝 Other' },
  ];

  // Filter items based on search and category
  const filteredItems = items.filter((item: any) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="space-y-6">
      <div ref={headerRef} className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-500 mt-1">Manage your pizza shop inventory</p>
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
            <Plus size={20} />
            Add Item
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search items..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="relative sm:w-64">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all appearance-none bg-white cursor-pointer">
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading inventory...</p>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="text-6xl mb-4">
              {items.length === 0 ? '📦' : '🔍'}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {items.length === 0 ? 'No items yet' : 'No items found'}
            </h3>
            <p className="text-gray-500 text-center mb-6">
              {items.length === 0 
                ? 'Get started by adding your first inventory item'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {items.length === 0 && (
              <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                <Plus size={20} />
                Add First Item
              </button>
            )}
          </div>
        ) : (
          <InventoryList items={filteredItems} onRefresh={fetchItems} />
        )}
      </div>

      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchItems}
      />
    </div>
  );
}