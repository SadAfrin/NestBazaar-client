const STORAGE_KEY = "recentlyViewed";
const MAX_ITEMS = 8;

export function getRecentlyViewedIds() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(parsed)) return [];
    return parsed.map(String).filter(Boolean);
  } catch {
    return [];
  }
}

export function addRecentlyViewed(productId) {
  if (typeof window === "undefined" || !productId) return;
  const id = String(productId);
  const next = [id, ...getRecentlyViewedIds().filter((existing) => existing !== id)].slice(
    0,
    MAX_ITEMS
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
