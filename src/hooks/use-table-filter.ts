import { useMemo, useState } from "react"

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
}

/**
 * Tiny client-side filter for table data. Returns the filtered slice
 * plus `query` / `setQuery` so the page can wire a search input.
 * Each row is searched across the values returned by `getSearchableText`.
 */
export function useTableFilter<T>(
  data: T[],
  getSearchableText: (item: T) => string,
) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = normalize(query.trim())
    if (!q) return data
    const parts = q.split(/\s+/)
    return data.filter((item) => {
      const haystack = normalize(getSearchableText(item))
      return parts.every((p) => haystack.includes(p))
    })
  }, [data, query, getSearchableText])

  return { query, setQuery, filtered }
}
