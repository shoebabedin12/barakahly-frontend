const STORAGE_KEY = "barakahly_recently_viewed";
const MAX_ENTRIES = 12;

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function write(slugs: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  } catch {
    // storage unavailable - recently-viewed just won't persist
  }
}

export function recordRecentlyViewed(slug: string) {
  const existing = read().filter((s) => s !== slug);
  write([slug, ...existing].slice(0, MAX_ENTRIES));
}

export function getRecentlyViewedSlugs(exclude: string[] = []): string[] {
  const excludeSet = new Set(exclude);
  return read().filter((slug) => !excludeSet.has(slug));
}
