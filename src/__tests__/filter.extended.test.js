import { filterByTerm } from '../filter';

const CHARACTERS = [
  { id: 1, name: 'Zelda' },
  { id: 2, name: 'Ganondorf' },
  { id: 3, name: 'Link' },
  { id: 4, name: 'Zelda II' },
];

describe('filterByTerm – edge cases', () => {
  test('returns an empty array when the input array is empty', () => {
    expect(filterByTerm([], 'link')).toEqual([]);
  });

  test('returns an empty array when no items match', () => {
    expect(filterByTerm(CHARACTERS, 'samus')).toEqual([]);
  });

  test('returns all matching items when multiple items match', () => {
    const result = filterByTerm(CHARACTERS, 'zelda');
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ id: 1, name: 'Zelda' });
    expect(result[1]).toEqual({ id: 4, name: 'Zelda II' });
  });

  test('matching is case-insensitive (uppercase search term)', () => {
    expect(filterByTerm(CHARACTERS, 'GANONDORF')).toEqual([
      { id: 2, name: 'Ganondorf' },
    ]);
  });

  test('matching is case-insensitive (mixed-case search term)', () => {
    expect(filterByTerm(CHARACTERS, 'gAnOnDoRf')).toEqual([
      { id: 2, name: 'Ganondorf' },
    ]);
  });

  test('partial term match returns the correct items', () => {
    // 'orf' is a substring of 'Ganondorf'
    expect(filterByTerm(CHARACTERS, 'orf')).toEqual([
      { id: 2, name: 'Ganondorf' },
    ]);
  });

  test('returns all items when the search term is an empty string', () => {
    // An empty RegExp matches every string
    expect(filterByTerm(CHARACTERS, '')).toHaveLength(CHARACTERS.length);
  });

  test('returns the only item in a single-element array when it matches', () => {
    const single = [{ id: 99, name: 'Midna' }];
    expect(filterByTerm(single, 'midna')).toEqual(single);
  });

  test('returns empty array for a single-element array that does not match', () => {
    const single = [{ id: 99, name: 'Midna' }];
    expect(filterByTerm(single, 'link')).toEqual([]);
  });

  test('does not mutate the original input array', () => {
    const input = [
      { id: 1, name: 'Zelda' },
      { id: 2, name: 'Link' },
    ];
    const copy = [...input];
    filterByTerm(input, 'zelda');
    expect(input).toEqual(copy);
  });
});
