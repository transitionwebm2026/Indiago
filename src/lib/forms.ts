import { site } from '@/lib/site';

export const hasWeb3Forms = site.web3formsKey.length > 0;

/**
 * Posts a submission to Web3Forms (https://web3forms.com) directly from the browser.
 * Static exports cannot run server actions, so all form delivery happens client-side.
 */
export async function submitToWeb3Forms(subject: string, fields: Record<string, string>) {
  if (!hasWeb3Forms) return false;
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: site.web3formsKey,
        subject,
        from_name: `${site.name} Website`,
        ...fields,
      }),
    });
    const result = (await response.json()) as { success?: boolean };
    return response.ok && result.success === true;
  } catch {
    return false;
  }
}

export function mailtoLink(subject: string, body: string) {
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
