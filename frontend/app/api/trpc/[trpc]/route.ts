import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  return proxyRequest(req);
}

export async function POST(req: NextRequest) {
  return proxyRequest(req);
}

async function proxyRequest(req: NextRequest) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const targetUrl = `${backendUrl}${req.nextUrl.pathname}${req.nextUrl.search}`;
  const headers = new Headers(req.headers);
  headers.delete('host');
  headers.delete('content-length');

  const init: RequestInit = {
    method: req.method,
    headers,
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = await req.arrayBuffer();
  }

  const response = await fetch(targetUrl, init);
  const nextResponse = new NextResponse(response.body, {
    status: response.status,
    headers: response.headers,
  });

  const setCookie = response.headers.get('set-cookie');
  if (setCookie) {
    nextResponse.headers.set('set-cookie', setCookie);
  }

  return nextResponse;
}
