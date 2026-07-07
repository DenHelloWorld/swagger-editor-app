import { useState } from 'react';
import type { ProcessedEndpoint } from '@/types/openapi';
import type { ProxyResponseBody } from '@/types/proxyTypes';
import { buildUrl, buildHeaders, buildCurlCommand } from '@/utils/openapi';

const BODY_METHODS = new Set(['POST', 'PUT', 'PATCH']);

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

    let url: string;
    try {
      url = buildUrl(baseUrl, endpoint.path, paramValues, endpoint.parameters);
    } catch {
      setError('Please enter a valid Server URL');
      setIsLoading(false);
      return;
    }

    try {
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

  function generateCurl(): string {
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

    return buildCurlCommand(
      endpoint.method,
      url,
      headers,
      hasBody && bodyValue ? bodyValue : undefined,
    );
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
    generateCurl,
    hasBody,
  };
}
