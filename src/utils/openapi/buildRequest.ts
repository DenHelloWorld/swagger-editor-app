import type { ResolvedParameter } from '@/types/openapi';

/** Substitutes `{param}` path placeholders and appends query params, then resolves against `baseUrl`. */
export function buildUrl(
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

/** Builds header params, merging cookie params into a single `Cookie` header. */
export function buildHeaders(
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

function shellEscape(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

/** Builds a `curl` command from the current request state, ready to copy to clipboard. */
export function buildCurlCommand(
  method: string,
  url: string,
  headers: Record<string, string>,
  body?: string,
): string {
  const parts = [`curl -X ${method.toUpperCase()}`, shellEscape(url)];

  Object.entries(headers).forEach(([name, value]) => {
    parts.push('-H', shellEscape(`${name}: ${value}`));
  });

  if (body) {
    parts.push('--data', shellEscape(body));
  }

  return parts.join(' ');
}
