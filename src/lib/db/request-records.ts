//mock
// TODO add getRequestRecordById(userId, id)
import { RequestRecord, RequestRecordInput } from '@/types/dbTypes';
import { getFirebaseFirestore } from '@/lib/db/firebase/client';
import { collection, addDoc } from 'firebase/firestore';

const recordsStore = new Map<string, RequestRecord[]>();

export async function saveRequestRecord(
  userId: string,
  record: RequestRecordInput,
) {
  const db = getFirebaseFirestore();
  await addDoc(collection(db, 'RequestRecords'), { ...record });
  /* const list = recordsStore.get(userId) ?? [];
  list.push({ ...record, id: crypto.randomUUID(), userId });
  recordsStore.set(userId, list); */
}

export async function getRequestRecords(
  userId: string,
): Promise<RequestRecord[]> {
  return (recordsStore.get(userId) ?? [])
    .slice()
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}
