/**
 * Kumpulan Fungsi Utilitas & Helper untuk Frontend Posyandu Loa Duri Ulu
 */

/**
 * Format tanggal ISO / string ke format tanggal Indonesia (contoh: "15 Agustus 2026")
 * @param {string|Date} dateInput
 * @returns {string}
 */
export function formatDateIndo(dateInput) {
  if (!dateInput) return '-';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Format tanggal & waktu ke format lokal Indonesia (contoh: "15 Agu 2026, 14:30")
 * @param {string|Date} dateInput
 * @returns {string}
 */
export function formatDateTimeIndo(dateInput) {
  if (!dateInput) return '-';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Hitung usia dalam bulan berdasarkan tanggal lahir (untuk Balita / Anak)
 * @param {string|Date} birthDate
 * @returns {number} Usia dalam bulan
 */
export function calculateAgeInMonths(birthDate) {
  if (!birthDate) return 0;
  const birth = new Date(birthDate);
  const now = new Date();
  if (isNaN(birth.getTime())) return 0;

  let months = (now.getFullYear() - birth.getFullYear()) * 12;
  months += now.getMonth() - birth.getMonth();
  if (now.getDate() < birth.getDate()) {
    months -= 1;
  }
  return Math.max(0, months);
}

/**
 * Hitung usia dalam tahun berdasarkan tanggal lahir
 * @param {string|Date} birthDate
 * @returns {number} Usia dalam tahun
 */
export function calculateAgeInYears(birthDate) {
  if (!birthDate) return 0;
  const birth = new Date(birthDate);
  const now = new Date();
  if (isNaN(birth.getTime())) return 0;

  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

/**
 * Ambil inisial nama pengguna (maksimal 2 huruf)
 * @param {string} name
 * @returns {string}
 */
export function getInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/**
 * Potong string panjang dengan elipsis (...)
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text || '';
  return text.substring(0, maxLength).trim() + '...';
}
