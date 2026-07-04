export async function syncSession(idToken: string): Promise<string | null> {
  const res = await fetch('/api/auth/session', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as {
      error?: string;
    } | null;
    return data?.error ?? 'Failed to create session';
  }

  return null;
}

export async function clearSession(): Promise<void> {
  await fetch('/api/auth/session', { method: 'DELETE' });
}
