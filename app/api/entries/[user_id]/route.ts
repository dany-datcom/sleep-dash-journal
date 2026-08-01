import { getEntries, createEntry} from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(_request: Request, { params }: { params: Promise<{ user_id: string }> }) {
  const id = await Number((await params).user_id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  }
  const entries = await getEntries(id);
  if (!entries) {
    return NextResponse.json({ error: 'Entries for user not found' }, { status: 404 });
  }
  return NextResponse.json(entries);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ user_id: string }> }
) {
  const id = Number((await params).user_id);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = await req.json();

  const entry = await createEntry(id, body);

  return NextResponse.json(entry, {
    status: 201,
  });
}

