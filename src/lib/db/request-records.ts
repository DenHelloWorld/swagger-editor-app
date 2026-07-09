import { getFirebaseAdminFirestore } from './firebase/admin';
import { RequestRecord, RequestRecordInput } from '@/types/dbTypes';

export async function saveRequestRecord(
  userId: string,
  record: RequestRecordInput,
): Promise<void> {
  const db = getFirebaseAdminFirestore();
  const ref = db
    .collection('users')
    .doc(userId)
    .collection('requestRecords')
    .doc();
  await ref.set({ ...record, id: ref.id, userId });
}

export async function getRequestRecords(
  userId: string,
): Promise<RequestRecord[]> {
  const db = getFirebaseAdminFirestore();
  const snapshot = await db
    .collection('users')
    .doc(userId)
    .collection('requestRecords')
    .orderBy('timestamp', 'desc')
    .get();
  return snapshot.docs.map((doc) => doc.data() as RequestRecord);
}

export async function getRequestRecordById(
  userId: string,
  recordId: string,
): Promise<RequestRecord | undefined> {
  const db = getFirebaseAdminFirestore();

  const docRef = db
    .collection('users')
    .doc(userId)
    .collection('requestRecords')
    .doc(recordId);
  const docSnap = await docRef.get();
  if (docSnap.exists) {
    return docSnap.data() as RequestRecord;
  }
}
