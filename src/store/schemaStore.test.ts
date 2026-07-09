import { describe, it, expect, beforeEach } from 'vitest';
import { useSchemaStore } from './schemaStore';
import type { ProcessedSpec } from '@/types/openapi';

const initialState = useSchemaStore.getState();

describe('schemaStore', () => {
  beforeEach(() => {
    useSchemaStore.setState(initialState, true);
  });

  it('has expected default state', () => {
    const state = useSchemaStore.getState();
    expect(state.processedSpec).toBeNull();
    expect(state.raw).toBe('');
    expect(state.format).toBe('json');
    expect(state.errors).toEqual([]);
  });

  it('setRaw updates raw', () => {
    useSchemaStore.getState().setRaw('hello');
    expect(useSchemaStore.getState().raw).toBe('hello');
  });

  it('setFormat updates format', () => {
    useSchemaStore.getState().setFormat('yaml');
    expect(useSchemaStore.getState().format).toBe('yaml');
  });

  it('setSpec updates processedSpec', () => {
    const spec = { info: { title: 'x' } } as unknown as ProcessedSpec;
    useSchemaStore.getState().setSpec(spec);
    expect(useSchemaStore.getState().processedSpec).toBe(spec);

    useSchemaStore.getState().setSpec(null);
    expect(useSchemaStore.getState().processedSpec).toBeNull();
  });

  it('setErrors updates errors', () => {
    useSchemaStore.getState().setErrors(['err1']);
    expect(useSchemaStore.getState().errors).toEqual(['err1']);
  });
});
