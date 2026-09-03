export const money = (value: number, compact = false) => {
  if (!compact) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(value);
  }

  const absolute = Math.abs(value);
  const format = (amount: number, suffix: string) =>
    `₹${amount.toFixed(amount >= 10 ? 1 : 2).replace(/\.00$/, '')}${suffix}`;

  if (absolute >= 10_000_000) return format(value / 10_000_000, 'Cr');
  if (absolute >= 100_000) return format(value / 100_000, 'L');
  if (absolute >= 1_000) return format(value / 1_000, 'K');
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export const number = (value: number) => new Intl.NumberFormat('en-IN').format(value);

export const pct = (value: number) => `${value.toFixed(1)}%`;

export const timeAgo = (value: string) => {
  const diff = Math.max(0, Date.now() - new Date(value).getTime());
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export const titleCase = (value: string) =>
  value.replace(/[-_]/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase());