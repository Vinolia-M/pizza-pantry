import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/app/lib/db/mongodb';
import { AuditLog } from '@/app/lib/db/models/Item';

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
    const action = searchParams.get('action');
    const itemId = searchParams.get('itemId');
    const limit = parseInt(searchParams.get('limit') || '100');

    // Build query - filter by current user
    let query: any = {
      userId, 
    };

    if (action && action !== 'all') {
      query.action = action;
    }

    if (itemId) {
      query.itemId = itemId;
    }

    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      logs,
      count: logs.length,
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    );
  }
}