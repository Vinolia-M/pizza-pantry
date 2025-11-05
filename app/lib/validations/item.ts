import { z } from 'zod';

// Item validation schema
export const itemSchema = z.object({
  name: z
    .string()
    .min(1, 'Item name is required')
    .max(100, 'Item name cannot exceed 100 characters')
    .trim(),
  category: z.enum(['dough', 'sauce', 'cheese', 'toppings', 'packaging', 'beverages', 'other'], {
    message: 'Invalid category',
  }),
  unit: z.enum(['kg', 'g', 'l', 'ml', 'pcs', 'boxes'], {
    message: 'Invalid unit',
  }),
  quantity: z
    .number()
    .min(0, 'Quantity cannot be negative')
    .or(z.string().transform((val) => parseFloat(val)))
    .refine((val) => !isNaN(val as number) && val >= 0, 'Quantity must be a valid non-negative number'),
  reorderThreshold: z
    .number()
    .min(0, 'Reorder threshold cannot be negative')
    .or(z.string().transform((val) => parseFloat(val)))
    .refine((val) => !isNaN(val as number) && val >= 0, 'Reorder threshold must be a valid non-negative number'),
  costPrice: z
    .number()
    .min(0, 'Cost price cannot be negative')
    .or(z.string().transform((val) => parseFloat(val)))
    .refine((val) => !isNaN(val as number) && val >= 0, 'Cost price must be a valid non-negative number'),
});

// Quantity adjustment schema
export const adjustQuantitySchema = z.object({
  itemId: z.string().min(1, 'Item ID is required'),
  action: z.enum(['add', 'remove'], {
    message: 'Action must be either "add" or "remove"',
  }),
  amount: z
    .number()
    .positive('Amount must be positive')
    .or(z.string().transform((val) => parseFloat(val)))
    .refine((val) => !isNaN(val as number) && val > 0, 'Amount must be a valid positive number'),
});

// Types
export type ItemInput = z.infer<typeof itemSchema>;
export type AdjustQuantityInput = z.infer<typeof adjustQuantitySchema>;