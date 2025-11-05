import mongoose, { Document } from 'mongoose';

export interface IItem extends Document {
  name: string;
  category: string;
  unit: string;
  quantity: number;
  reorderThreshold: number;
  costPrice: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuditLog extends Document {
  itemId: mongoose.Types.ObjectId;
  action: 'add' | 'remove' | 'create' | 'update' | 'delete';
  quantityChange?: number;
  previousQuantity?: number;
  newQuantity?: number;
  userId: string;
  userName: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

// Item Schema
const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['dough', 'sauce', 'cheese', 'toppings', 'packaging', 'beverages', 'other'],
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['kg', 'g', 'l', 'ml', 'pcs', 'boxes'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
  },
  reorderThreshold: {
    type: Number,
    required: [true, 'Reorder threshold is required'],
    min: [0, 'Reorder threshold cannot be negative'],
  },
  costPrice: {
    type: Number,
    required: [true, 'Cost price is required'],
    min: [0, 'Cost price cannot be negative'],
  },
  createdBy: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Audit Log Schema
const AuditLogSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true,
  },
  action: {
    type: String,
    required: true,
    enum: ['create', 'update', 'delete', 'adjust', 'stock_add', 'stock_remove'],
  },
  previousQuantity: {
    type: Number,
  },
  newQuantity: {
    type: Number,
  },
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
}, {
  timestamps: true,
});

// This indexes for better query performance
ItemSchema.index({ name: 1 });
ItemSchema.index({ category: 1 });
ItemSchema.index({ createdBy: 1 });
AuditLogSchema.index({ itemId: 1, createdAt: -1 });

// This prevents model recompilation in development
export const Item = mongoose.models.Item || mongoose.model('Item', ItemSchema);
export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);