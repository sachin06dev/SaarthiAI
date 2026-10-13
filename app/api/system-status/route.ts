import { NextResponse } from 'next/server';
import { getPublicSystemStatus } from '@/lib/config';

export async function GET() {
  const status = getPublicSystemStatus();
  return NextResponse.json(status);
}
