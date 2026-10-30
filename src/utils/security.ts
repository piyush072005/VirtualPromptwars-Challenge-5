import DOMPurify from 'dompurify';

/**
 * Strips prompt injection vectors, control characters, and enforces length bounds.
 */
export function sanitizePromptInput(input: unknown, maxLength = 500): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove control characters and potential delimiter breakers
  const sanitized = input
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove ASCII control characters
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script blocks
    .replace(/```/g, "'''") // Neutralize markdown code fences
    .replace(/[<>]/g, (match) => (match === '<' ? '&lt;' : '&gt;')) // Escape raw angle brackets
    .trim();

  return sanitized.slice(0, maxLength);
}

/**
 * Builds an injection-resistant payload wrapped inside delimited system boundaries.
 */
export function buildSecureContextBlock(
  tagName: string,
  data: Record<string, unknown>
): string {
  const sanitizedPairs = Object.entries(data).map(([key, val]) => {
    const cleanKey = key.replace(/[^a-zA-Z0-9_]/g, '');
    let cleanVal = '';

    if (typeof val === 'string') {
      cleanVal = sanitizePromptInput(val, 1000);
    } else if (typeof val === 'number' || typeof val === 'boolean') {
      cleanVal = String(val);
    } else {
      cleanVal = sanitizePromptInput(JSON.stringify(val), 2000);
    }

    return `  <${cleanKey}>${cleanVal}</${cleanKey}>`;
  });

  return `<${tagName}>\n${sanitizedPairs.join('\n')}\n</${tagName}>`;
}

/**
 * Sanitizes rich text / markdown strings to eliminate XSS before rendering into DOM.
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'code', 'span'],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'title']
  });
}

/**
 * Generates a deterministic hash key for client-side response caching.
 */
export function computeCacheKey(prefix: string, payload: Record<string, unknown>): string {
  const str = JSON.stringify(payload, Object.keys(payload).sort());
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `${prefix}_${Math.abs(hash).toString(36)}`;
}
