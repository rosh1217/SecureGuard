import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'SecureGuard Backend is running', 
    timestamp: new Date().toISOString() 
  });
}
