import { describe, expect, it } from 'vitest';
import { add } from './main';

describe('add', () => {
    it('adds numbers', () => {
        expect(add(2, 3)).toBe(5);
    })
})
