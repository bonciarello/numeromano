/**
 * Numeromano — Test suite per gli algoritmi di conversione
 * Esegui con: node test.js
 */

const ARABIC_ROMAN_PAIRS = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'],  [90, 'XC'],  [50, 'L'],  [40, 'XL'],
  [10, 'X'],   [9, 'IX'],   [5, 'V'],   [4, 'IV'],
  [1, 'I']
];

function arabicToRoman(num) {
  if (!Number.isFinite(num)) return null;
  if (num < 1 || num > 3999 || !Number.isInteger(num)) return null;
  let n = num;
  let result = '';
  for (const [value, symbol] of ARABIC_ROMAN_PAIRS) {
    while (n >= value) {
      result += symbol;
      n -= value;
    }
  }
  return result;
}

const ROMAN_MAP = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
const ROMAN_STRICT_RE = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i;

function romanToArabic(raw) {
  if (typeof raw !== 'string') return null;
  const s = raw.trim().toUpperCase();
  if (s.length === 0) return null;
  if (!ROMAN_STRICT_RE.test(s)) return null;

  let total = 0;
  let prev = 0;
  for (let i = s.length - 1; i >= 0; i--) {
    const cur = ROMAN_MAP[s[i]];
    if (cur < prev) {
      total -= cur;
    } else {
      total += cur;
    }
    prev = cur;
  }

  if (total < 1 || total > 3999) return null;
  if (arabicToRoman(total) !== s) return null;

  return total;
}

// ── Test runner ──
let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    failed++;
    failures.push({ name, error: e.message });
    console.log(`  ✗ ${name} — ${e.message}`);
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'assertion failed');
}

function assertEquals(actual, expected, msg) {
  if (actual !== expected) {
    throw new Error(msg || `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function assertNull(actual, msg) {
  if (actual !== null) {
    throw new Error(msg || `expected null, got ${JSON.stringify(actual)}`);
  }
}

console.log('\n╔══════════════════════════════════╗');
console.log('║   Numeromano — Test Suite       ║');
console.log('╚══════════════════════════════════╝\n');

// ── Arabic → Roman (valid) ──
console.log('▶ Arabic → Roman (valid inputs)');
test('1 → I',            () => assertEquals(arabicToRoman(1), 'I'));
test('4 → IV',           () => assertEquals(arabicToRoman(4), 'IV'));
test('5 → V',            () => assertEquals(arabicToRoman(5), 'V'));
test('9 → IX',           () => assertEquals(arabicToRoman(9), 'IX'));
test('10 → X',           () => assertEquals(arabicToRoman(10), 'X'));
test('40 → XL',          () => assertEquals(arabicToRoman(40), 'XL'));
test('50 → L',           () => assertEquals(arabicToRoman(50), 'L'));
test('90 → XC',          () => assertEquals(arabicToRoman(90), 'XC'));
test('100 → C',          () => assertEquals(arabicToRoman(100), 'C'));
test('400 → CD',         () => assertEquals(arabicToRoman(400), 'CD'));
test('500 → D',          () => assertEquals(arabicToRoman(500), 'D'));
test('900 → CM',         () => assertEquals(arabicToRoman(900), 'CM'));
test('1000 → M',         () => assertEquals(arabicToRoman(1000), 'M'));
test('2024 → MMXXIV',    () => assertEquals(arabicToRoman(2024), 'MMXXIV'));
test('3999 → MMMCMXCIX', () => assertEquals(arabicToRoman(3999), 'MMMCMXCIX'));
test('1776 → MDCCLXXVI', () => assertEquals(arabicToRoman(1776), 'MDCCLXXVI'));
test('444 → CDXLIV',     () => assertEquals(arabicToRoman(444), 'CDXLIV'));
test('999 → CMXCIX',     () => assertEquals(arabicToRoman(999), 'CMXCIX'));
test('3888 → MMMDCCCLXXXVIII', () => assertEquals(arabicToRoman(3888), 'MMMDCCCLXXXVIII'));

// ── Arabic → Roman (invalid) ──
console.log('\n▶ Arabic → Roman (invalid inputs)');
test('0 → null',         () => assertNull(arabicToRoman(0)));
test('-1 → null',        () => assertNull(arabicToRoman(-1)));
test('4000 → null',      () => assertNull(arabicToRoman(4000)));
test('3.5 → null',       () => assertNull(arabicToRoman(3.5)));
test('NaN → null',       () => assertNull(arabicToRoman(NaN)));
test('null → null',      () => assertNull(arabicToRoman(null)));
test('undefined → null', () => assertNull(arabicToRoman(undefined)));

// ── Roman → Arabic (valid) ──
console.log('\n▶ Roman → Arabic (valid inputs)');
test('I → 1',            () => assertEquals(romanToArabic('I'), 1));
test('IV → 4',           () => assertEquals(romanToArabic('IV'), 4));
test('V → 5',            () => assertEquals(romanToArabic('V'), 5));
test('IX → 9',           () => assertEquals(romanToArabic('IX'), 9));
test('X → 10',           () => assertEquals(romanToArabic('X'), 10));
test('XL → 40',          () => assertEquals(romanToArabic('XL'), 40));
test('L → 50',           () => assertEquals(romanToArabic('L'), 50));
test('XC → 90',          () => assertEquals(romanToArabic('XC'), 90));
test('C → 100',          () => assertEquals(romanToArabic('C'), 100));
test('CD → 400',         () => assertEquals(romanToArabic('CD'), 400));
test('D → 500',          () => assertEquals(romanToArabic('D'), 500));
test('CM → 900',         () => assertEquals(romanToArabic('CM'), 900));
test('M → 1000',         () => assertEquals(romanToArabic('M'), 1000));
test('MMXXIV → 2024',    () => assertEquals(romanToArabic('MMXXIV'), 2024));
test('MMMCMXCIX → 3999', () => assertEquals(romanToArabic('MMMCMXCIX'), 3999));
test('MDCCLXXVI → 1776', () => assertEquals(romanToArabic('MDCCLXXVI'), 1776));
test('CDXLIV → 444',     () => assertEquals(romanToArabic('CDXLIV'), 444));
test('CMXCIX → 999',     () => assertEquals(romanToArabic('CMXCIX'), 999));
test('MMMDCCCLXXXVIII → 3888', () => assertEquals(romanToArabic('MMMDCCCLXXXVIII'), 3888));
test('lowercase: iv → 4',     () => assertEquals(romanToArabic('iv'), 4));
test('spaces: " IX " → 9',    () => assertEquals(romanToArabic(' IX '), 9));

// ── Roman → Arabic (invalid) ──
console.log('\n▶ Roman → Arabic (invalid inputs)');
test('IIII → null (4 repeat)',      () => assertNull(romanToArabic('IIII')));
test('XXXX → null',                 () => assertNull(romanToArabic('XXXX')));
test('VV → null (V repeat)',        () => assertNull(romanToArabic('VV')));
test('LL → null (L repeat)',        () => assertNull(romanToArabic('LL')));
test('DD → null (D repeat)',        () => assertNull(romanToArabic('DD')));
test('IC → null (wrong subtractive)', () => assertNull(romanToArabic('IC')));
test('IL → null',                   () => assertNull(romanToArabic('IL')));
test('IM → null',                   () => assertNull(romanToArabic('IM')));
test('XD → null',                   () => assertNull(romanToArabic('XD')));
test('XM → null',                   () => assertNull(romanToArabic('XM')));
test('VX → null (V before X)',      () => assertNull(romanToArabic('VX')));
test('LC → null (L before C)',      () => assertNull(romanToArabic('LC')));
test('DM → null (D before M)',      () => assertNull(romanToArabic('DM')));
test('empty string → null',         () => assertNull(romanToArabic('')));
test('"ABC" → null',                () => assertNull(romanToArabic('ABC')));
test('"123" → null',                () => assertNull(romanToArabic('123')));
test('"IVX" → null (mixed order)',  () => assertNull(romanToArabic('IVX')));

// ── Round-trip consistency ──
console.log('\n▶ Round-trip (Arabic → Roman → Arabic)');
for (let n = 1; n <= 3999; n += 37) {  // sample every 37th number
  const roman = arabicToRoman(n);
  const back = romanToArabic(roman);
  if (back !== n) {
    throw new Error(`Round-trip failed for ${n}: ${roman} → ${back}`);
  }
}
console.log('  ✓ Round-trip consistency (108 samples)');
passed++;

// ── Summary ──
console.log(`\n${'═'.repeat(44)}`);
console.log(`  Passed: ${passed}  |  Failed: ${failed}`);
console.log(`${'═'.repeat(44)}\n`);

if (failed > 0) {
  console.log('Failures:');
  failures.forEach(f => console.log(`  ✗ ${f.name}: ${f.error}`));
  process.exit(1);
} else {
  console.log('Tutti i test superati! ✓\n');
}
