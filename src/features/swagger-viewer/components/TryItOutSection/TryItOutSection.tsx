'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { ProcessedEndpoint } from '@/types/openapi';
import { Play, X, Send, Loader2, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTryItOut } from '../../hooks/useTryItOut';
import styles from './TryItOutSection.module.css';

type Props = {
  endpoint: ProcessedEndpoint;
};

export function TryItOutSection({ endpoint }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const {
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
  } = useTryItOut(endpoint);

  const toastId = `try-it-out-error-${endpoint.method}-${endpoint.path}`;

  useEffect(() => {
    if (error) toast.error(error, { position: 'top-center', id: toastId });
  }, [error, toastId]);

  async function handleCopyCurl() {
    let curl: string;
    try {
      curl = generateCurl();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : 'Please enter a valid Server URL',
        { position: 'top-center' },
      );
      return;
    }

    try {
      await navigator.clipboard.writeText(curl);
      toast.success('cURL command copied to clipboard', {
        position: 'top-center',
      });
    } catch {
      toast.error('Failed to copy cURL command', { position: 'top-center' });
    }
  }

  const pathParams = endpoint.parameters.filter((p) => p.in === 'path');
  const queryParams = endpoint.parameters.filter((p) => p.in === 'query');
  const headerParams = endpoint.parameters.filter((p) => p.in === 'header');
  const cookieParams = endpoint.parameters.filter((p) => p.in === 'cookie');

  return (
    <div className={styles.root}>
      <Button
        size="lg"
        variant={isOpen ? 'destructive' : 'default'}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? <X /> : <Play />}
        {isOpen ? 'Hide' : 'Try it out'}
      </Button>

      {isOpen && (
        <>
          <div className={styles.section}>
            <p className={styles.section__title}>Server URL</p>
            <Input
              placeholder="https://api.example.com"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
            />
          </div>

          {!!pathParams.length && (
            <div className={styles.section}>
              <p className={styles.section__title}>Path Parameters</p>
              {pathParams.map((param) => (
                <div key={param.name} className={styles.param}>
                  <span className={styles.param__label}>
                    {param.name}
                    {param.required && <span className={styles.error}> *</span>}
                  </span>
                  <Input
                    placeholder="value"
                    value={paramValues[param.name] ?? ''}
                    onChange={(e) => setParamValue(param.name, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          {!!queryParams.length && (
            <div className={styles.section}>
              <p className={styles.section__title}>Query Parameters</p>
              {queryParams.map((param) => (
                <div key={param.name} className={styles.param}>
                  <span className={styles.param__label}>
                    {param.name}
                    {param.required && <span className={styles.error}> *</span>}
                  </span>
                  <Input
                    placeholder="value"
                    value={paramValues[param.name] ?? ''}
                    onChange={(e) => setParamValue(param.name, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          {!!headerParams.length && (
            <div className={styles.section}>
              <p className={styles.section__title}>Header Parameters</p>
              {headerParams.map((param) => (
                <div key={param.name} className={styles.param}>
                  <span className={styles.param__label}>
                    {param.name}
                    {param.required && <span className={styles.error}> *</span>}
                  </span>
                  <Input
                    placeholder="value"
                    value={paramValues[param.name] ?? ''}
                    onChange={(e) => setParamValue(param.name, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          {!!cookieParams.length && (
            <div className={styles.section}>
              <p className={styles.section__title}>Cookie Parameters</p>
              {cookieParams.map((param) => (
                <div key={param.name} className={styles.param}>
                  <span className={styles.param__label}>
                    {param.name}
                    {param.required && <span className={styles.error}> *</span>}
                  </span>
                  <Input
                    placeholder="value"
                    value={paramValues[param.name] ?? ''}
                    onChange={(e) => setParamValue(param.name, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          {hasBody && (
            <div className={styles.section}>
              <p className={styles.section__title}>Request Body</p>
              <textarea
                className={styles.textarea}
                placeholder='{"key": "value"}'
                value={bodyValue}
                onChange={(e) => setBodyValue(e.target.value)}
              />
            </div>
          )}

          <div className={styles.actions}>
            <Button
              size="lg"
              onClick={execute}
              disabled={isLoading || !baseUrl}
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
              {isLoading ? 'Executing…' : 'Execute'}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleCopyCurl}
              disabled={!baseUrl}
            >
              <Copy />
              Generate cURL
            </Button>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          {response && (
            <div className={styles.section}>
              <p className={styles.section__title}>Response</p>
              <div className={styles.response__header}>
                <Badge
                  variant="outline"
                  className={`animate-pulse ${styles.response__status} ${styles[`response__status--${String(response.status)[0]}`] ?? ''}`}
                >
                  {response.status}
                </Badge>
              </div>
              <div className={styles.section}>
                <p className={styles.response__label}>Response body</p>
                <pre className={styles.response__body}>{response.body}</pre>
              </div>
              {Object.keys(response.headers).length > 0 && (
                <div className={styles.section}>
                  <p className={styles.response__label}>Response headers</p>
                  <pre className={styles.response__body}>
                    {Object.entries(response.headers)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join('\n')}
                  </pre>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
