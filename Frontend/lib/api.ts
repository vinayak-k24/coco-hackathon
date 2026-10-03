const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export async function fetchApi<T>(
  path: string,
  fallback?: T,
): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      console.error(`API error: ${res.status} ${path}`);
      if (fallback !== undefined) return fallback;
      throw new Error(`API ${path} returned ${res.status}`);
    }
    return res.json();
  } catch (err) {
    console.error(`Fetch failed: ${path}`, err);
    if (fallback !== undefined) return fallback;
    throw err;
  }
}

export function formatINR(val: number): string {
  const v = Number(val) || 0;
  if (v >= 1_00_00_000) return `₹${(v / 1_00_00_000).toFixed(1)} Cr`;
  if (v >= 1_00_000) return `₹${(v / 1_00_000).toFixed(1)}L`;
  if (v >= 1_000) return `₹${(v / 1_000).toFixed(0)}K`;
  return `₹${v.toFixed(0)}`;
}
