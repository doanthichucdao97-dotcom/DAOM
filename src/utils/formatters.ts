// Utility for currency and number formatting with tabular alignment

export function formatVND(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatNumber(val: number, maxDecimals: number = 2): string {
  if (isNaN(val) || val === null || val === undefined) return '0';
  return new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: maxDecimals
  }).format(val);
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
}

// Convert number to Vietnamese words for legal construction contracts and quotations
const UNITS = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];
const DIGITS = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

function readThreeDigits(n: number, showZeroHundred: boolean): string {
  const h = Math.floor(n / 100);
  const t = Math.floor((n % 100) / 10);
  const u = n % 10;
  let res = '';

  if (h > 0 || showZeroHundred) {
    res += DIGITS[h] + ' trăm ';
  }

  if (t === 0 && u > 0 && (h > 0 || showZeroHundred)) {
    res += 'lẻ ' + DIGITS[u];
  } else if (t === 1) {
    res += 'mười ' + (u === 5 ? 'lăm' : u > 0 ? DIGITS[u] : '');
  } else if (t > 1) {
    res += DIGITS[t] + ' mươi ';
    if (u === 1) res += 'mốt';
    else if (u === 5) res += 'lăm';
    else if (u > 0) res += DIGITS[u];
  } else if (u > 0) {
    res += DIGITS[u];
  }

  return res.trim();
}

export function numberToVietnameseWords(num: number): string {
  if (num === 0) return 'Không đồng';
  if (num < 0) return 'Âm ' + numberToVietnameseWords(Math.abs(num));

  let n = Math.round(num);
  const groups: number[] = [];
  while (n > 0) {
    groups.push(n % 1000);
    n = Math.floor(n / 1000);
  }

  let words = '';
  for (let i = groups.length - 1; i >= 0; i--) {
    const g = groups[i];
    if (g > 0) {
      const showZero = i < groups.length - 1;
      const gWord = readThreeDigits(g, showZero);
      words += gWord + ' ' + UNITS[i] + ' ';
    }
  }

  words = words.trim() + ' đồng chẵn';
  // Capitalize first letter
  return words.charAt(0).toUpperCase() + words.slice(1);
}
