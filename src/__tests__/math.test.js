import { add, subtract, multiply, divide } from '../math';

// ---------------------------------------------------------------------------
// add
// ---------------------------------------------------------------------------
describe('add – edge cases', () => {
  test('adding zero returns the same number', () => {
    expect(add(5, 0)).toBe(5);
    expect(add(0, 5)).toBe(5);
  });

  test('adding two zeros returns zero', () => {
    expect(add(0, 0)).toBe(0);
  });

  test('adding negative numbers', () => {
    expect(add(-3, -7)).toBe(-10);
  });

  test('adding a positive and a negative', () => {
    expect(add(10, -4)).toBe(6);
    expect(add(-4, 10)).toBe(6);
  });

  test('adding floats', () => {
    expect(add(0.1, 0.2)).toBeCloseTo(0.3);
  });

  test('adding large numbers', () => {
    expect(add(1_000_000, 2_000_000)).toBe(3_000_000);
  });
});

// ---------------------------------------------------------------------------
// subtract
// ---------------------------------------------------------------------------
describe('subtract – edge cases', () => {
  test('subtracting zero returns the same number', () => {
    expect(subtract(7, 0)).toBe(7);
  });

  test('subtracting a number from itself returns zero', () => {
    expect(subtract(9, 9)).toBe(0);
  });

  test('subtracting a larger number gives a negative result', () => {
    expect(subtract(3, 10)).toBe(-7);
  });

  test('subtracting negative numbers', () => {
    expect(subtract(-5, -3)).toBe(-2);
  });

  test('subtracting floats', () => {
    expect(subtract(1.5, 0.5)).toBeCloseTo(1.0);
  });
});

// ---------------------------------------------------------------------------
// multiply
// ---------------------------------------------------------------------------
describe('multiply – edge cases', () => {
  test('multiplying by zero returns zero', () => {
    expect(multiply(99, 0)).toBe(0);
    expect(multiply(0, 99)).toBe(0);
  });

  test('multiplying by one returns the same number', () => {
    expect(multiply(42, 1)).toBe(42);
  });

  test('multiplying two negatives gives a positive', () => {
    expect(multiply(-4, -5)).toBe(20);
  });

  test('multiplying a positive and a negative gives a negative', () => {
    expect(multiply(6, -3)).toBe(-18);
  });

  test('multiplying floats', () => {
    expect(multiply(2.5, 4)).toBeCloseTo(10);
  });
});

// ---------------------------------------------------------------------------
// divide
// ---------------------------------------------------------------------------
describe('divide – edge cases', () => {
  test('dividing by one returns the same number', () => {
    expect(divide(15, 1)).toBe(15);
  });

  test('dividing a number by itself returns one', () => {
    expect(divide(7, 7)).toBe(1);
  });

  test('dividing zero by a non-zero number returns zero', () => {
    expect(divide(0, 5)).toBe(0);
  });

  test('dividing by zero returns Infinity', () => {
    expect(divide(10, 0)).toBe(Infinity);
  });

  test('dividing zero by zero returns NaN', () => {
    expect(divide(0, 0)).toBeNaN();
  });

  test('dividing negative numbers', () => {
    expect(divide(-12, -4)).toBe(3);
  });

  test('dividing a positive by a negative gives a negative', () => {
    expect(divide(10, -2)).toBe(-5);
  });

  test('dividing floats', () => {
    expect(divide(7.5, 2.5)).toBeCloseTo(3);
  });
});
