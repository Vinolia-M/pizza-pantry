'use client';

import { useEffect, useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { ArrowLeft, Clock, User, Package, TrendingUp, TrendingDown, Plus, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface AuditLog {
  _id: string;
  itemId: string;
  action: string;
  previousQuantity?: number;
  newQuantity?: number;
  userId: string;
  userName: string;
  metadata?: any;
  createdAt: string;
}

export default function AuditLogPage() {
  const { user, isLoaded } = useUser();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetchAuditLogs();
    }
  }, [isLoaded, user]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/audit');
      
      if (!response.ok) {
        throw new Error('Failed to fetch audit logs');
      }
      
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return <Plus className="text-green-600" size={20} />;
      case 'update':
        return <Edit className="text-blue-600" size={20} />;
      case 'delete':
        return <Trash2 className="text-red-600" size={20} />;
      case 'stock_add':
        return <TrendingUp className="text-green-600" size={20} />;
      case 'stock_remove':
        return <TrendingDown className="text-orange-600" size={20} />;
      default:
        return <Package className="text-gray-600" size={20} />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'bg-green-50 border-green-200';
      case 'update':
        return 'bg-blue-50 border-blue-200';
      case 'delete':
        return 'bg-red-50 border-red-200';
      case 'stock_add':
        return 'bg-green-50 border-green-200';
      case 'stock_remove':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'create':
        return 'Created Item';
      case 'update':
        return 'Updated Item';
      case 'delete':
        return 'Deleted Item';
      case 'stock_add':
        return 'Added Stock';
      case 'stock_remove':
        return 'Removed Stock';
      default:
        return action;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.action === filter);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/inventory" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors">
            <ArrowLeft size={20} />
            Back to Inventory
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Audit Log</h1>
          <p className="text-gray-500 mt-1">Track all inventory changes and activities</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-2">
        <div className="flex gap-2 overflow-x-auto">
          {[
            { value: 'all', label: 'All Activities' },
            { value: 'create', label: 'Created' },
            { value: 'update', label: 'Updated' },
            { value: 'stock_add', label: 'Stock Added' },
            { value: 'stock_remove', label: 'Stock Removed' },
            { value: 'delete', label: 'Deleted' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                filter === tab.value
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading audit logs...</p>
            </div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No activity yet
            </h3>
            <p className="text-gray-500 text-center">
              {filter === 'all' 
                ? 'Audit logs will appear here as you make changes to your inventory'
                : `No ${filter} activities found`
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredLogs.map((log) => (
              <div key={log._id} className={`p-6 hover:bg-gray-50 transition-colors border-l-4 ${getActionColor(log.action)}`}>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                    {getActionIcon(log.action)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{getActionText(log.action)}</p>
                        <p className="text-lg font-bold text-gray-900 mt-1">{log.metadata?.itemName || 'Unknown Item'}</p>
                      </div>
                      
                      {(log.action === 'stock_add' || log.action === 'stock_remove' || log.action === 'update') && (
                        <div className="text-right">
                          {log.previousQuantity !== undefined && log.newQuantity !== undefined && (
                            <>
                              <p className="text-sm text-gray-500">Quantity</p>
                              <p className="text-lg font-bold">
                                <span className="text-gray-400">{log.previousQuantity}</span>
                                {' → '}
                                <span className={
                                  log.newQuantity > log.previousQuantity 
                                    ? 'text-green-600' 
                                    : log.newQuantity < log.previousQuantity
                                    ? 'text-orange-600'
                                    : 'text-gray-900'
                                }>
                                  {log.newQuantity}
                                </span>
                              </p>
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    {log.metadata?.adjustmentAmount && (
                      <p className="text-sm text-gray-600 mt-2">Amount: {log.action === 'stock_add' ? '+' : '-'}{log.metadata.adjustmentAmount}</p>
                    )}

                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User size={14} />
                        <span>{log.userName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>{formatDate(log.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}