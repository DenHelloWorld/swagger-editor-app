//mock
import { RequestHistoryEntry } from '@/types/dbTypes';

const recordsStore = new Map<string, RequestHistoryEntry[]>();

export async function saveRequestRecord(
  userId: string,
  record: RequestHistoryEntry,
) {
  const list = recordsStore.get(userId) ?? [];
  list.push({ ...record, id: crypto.randomUUID(), userId });
  recordsStore.set(userId, list);
}

export async function getRequestRecords(
  userId: string,
): Promise<RequestHistoryEntry[]> {
  return (recordsStore.get(userId) ?? [])
    .slice()
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}
