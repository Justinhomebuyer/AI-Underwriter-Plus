import { NextResponse } from 'next/server';
import { dossier } from '@/data/mock';

export async function POST(request: Request) {
  const body = await request.json();
  const subjectId: string = body.subjectId ?? dossier.subjectId;
  return NextResponse.json({ ...dossier, subjectId });
}
