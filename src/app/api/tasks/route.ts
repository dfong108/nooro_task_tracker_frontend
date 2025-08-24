import { NextRequest, NextResponse } from 'next/server';

const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN ?? 'http://localhost:PORT';

function forwardHeaders(req: NextRequest, includeContentType = false): Record<string, string> {
  const h: Record<string, string> = {};
  const auth = req.headers.get('authorization');
  const cookie = req.headers.get('cookie');
  const accept = req.headers.get('accept');
  if (auth) h['authorization'] = auth;
  if (cookie) h['cookie'] = cookie;
  if (accept) h['accept'] = accept;
  if (includeContentType) {
    const ct = req.headers.get('content-type');
    if (ct) h['content-type'] = ct;
  }
  return h;
}

function responseFrom(res: Response, body: string) {
  return new NextResponse(body, {
    status: res.status,
    headers: { 'content-type': res.headers.get('content-type') ?? 'application/json' },
  });
}

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
  const url = new URL(req.url);
  const target = `${BACKEND_ORIGIN}/api/tasks/${encodeURIComponent(params.id)}${url.search}`;
  const res = await fetch(target, {
    method: 'GET',
    headers: forwardHeaders(req),
    cache: 'no-store',
  });
  const body = await res.text();
  return responseFrom(res, body);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const url = new URL(req.url);
  const target = `${BACKEND_ORIGIN}/api/tasks/${encodeURIComponent(params.id)}${url.search}`;
  const body = await req.text();
  const res = await fetch(target, {
    method: 'PUT',
    headers: forwardHeaders(req, true),
    body,
  });
  const resBody = await res.text();
  return responseFrom(res, resBody);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const url = new URL(req.url);
  const target = `${BACKEND_ORIGIN}/api/tasks/${encodeURIComponent(params.id)}${url.search}`;
  const body = await req.text();
  const res = await fetch(target, {
    method: 'PATCH',
    headers: forwardHeaders(req, true),
    body,
  });
  const resBody = await res.text();
  return responseFrom(res, resBody);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const url = new URL(req.url);
  const target = `${BACKEND_ORIGIN}/api/tasks/${encodeURIComponent(params.id)}${url.search}`;
  const res = await fetch(target, {
    method: 'DELETE',
    headers: forwardHeaders(req),
  });
  const body = await res.text();
  return responseFrom(res, body);
}