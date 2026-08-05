import { describe, expect, it } from 'vitest';
import { add } from './lib';

describe('add', () => {
  it('adds numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
});

describe('add', () => {
  it('adds negative numbers', () => {
    expect(add(-2, -3)).toBe(-5);
  });
});
