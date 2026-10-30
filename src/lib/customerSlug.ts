export function toCustomerSlug(user?: {
  id?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
} | null): string {
  if (!user) return '';
  const rawName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
  const base = rawName || (user.email ? user.email.split('@')[0] : '') || user.id || '';
  const slug = base
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug || user.id || '';
}

export function getCustomerProfileUrl(user?: {
  id?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
} | null): string {
  const slug = toCustomerSlug(user);
  return `/admin/customers/${slug}`;
}
