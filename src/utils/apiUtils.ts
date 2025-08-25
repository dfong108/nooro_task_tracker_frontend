import {NextRequest, NextResponse} from "next/server";

export function forwardHeaders(req: NextRequest, includeContentType = false): Record<string, string> {
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

export function responseFrom(res: Response, body: string) {
  return new NextResponse(body, {
    status: res.status,
    headers: { 'content-type': res.headers.get('content-type') ?? 'application/json' },
  });
}
