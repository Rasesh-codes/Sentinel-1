import { DetectedUrlInfo } from './types.js';

export const KNOWN_SHORTENERS = new Set([
  'bit.ly',
  'tinyurl.com',
  't.co',
  'is.gd',
  'buff.ly',
  'ow.ly',
  'cutt.ly',
  'rb.gy',
  'shorturl.at',
  'tiny.cc',
  'goo.gl',
  'rebrand.ly',
]);

const URL_PATTERN = /(?:https?:\/\/|www\.)[^\s<>"']+|[a-zA-Z0-9][-a-zA-Z0-9]{1,62}\.(?:com|org|net|in|co|xyz|info|biz|top|live|online|club|site|app|cc|link|tk|ml|ga|cf|gq|ly|io|me|to)(?:\/[^\s<>"']*)?/gi;

export function detectUrls(message: string): DetectedUrlInfo[] {
  const results: DetectedUrlInfo[] = [];
  const seen = new Set<string>();

  const matches = message.matchAll(URL_PATTERN);

  for (const match of matches) {
    let raw = match[0].replace(/^[.,!?;:()[\]'"]+|[.,!?;:()[\]'"]+$/g, '');
    if (!raw || seen.has(raw.toLowerCase())) {
      continue;
    }
    seen.add(raw.toLowerCase());

    let parseTarget = raw;
    if (!parseTarget.startsWith('http://') && !parseTarget.startsWith('https://')) {
      parseTarget = 'http://' + parseTarget;
    }

    let domain = '';
    try {
      const parsed = new URL(parseTarget);
      domain = parsed.hostname || parsed.pathname.split('/')[0];
      domain = domain.toLowerCase();
      if (domain.startsWith('www.')) {
        domain = domain.slice(4);
      }
    } catch {
      domain = raw.split('/')[0].toLowerCase();
    }

    const isHttps = raw.toLowerCase().startsWith('https://');
    const isShortened =
      KNOWN_SHORTENERS.has(domain) ||
      Array.from(KNOWN_SHORTENERS).some((s) => domain.endsWith('.' + s));

    results.push({
      raw_url: raw,
      domain,
      is_https: isHttps,
      is_shortened: isShortened,
      safety_note: 'External link detected. Verify the destination independently.',
    });
  }

  return results;
}
