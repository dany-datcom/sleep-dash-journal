import { auth } from '@/auth';
import { getUserInfo,updateUser } from '@/lib/db';
import { NextResponse } from 'next/server';
type RouteParams = {
  params: Promise<{ user_id: string }>;
};

export async function GET(_request: Request, { params }: { params: Promise<{ user_id: string }> }) {
  const session = await auth();
  const id = await Number((await params).user_id);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (Number(session.user.id) !== id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const user = await getUserInfo(id);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  return NextResponse.json(user);
}

export async function PUT(
  request: Request,
  { params }: RouteParams
) {
  const session = await auth();
  const id = Number((await params).user_id);

  if (Number.isNaN(id)) {
    return NextResponse.json(
      { error: 'Invalid id' },
      { status: 400 }
    );
  }

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  if (Number(session.user.id) !== id) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    const { first_name, last_name, email } = body;

    if (!first_name || !last_name || !email) {
      return NextResponse.json(
        { error: 'First name, last name and email are required' },
        { status: 400 }
      );
    }

    const updatedUser = await updateUser(
      id,
      first_name,
      last_name,
      email
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);

    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}