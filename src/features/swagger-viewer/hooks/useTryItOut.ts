import { useState } from 'react';
import type { ProcessedEndpoint, ResolvedParameter } from '@/types/openapi';
import type { ProxyResponseBody } from '@/types/proxyTypes';
import { useSchemaStore } from '@/store/schemaStore';
import { isHttpUrl } from '@/utils/url';

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

function getMissingRequired(
  params: ResolvedParameter[],
  paramValues: Record<string, string>,
): string[] {
  return params
    .filter((p) => p.in === 'path' && p.required && !paramValues[p.name])
    .map((p) => p.name);
}

export function useTryItOut(endpoint: ProcessedEndpoint) {
  const hasBody = BODY_METHODS.has(endpoint.method.toUpperCase());
  const specBaseUrl = useSchemaStore((s) => s.processedSpec?.baseUrl ?? '');
  const [baseUrl, setBaseUrl] = useState(() =>
    isHttpUrl(specBaseUrl) ? specBaseUrl : '',
  );
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
    if (!isHttpUrl(baseUrl)) {
      setError('Server URL must be a valid http:// or https:// URL');
      return;
    }

    const missing = getMissingRequired(endpoint.parameters, paramValues);
    if (missing.length) {
      setError(`Required path parameters are missing: ${missing.join(', ')}`);
      return;
    }

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
        const errData: { error: string } = await res.json();
        setError(errData.error);
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
