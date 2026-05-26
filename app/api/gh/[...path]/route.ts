import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const query = new URL(req.url).search;
    const url = `https://api.github.com/${path.join('/')}${query}`;

    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
    };
    const auth = req.headers.get('authorization');
    if (auth) headers['Authorization'] = auth;

    const githubRes = await fetch(url, { headers });
    const data = await githubRes.json();
    return NextResponse.json(data, { status: githubRes.status });
  } catch (error) {
    console.error('GitHub API proxy error:', error);
    return NextResponse.json({ error: 'Proxy Error' }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const query = new URL(req.url).search;
    const url = `https://api.github.com/${path.join('/')}${query}`;

    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': req.headers.get('content-type') || 'application/json',
    };
    const auth = req.headers.get('authorization');
    if (auth) headers['Authorization'] = auth;

    const body = await req.text();
    const githubRes = await fetch(url, {
      method: 'POST',
      headers,
      body: body || undefined,
    });
    const data = await githubRes.json();
    return NextResponse.json(data, { status: githubRes.status });
  } catch (error) {
    console.error('GitHub API proxy error:', error);
    return NextResponse.json({ error: 'Proxy Error' }, { status: 500 });
  }
}
