// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { techStack } from './techStack';

describe('techStack data', () => {
  it('has entries with required fields', () => {
    expect(techStack.length).toBeGreaterThan(0);
    techStack.forEach((tech) => {
      expect(tech.name).toBeTruthy();
      expect(tech.url).toBeTruthy();
      expect(tech.iconId).toBeTruthy();
      expect(tech.color).toBeTruthy();
    });
  });
});
