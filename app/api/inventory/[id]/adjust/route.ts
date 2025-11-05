import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import connectDB from '@/app/lib/db/mongodb';
import { Item, AuditLog } from '@/app/lib/db/models/Item';
import { z } from 'zod';

const adjustSchema = z.object({
  action: z.enum(['add', 'remove']),
  amount: z.number().positive('Amount must be positive'),
});

// POST - Adjust stock quantity
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await currentUser();
    const userName = user?.firstName && user?.lastName 
      ? `${user.firstName} ${user.lastName}`
      : user?.emailAddresses[0]?.emailAddress || 'Unknown User';

    await connectDB();

    const { id } = await params;

    const body = await request.json();
    const validatedData = adjustSchema.parse(body);

    // Get the current item
    const item = await Item.findById(id);
    
    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // SECURITY: Verify ownership
    if (item.createdBy !== userId) {
      return NextResponse.json(
        { error: 'Forbidden: You can only adjust your own items' },
        { status: 403 }
      );
    }

    const previousQuantity = item.quantity;
    let newQuantity: number;

    // Calculate new quantity
    if (validatedData.action === 'add') {
      newQuantity = previousQuantity + validatedData.amount;
    } else {
      newQuantity = previousQuantity - validatedData.amount;
      
      // Prevent negative stock
      if (newQuantity < 0) {
        return NextResponse.json(
          { error: 'Cannot remove more than current stock' },
          { status: 400 }
        );
      }
    }

    // Update item quantity
    item.quantity = newQuantity;
    await item.save();

    // Create audit log
    await AuditLog.create({
      itemId: item._id,
      action: validatedData.action === 'add' ? 'stock_add' : 'stock_remove',
      previousQuantity,
      newQuantity,
      userId,
      userName,
      metadata: {
        itemName: item.name,
        adjustmentAmount: validatedData.amount,
        action: validatedData.action,
      },
    });

    return NextResponse.json({
      success: true,
      item,
      previousQuantity,
      newQuantity,
      adjustment: validatedData.amount,
    });
  } catch (error: any) {
    console.error('Error adjusting stock:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to adjust stock' },
      { status: 500 }
    );
  }
}