import { describe, it, expect, vi, beforeEach } from 'vitest';
import { saveRequestRecord, getRequestRecords } from './request-records';
import { RequestRecordInput } from '@/types/dbTypes';

const { setMock, docMock, collectionMock, getMock, orderByMock } = vi.hoisted(
  () => {
    const setMock = vi.fn().mockResolvedValue(undefined);
    const getMock = vi.fn();
    const orderByMock = vi.fn(() => ({ get: getMock }));
    const docMock = vi.fn(() => ({
      id: 'generated-id',
      set: setMock,
    }));
    const collectionMock = vi.fn(() => ({
      doc: docMock,
      orderBy: orderByMock,
    }));
    return { setMock, docMock, collectionMock, getMock, orderByMock };
  },
);

vi.mock('./firebase/admin', () => ({
  getFirebaseAdminFirestore: () => ({
    collection: () => ({
      doc: () => ({
        collection: collectionMock,
      }),
    }),
  }),
}));

const record: RequestRecordInput = {
  method: 'GET',
  url: 'https://petstore3.swagger.io/api/v3/pet/1',
  endpoint: '/pet/1',
  statusCode: 200,
  durationMs: 42,
  requestSize: 0,
  responseSize: 123,
  timestamp: '2026-07-05T00:00:00.000Z',
};

describe('request-records', () => {
  beforeEach(() => {
    setMock.mockClear();
    docMock.mockClear();
    collectionMock.mockClear();
    getMock.mockReset();
    orderByMock.mockClear();
  });

  it('saves a request record under users/{userId}/requestRecords with generated id and userId', async () => {
    await saveRequestRecord('user-1', record);

    expect(setMock).toHaveBeenCalledWith({
      ...record,
      id: 'generated-id',
      userId: 'user-1',
    });
  });

  it('returns request records ordered by timestamp desc', async () => {
    const newer = {
      ...record,
      id: 'a',
      userId: 'user-1',
      timestamp: '2026-07-05T01:00:00.000Z',
    };
    const older = {
      ...record,
      id: 'b',
      userId: 'user-1',
      timestamp: '2026-07-04T00:00:00.000Z',
    };
    getMock.mockResolvedValue({
      docs: [{ data: () => newer }, { data: () => older }],
    });

    const result = await getRequestRecords('user-1');

    expect(orderByMock).toHaveBeenCalledWith('timestamp', 'desc');
    expect(result).toEqual([newer, older]);
  });
});
