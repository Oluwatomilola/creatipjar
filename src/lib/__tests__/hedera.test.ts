import { describe, it, expect } from 'vitest';
import { 
  isValidAccountId, 
  formatHbar, 
  tinybarsToHbar, 
  hbarToTinybars 
} from '../hedera';

describe('Hedera Utilities', () => {
  describe('isValidAccountId', () => {
    it('should validate correct account ID format', () => {
      expect(isValidAccountId('0.0.123456')).toBe(true);
      expect(isValidAccountId('0.0.1')).toBe(true);
      expect(isValidAccountId('1.2.3456789')).toBe(true);
    });

    it('should reject invalid account ID formats', () => {
      expect(isValidAccountId('123456')).toBe(false);
      expect(isValidAccountId('0.123456')).toBe(false);
      expect(isValidAccountId('0.0.')).toBe(false);
      expect(isValidAccountId('abc.def.ghi')).toBe(false);
      expect(isValidAccountId('')).toBe(false);
    });
  });

  describe('formatHbar', () => {
    it('should format HBAR amounts correctly', () => {
      expect(formatHbar(1)).toBe('1.00000000');
      expect(formatHbar(0.1)).toBe('0.10000000');
      expect(formatHbar(1.23456789)).toBe('1.23456789');
      expect(formatHbar(1000.5)).toBe('1,000.50000000');
    });
  });

  describe('tinybarsToHbar', () => {
    it('should convert tinybars to HBAR correctly', () => {
      expect(tinybarsToHbar(100000000)).toBe(1);
      expect(tinybarsToHbar(50000000)).toBe(0.5);
      expect(tinybarsToHbar(1)).toBe(0.00000001);
    });
  });

  describe('hbarToTinybars', () => {
    it('should convert HBAR to tinybars correctly', () => {
      expect(hbarToTinybars(1)).toBe(100000000);
      expect(hbarToTinybars(0.5)).toBe(50000000);
      expect(hbarToTinybars(0.00000001)).toBe(1);
    });

    it('should handle floating point precision', () => {
      const hbar = 1.23456789;
      const tinybars = hbarToTinybars(hbar);
      const backToHbar = tinybarsToHbar(tinybars);
      expect(Math.abs(backToHbar - hbar)).toBeLessThan(0.00000001);
    });
  });
});