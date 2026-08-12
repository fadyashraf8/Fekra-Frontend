import { describe, it, expect } from 'vitest';
import { formatAddress } from './formatters';

describe('formatAddress data transformer', () => {
  it('combines street, city, and zipcode into a single formatted string', () => {
    const address = {
      street: 'Kulas Light',
      suite: 'Apt. 556',
      city: 'Gwenborough',
      zipcode: '92998-3874',
    };

    const formatted = formatAddress(address);
    expect(formatted).toBe('Kulas Light, Gwenborough, 92998-3874');
  });

  it('handles missing street or city gracefully', () => {
    const address = {
      city: 'Cairo',
      zipcode: '11511',
    };

    const formatted = formatAddress(address);
    expect(formatted).toBe('Cairo, 11511');
  });

  it('returns fallback string when address object is null or undefined', () => {
    expect(formatAddress(null)).toBe('Address not available');
    expect(formatAddress(undefined)).toBe('Address not available');
  });
});
