import { NextRequest, NextResponse } from 'next/server';
import { ProxyResponseBody } from '@/types/proxyTypes';
import { proxyPostRequestSchema } from '@/lib/proxy/schema';
import { getUserIdFromSession } from '@/lib/auth/getUserIdFromSession';
import { saveRequestRecord } from '@/lib/db/request-records';

const HOP_BY_HOP = new Set([
  'host',
  'connection',
  'transfer-encoding',
  'te',
  'trailer',
  'upgrade',
]);

function filterHeaders(
  headers: Record<string, string>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(headers).filter(
      ([key]) => !HOP_BY_HOP.has(key.toLowerCase()),
    ),
  ) as Record<string, string>;
}

async function fetchExternal(
  url: string,
  method: string,
  headers: Record<string, string>,
  body?: string,
): Promise<{ response: Response; text: string; durationMs: number }> {
  const startTime = Date.now();
  const response = await fetch(url, { method, headers, body });
  const text = await response.text();
  return { response, text, durationMs: Date.now() - startTime };
}

function buildResponseHeaders(response: Response): Record<string, string> {
  const headers: Record<string, string> = {};
  response.headers.forEach((value, key) => {
    headers[key] = value;
  });
  return filterHeaders(headers);
}

export async function POST(req: NextRequest) {
  let raw: unknown;

  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = proxyPostRequestSchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.issues },
      { status: 400 },
    );
  }

  const { url, method, headers, body, endpoint } = parsed.data;

  let response: Response;
  let text: string;
  let durationMs: number;

  try {
    ({ response, text, durationMs } = await fetchExternal(
      url,
      method,
      filterHeaders(headers ?? {}),
      body,
    ));
  } catch (err) {
    const errorDetails = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: 'Bad Gateway', errorDetails },
      { status: 502 },
    );
  }

  const userId = await getUserIdFromSession();
  if (userId) {
    void saveRequestRecord(userId, {
      method,
      url,
      endpoint: endpoint ?? url,
      statusCode: response.status,
      durationMs,
      requestSize: body?.length ?? 0,
      responseSize: text.length,
      timestamp: new Date().toISOString(),
    });
  }

  const result: ProxyResponseBody = {
    status: response.status,
    headers: buildResponseHeaders(response),
    body: text,
  };

  return NextResponse.json(result);
}
