import { useState } from 'react';
import type { ProcessedEndpoint, ResolvedParameter } from '@/types/openapi';
import type { ProxyResponseBody } from '@/types/proxyTypes';

const BODY_METHODS = new Set(['POST', 'PUT', 'PATCH']);

function buildUrl(
  baseUrl: string,
  path: string,
  paramValues: Record<string, string>,
  params: ResolvedParameter[],
): string {
  const withPathParams = path
    .replace(/\{(\w+)\}/g, (_, name: string) =>
      encodeURIComponent(paramValues[name] ?? ''),
    )
    .replace(/^\//, '');

  const url = new URL(
    withPathParams,
    baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`,
  );

  params
    .filter((p) => p.in === 'query' && paramValues[p.name])
    .forEach((p) => url.searchParams.set(p.name, paramValues[p.name]));

  return url.toString();
}

function buildHeaders(
  paramValues: Record<string, string>,
  params: ResolvedParameter[],
): Record<string, string> {
  const headerParams = Object.fromEntries(
    params
      .filter((p) => p.in === 'header' && paramValues[p.name])
      .map((p) => [p.name, paramValues[p.name]]),
  );

  const cookieParts = params
    .filter((p) => p.in === 'cookie' && paramValues[p.name])
    .map((p) => `${p.name}=${encodeURIComponent(paramValues[p.name])}`);

  return {
    ...headerParams,
    ...(cookieParts.length ? { Cookie: cookieParts.join('; ') } : {}),
  };
}

export function useTryItOut(endpoint: ProcessedEndpoint) {
  const hasBody = BODY_METHODS.has(endpoint.method.toUpperCase());
  const [baseUrl, setBaseUrl] = useState('');
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [bodyValue, setBodyValue] = useState(() =>
    endpoint.requestBody?.example
      ? JSON.stringify(endpoint.requestBody.example, null, 2)
      : '',
  );
  const [response, setResponse] = useState<ProxyResponseBody | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setParamValue(name: string, value: string) {
    setParamValues((prev) => ({ ...prev, [name]: value }));
  }

  async function execute() {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const url = buildUrl(
        baseUrl,
        endpoint.path,
        paramValues,
        endpoint.parameters,
      );
      const headers = {
        ...buildHeaders(paramValues, endpoint.parameters),
        ...(hasBody && bodyValue
          ? {
              'Content-Type':
                endpoint.requestBody?.contentType ?? 'application/json',
            }
          : {}),
      };

      const res = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          method: endpoint.method,
          headers,
          body: hasBody && bodyValue ? bodyValue : undefined,
          endpoint: endpoint.path,
        }),
      });

      if (!res.ok) {
        const errData: { error: string; errorDetails?: string } =
          await res.json();
        setError(errData.errorDetails ?? errData.error);
        return;
      }

      const data: ProxyResponseBody = await res.json();
      let body = data.body;
      try {
        body = JSON.stringify(JSON.parse(data.body), null, 2);
      } catch {}
      setResponse({ ...data, body });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Request failed');
    } finally {
      setIsLoading(false);
    }
  }

  return {
    baseUrl,
    setBaseUrl,
    paramValues,
    setParamValue,
    bodyValue,
    setBodyValue,
    response,
    isLoading,
    error,
    execute,
    hasBody,
  };
}
