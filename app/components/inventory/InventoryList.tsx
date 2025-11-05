'use client';

import {useRef, useState } from 'react';
import { Package, Edit, Trash2, AlertCircle, TrendingDown, TrendingUp } from 'lucide-react';
import EditItemModal from './EditItemModal';
import AdjustStockModal from './AdjustStockModal';
import DeleteConfirmModal from './DeleteConfirmModal';

interface Item {
  _id: string;
  name: string;
  category: string;
  unit: string;
  quantity: number;
  reorderThreshold: number;
  costPrice: number;
  createdAt: string;
  updatedAt: string;
}

interface InventoryListProps {
  items: Item[];
  onRefresh: () => void;
}

const categoryEmojis: { [key: string]: string } = {
  dough: '🍞',
  sauce: '🍅',
  cheese: '🧀',
  toppings: '🥓',
  packaging: '📦',
  beverages: '🥤',
  other: '📝',
};

const categoryColors: { [key: string]: string } = {
  dough: 'from-amber-500 to-yellow-600',
  sauce: 'from-red-500 to-rose-600',
  cheese: 'from-yellow-400 to-orange-500',
  toppings: 'from-pink-500 to-red-600',
  packaging: 'from-blue-500 to-indigo-600',
  beverages: 'from-cyan-500 to-blue-600',
  other: 'from-gray-500 to-slate-600',
};

export default function InventoryList({ items, onRefresh }: InventoryListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [editItem, setEditItem] = useState<Item | null>(null);
  const [deleteItem, setDeleteItem] = useState<Item | null>(null);
  const [adjustItem, setAdjustItem] = useState<Item | null>(null);
  const [adjustAction, setAdjustAction] = useState<'add' | 'remove'>('add');

  const isLowStock = (quantity: number, threshold: number) => {
    return quantity <= threshold;
  };

  const getStockStatus = (quantity: number, threshold: number) => {
    if (quantity === 0) {
      return { text: 'Out of Stock', color: 'text-red-600', bgColor: 'bg-red-50', icon: AlertCircle };
    }
    if (quantity <= threshold) {
      return { text: 'Low Stock', color: 'text-orange-600', bgColor: 'bg-orange-50', icon: TrendingDown };
    }
    return { text: 'In Stock', color: 'text-green-600', bgColor: 'bg-green-50', icon: TrendingUp };
  };

  const handleEdit = (item: Item) => {
    setEditItem(item);
  };

  const handleDelete = (item: Item) => {
    setDeleteItem(item);
  };

  const handleAddStock = (item: Item) => {
    setAdjustItem(item);
    setAdjustAction('add');
  };

  const handleRemoveStock = (item: Item) => {
    setAdjustItem(item);
    setAdjustAction('remove');
  };

  return (
    <>
      <div ref={listRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {items.map((item) => {
          const status = getStockStatus(item.quantity, item.reorderThreshold);
          const StatusIcon = status.icon;

          return (
            <div key={item._id}
              className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-orange-300 hover:-translate-y-1">
              <div className={`h-2 bg-gradient-to-r ${categoryColors[item.category]}`} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${categoryColors[item.category]} flex items-center justify-center text-3xl shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                    {categoryEmojis[item.category]}
                  </div>
                  
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onClick={() => handleEdit(item)} className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors" title="Edit item">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(item)} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors" title="Delete item">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">{item.name}</h3>

                <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-600 mb-4">
                  <Package size={12} />
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Quantity</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {item.quantity}
                      <span className="text-sm font-normal text-gray-500 ml-1">{item.unit}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Cost Price</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ${item.costPrice.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className={`flex items-center gap-2 px-4 py-2 ${status.bgColor} rounded-lg`}>
                  <StatusIcon size={16} className={status.color} />
                  <span className={`text-sm font-semibold ${status.color}`}>
                    {status.text}
                  </span>
                  {isLowStock(item.quantity, item.reorderThreshold) && (
                    <span className="text-xs text-gray-600 ml-auto">
                      Reorder at {item.reorderThreshold}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <button onClick={() => handleAddStock(item)}
                    className="flex-1 px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 font-semibold rounded-lg transition-colors text-sm">
                    + Add Stock
                  </button>
                  <button onClick={() => handleRemoveStock(item)}
                    className="flex-1 px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold rounded-lg transition-colors text-sm">
                    - Remove
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <EditItemModal
        isOpen={!!editItem}
        item={editItem}
        onClose={() => setEditItem(null)}
        onSuccess={onRefresh}
      />

      <AdjustStockModal
        isOpen={!!adjustItem}
        item={adjustItem}
        action={adjustAction}
        onClose={() => setAdjustItem(null)}
        onSuccess={onRefresh}
      />

      <DeleteConfirmModal
        isOpen={!!deleteItem}
        item={deleteItem}
        onClose={() => setDeleteItem(null)}
        onSuccess={onRefresh}
      />
    </>
  );
}