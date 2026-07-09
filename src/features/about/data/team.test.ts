// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { team } from './team';

describe('team data', () => {
  it('has at least one member with required fields', () => {
    expect(team.length).toBeGreaterThan(0);
    team.forEach((member) => {
      expect(member.name).toBeTruthy();
      expect(member.role.en).toBeTruthy();
      expect(member.bio.en).toBeTruthy();
      expect(member.githubUrl).toBeTruthy();
    });
  });
});
