import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import connectDB from '@/app/lib/db/mongodb';
import { Item, AuditLog } from '@/app/lib/db/models/Item';
import { itemSchema } from '@/app/lib/validations/item';

// PUT - Update item
export async function PUT(
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
    const validatedData = itemSchema.parse(body);

    // Get the old item to track changes
    const oldItem = await Item.findById(id);
    if (!oldItem) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    // SECURITY: Verify ownership
    if (oldItem.createdBy !== userId) {
      return NextResponse.json(
        { error: 'Forbidden: You can only update your own items' },
        { status: 403 }
      );
    }

    // Update item
    const item = await Item.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, runValidators: true }
    );

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found after update' },
        { status: 404 }
      );
    }

    // Create audit log
    await AuditLog.create({
      itemId: item._id,
      action: 'update',
      previousQuantity: oldItem.quantity,
      newQuantity: item.quantity,
      userId,
      userName,
      metadata: {
        itemName: item.name,
        changes: {
          name: oldItem.name !== item.name ? { from: oldItem.name, to: item.name } : undefined,
          category: oldItem.category !== item.category ? { from: oldItem.category, to: item.category } : undefined,
          unit: oldItem.unit !== item.unit ? { from: oldItem.unit, to: item.unit } : undefined,
          quantity: oldItem.quantity !== item.quantity ? { from: oldItem.quantity, to: item.quantity } : undefined,
          reorderThreshold: oldItem.reorderThreshold !== item.reorderThreshold ? { from: oldItem.reorderThreshold, to: item.reorderThreshold } : undefined,
          costPrice: oldItem.costPrice !== item.costPrice ? { from: oldItem.costPrice, to: item.costPrice } : undefined,
        },
      },
    });

    return NextResponse.json({
      success: true,
      item,
    });
  } catch (error: any) {
    console.error('Error updating item:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update item' },
      { status: 500 }
    );
  }
}

// DELETE - Delete item
export async function DELETE(
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
        { error: 'Forbidden: You can only delete your own items' },
        { status: 403 }
      );
    }

    // Create audit log before deletion
    await AuditLog.create({
      itemId: item._id,
      action: 'delete',
      previousQuantity: item.quantity,
      userId,
      userName,
      metadata: {
        itemName: item.name,
        itemData: item.toObject(),
      },
    });

    // Delete item
    await Item.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Item deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting item:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete item' },
      { status: 500 }
    );
  }
}