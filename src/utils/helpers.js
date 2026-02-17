export function formatPercent(value) {
  return `${Math.round(value * 100)}%`;
}

export function formatNumber(num) {
  return num.toLocaleString();
}

export function debounce(fn, delayMs) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delayMs);
  };
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
