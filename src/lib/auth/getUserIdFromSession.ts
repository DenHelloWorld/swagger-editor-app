export async function getUserIdFromSession(): Promise<string | null> {
  // mock  - as an argument is going be _req: NextRequest, and id will come from cookies
  if (process.env.NEXT_PUBLIC_DEV_MOCK_AUTH) {
    return 'mock-user-1';
  }
  return null;
}
