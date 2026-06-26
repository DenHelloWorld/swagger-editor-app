import type { OpenAPIDocument } from '@/types/openapi';
import { MOCK_SPEC_V3 } from '../mocks/specs';

// TODO: replace with Zustand store from Feature 3 when ready
// DEV: swap between MOCK_SPEC_V3, MOCK_SPEC_V2, or null to test different states
export function useSchema(): { spec: OpenAPIDocument | null } {
  return { spec: MOCK_SPEC_V3 };
}
