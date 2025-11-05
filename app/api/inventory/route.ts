import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import connectDB from '@/app/lib/db/mongodb';
import { Item, AuditLog } from '@/app/lib/db/models/Item';
import { itemSchema } from '@/app/lib/validations/item';

// GET - Fetch all items for current user
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const order = searchParams.get('order') === 'asc' ? 1 : -1;

    // Build query - IMPORTANT: Filter by current user
    let query: any = {
      createdBy: userId,
    };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Fetch items
    const items = await Item.find(query)
      .sort({ [sortBy]: order })
      .lean();

    return NextResponse.json({
      success: true,
      items,
      count: items.length,
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

// POST - Create new item
export async function POST(request: NextRequest) {
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

    const body = await request.json();

    // Validate input
    const validatedData = itemSchema.parse(body);

    // Create item with current user ID
    const item = await Item.create({
      ...validatedData,
      createdBy: userId,
    });

    // Create audit log
    await AuditLog.create({
      itemId: item._id,
      action: 'create',
      newQuantity: item.quantity,
      userId,
      userName,
      metadata: {
        itemName: item.name,
      },
    });

    return NextResponse.json({
      success: true,
      item,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating item:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create item' },
      { status: 500 }
    );
  }
}