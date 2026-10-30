import DOMPurify from 'dompurify';

/**
 * Strips ASCII and extended control characters while preserving standard printable text and whitespace.
 */
function stripControlCharacters(str: string): string {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    // Disallow non-printable ASCII control characters (0-31 except tab/newline/cr) and DEL/C1 (127-159)
    if ((code >= 32 && (code < 127 || code > 159)) || code === 9 || code === 10 || code === 13) {
      result += str[i];
    }
  }
  return result;
}

/**
 * Strips prompt injection vectors, control characters, and enforces length bounds.
 */
export function sanitizePromptInput(input: unknown, maxLength = 500): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove control characters and potential delimiter breakers
  const cleanChars = stripControlCharacters(input);
  const sanitized = cleanChars
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
