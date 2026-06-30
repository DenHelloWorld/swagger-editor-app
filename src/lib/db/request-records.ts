//mock
// TODO add getRequestRecordById(userId, id)
import { RequestRecord, RequestRecordInput } from '@/types/dbTypes';

const recordsStore = new Map<string, RequestRecord[]>();

export async function saveRequestRecord(
  userId: string,
  record: RequestRecordInput,
) {
  const list = recordsStore.get(userId) ?? [];
  list.push({ ...record, id: crypto.randomUUID(), userId });
  recordsStore.set(userId, list);
}

export async function getRequestRecords(
  userId: string,
): Promise<RequestRecord[]> {
  return (recordsStore.get(userId) ?? [])
    .slice()
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}
