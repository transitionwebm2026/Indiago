type NetworkInformation = { saveData?: boolean; effectiveType?: string };

/**
 * Whether pages may be fetched before the visitor opens them, so a tap switches page at once.
 * Not with Data Saver on or on a 2G connection, where every kilobyte counts; there, pages are
 * fetched only when a link shows intent (hover, focus or touch). False during pre-rendering.
 */
export function canPrefetch(): boolean {
  if (typeof navigator === 'undefined') return false;
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  return !connection?.saveData && !/2g$/.test(connection?.effectiveType ?? '');
}
