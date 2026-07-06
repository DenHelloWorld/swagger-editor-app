import { NextRequest, NextResponse } from 'next/server';
import { ProxyResponseBody } from '@/types/proxyTypes';
import { RequestRecordInput } from '@/types/dbTypes';
import { proxyPostRequestSchema } from '@/lib/proxy/schema';
import { getUserIdFromSession } from '@/lib/auth/getUserIdFromSession';
import { saveRequestRecord } from '@/lib/db/request-records';

/**
 * Best-effort history write for the authenticated user. Never throws —
 * a failed write must not mask the real proxy response/error.
 */
async function recordHistory(record: RequestRecordInput): Promise<void> {
  const userId = await getUserIdFromSession();
  if (!userId) return;
  try {
    await saveRequestRecord(userId, record);
  } catch {
    // best-effort — the caller's response already reflects the real outcome
  }
}

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
  try {
    const response = await fetch(url, { method, headers, body });
    const text = await response.text();
    return { response, text, durationMs: Date.now() - startTime };
  } catch (err) {
    throw Object.assign(err as Error, { durationMs: Date.now() - startTime });
  }
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
    const message = err instanceof Error ? err.message : String(err);
    const cause =
      err instanceof Error && err.cause instanceof Error
        ? `: ${err.cause.message}`
        : '';
    const errorDetails = `${message}${cause}`;
    const errDurationMs =
      (err as Error & { durationMs?: number }).durationMs ?? 0;

    await recordHistory({
      method,
      url,
      endpoint: endpoint ?? url,
      statusCode: 0,
      durationMs: errDurationMs,
      requestSize: body?.length ?? 0,
      responseSize: 0,
      errorDetails,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { error: 'Bad Gateway', errorDetails: 'Failed to reach the target URL' },
      { status: 502 },
    );
  }

  await recordHistory({
    method,
    url,
    endpoint: endpoint ?? url,
    statusCode: response.status,
    durationMs,
    requestSize: body?.length ?? 0,
    responseSize: text.length,
    timestamp: new Date().toISOString(),
  });

  const result: ProxyResponseBody = {
    status: response.status,
    headers: buildResponseHeaders(response),
    body: text,
  };

  return NextResponse.json(result);
}
