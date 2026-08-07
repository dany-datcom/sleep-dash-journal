import { auth } from '@/auth';
import { getUserInfo } from '@/lib/db';
import { NextResponse } from 'next/server';

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