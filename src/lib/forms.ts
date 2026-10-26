import { site } from '@/lib/site';

// Optional: Web3Forms access key (see .env.example). Empty = WhatsApp / mailto fallbacks.
export const web3formsKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? '';

export const hasWeb3Forms = web3formsKey.length > 0;

/**
 * Posts a submission to Web3Forms (https://web3forms.com) directly from the browser.
 * Static exports cannot run server actions, so all form delivery happens client-side.
 */
export async function submitToWeb3Forms(subject: string, fields: Record<string, string>, siteName: string = site.name) {
  if (!hasWeb3Forms) return false;
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: web3formsKey,
        subject,
        from_name: `${siteName} Website`,
        ...fields,
      }),
    });
    const result = (await response.json()) as { success?: boolean };
    return response.ok && result.success === true;
  } catch {
    return false;
  }
}

export function mailtoLink(email: string, subject: string, body: string) {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
