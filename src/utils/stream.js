/**
 * Parses an ndjson (newline-delimited JSON) stream from a fetch Response.
 * Yields parsed JSON objects one at a time.
 */
export async function* parseNdjsonStream(response, onProgress) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let count = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        if (buffer.trim()) {
          try {
            const obj = JSON.parse(buffer.trim());
            count++;
            if (onProgress) onProgress(count);
            yield obj;
          } catch {
            // Ignore malformed trailing data
          }
        }
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        try {
          const obj = JSON.parse(trimmed);
          count++;
          if (onProgress) onProgress(count);
          yield obj;
        } catch {
          // Skip malformed lines
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
