import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Simple heuristic placeholder from original backend
    const isSuspicious = url.toLowerCase().includes('secure') || 
                       url.toLowerCase().includes('verify') ||
                       url.toLowerCase().includes('bank');
    
    return NextResponse.json({ 
      url, 
      safe: !isSuspicious, 
      score: isSuspicious ? 70 : 10 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
