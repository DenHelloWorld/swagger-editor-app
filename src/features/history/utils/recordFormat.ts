export function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString();
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function getStatusVariant(
  statusCode: number,
): 'success' | 'secondary' | 'destructive' {
  if (statusCode >= 200 && statusCode < 300) return 'success';
  if (statusCode >= 400) return 'destructive';
  return 'secondary';
}

export function getMethodVariant(
  method: string,
): 'default' | 'secondary' | 'outline' {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'secondary';
    case 'POST':
    case 'PUT':
    case 'PATCH':
      return 'default';
    default:
      return 'outline';
  }
}
