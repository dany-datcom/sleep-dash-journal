import { auth } from '@/auth';
import { getEntries, createEntry } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(_request: Request, { params }: { params: Promise<{ user_id: string }> }) {
  const session = await auth();
  const id = await Number((await params).user_id);
  const sessionUserId = Number(session?.user?.id);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (sessionUserId !== id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const entries = await getEntries(id);
  return NextResponse.json(entries);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ user_id: string }> }
) {
  const session = await auth();
  const id = Number((await params).user_id);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  if (Number(session.user.id) !== id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await req.json();

  const entry = await createEntry(id, body);

  return NextResponse.json(entry, {
    status: 201,
  });
}

