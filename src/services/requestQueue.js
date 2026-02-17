import { sleep } from '../utils/helpers';

class RequestQueue {
  constructor(minDelayMs = 100) {
    this.minDelayMs = minDelayMs;
    this.lastRequestTime = 0;
    this.queue = [];
    this.processing = false;
    this.rateLimitedUntil = 0;
  }

  async enqueue(url, options = {}) {
    return new Promise((resolve, reject) => {
      this.queue.push({ url, options, resolve, reject });
      this._processQueue();
    });
  }

  async _processQueue() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      // Wait if rate limited
      if (this.rateLimitedUntil > Date.now()) {
        const waitTime = this.rateLimitedUntil - Date.now();
        console.warn(`Rate limited. Waiting ${Math.ceil(waitTime / 1000)}s...`);
        await sleep(waitTime);
      }

      // Enforce minimum delay between requests
      const elapsed = Date.now() - this.lastRequestTime;
      if (elapsed < this.minDelayMs) {
        await sleep(this.minDelayMs - elapsed);
      }

      const { url, options, resolve, reject } = this.queue.shift();
      this.lastRequestTime = Date.now();

      try {
        const response = await fetch(url, options);

        if (response.status === 429) {
          // Rate limited — wait 60 seconds
          this.rateLimitedUntil = Date.now() + 60000;
          reject(new Error('Rate limited by Lichess. Retrying in 60 seconds.'));
          continue;
        }

        if (!response.ok) {
          reject(new Error(`HTTP ${response.status}: ${response.statusText}`));
          continue;
        }

        resolve(response);
      } catch (err) {
        reject(err);
      }
    }

    this.processing = false;
  }
}

export const apiQueue = new RequestQueue(100);
