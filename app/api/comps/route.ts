import { NextResponse } from 'next/server';
import { comps } from '@/data/mock';

export async function POST(request: Request) {
  const body = await request.json();
  const subjectId: string = body.subjectId ?? comps.subjectId;
  return NextResponse.json({ ...comps, subjectId });
}
