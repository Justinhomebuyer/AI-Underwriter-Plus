import { NextResponse } from 'next/server';
import { rehab } from '@/data/mock';

export async function POST(request: Request) {
  const body = await request.json();
  const subjectId: string = body.subjectId ?? rehab.subjectId;
  return NextResponse.json({ ...rehab, subjectId });
}
