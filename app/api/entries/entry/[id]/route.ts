import { auth } from '@/auth';
import { deleteEntry, updateEntry, getEntryById } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const id = await Number((await params).id);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const entry = await getEntryById(id);
  if (!entry) {
    return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
  }

  if (Number(entry.user_id) !== Number(session.user.id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json(entry);

  
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const id = Number((await params).id);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();

  const updated = await updateEntry(
  id,
  body,
  Number(session.user.id)
);

  if (!updated) {
    return NextResponse.json(
      { error: "Entry not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const id = Number((await params).id);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const deleted = await deleteEntry(id, Number(session.user.id));

  if (!deleted) {
    return NextResponse.json(
      { error: "Entry not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}
