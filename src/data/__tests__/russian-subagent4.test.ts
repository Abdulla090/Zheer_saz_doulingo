import * as fs from 'fs';
import * as path from 'path';
import { beforeAll, describe, expect, test } from '@jest/globals';

describe('Subagent 4: Russian Translation Dictionary (ru.json)', () => {
  const projectRoot = path.resolve(__dirname, '../../..');
  const ruJsonPath = path.join(projectRoot, 'src/data/translations/ru.json');
  const arJsonPath = path.join(projectRoot, 'src/data/translations/ar.json');

  let ruData: Record<string, string>;
  let arData: Record<string, string>;

  beforeAll(() => {
    expect(fs.existsSync(ruJsonPath)).toBe(true);
    expect(fs.existsSync(arJsonPath)).toBe(true);

    ruData = JSON.parse(fs.readFileSync(ruJsonPath, 'utf8'));
    arData = JSON.parse(fs.readFileSync(arJsonPath, 'utf8'));
  });

  test('ru.json has populated translations with substantial dictionary depth', () => {
    const keyCount = Object.keys(ruData).length;
    expect(keyCount).toBeGreaterThanOrEqual(3200);
  });

  test('covers 100% of keys present in ar.json', () => {
    const missingKeys: string[] = [];
    for (const key of Object.keys(arData)) {
      if (ruData[key] === undefined) {
        missingKeys.push(key);
      }
    }
    expect(missingKeys).toEqual([]);
  });

  test('has ZERO Latin character leaks [a-zA-Z] in translation values', () => {
    const latinLeaks: { key: string; val: string }[] = [];
    const latinRegex = /[a-zA-Z]/;

    for (const [key, val] of Object.entries(ruData)) {
      if (typeof val === 'string' && latinRegex.test(val)) {
        latinLeaks.push({ key, val });
      }
    }
    expect(latinLeaks).toEqual([]);
  });

  test('has ZERO Arabic character leaks [\\u0600-\\u06FF] in translation values', () => {
    const arabicLeaks: { key: string; val: string }[] = [];
    const arabicRegex = /[\u0600-\u06FF]/;

    for (const [key, val] of Object.entries(ruData)) {
      if (typeof val === 'string' && arabicRegex.test(val)) {
        arabicLeaks.push({ key, val });
      }
    }
    expect(arabicLeaks).toEqual([]);
  });

  test('all translation values contain valid non-empty Russian/Cyrillic content', () => {
    const emptyValues: string[] = [];
    const noCyrillic: string[] = [];
    const cyrillicRegex = /[\u0400-\u04FF]/;

    for (const [key, val] of Object.entries(ruData)) {
      if (typeof val !== 'string' || val.trim().length === 0) {
        emptyValues.push(key);
      } else if (!cyrillicRegex.test(val) && !/^[0-9\s.,!?:;'"\-—–()+/*%$#@]+$/.test(val)) {
        noCyrillic.push(key);
      }
    }

    expect(emptyValues).toEqual([]);
    expect(noCyrillic).toEqual([]);
  });
});
