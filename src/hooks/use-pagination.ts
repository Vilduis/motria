import { useMemo, useState } from "react"

const DEFAULT_PAGE_SIZE = 15

/**
 * Client-side pagination over an already filtered list.
 * `resetKey` should change whenever the search or filters change, so the
 * user goes back to page 1. The page is clamped when rows disappear (e.g.
 * after deleting the last row of the last page).
 */
export function usePagination<T>(
  items: T[],
  { pageSize = DEFAULT_PAGE_SIZE, resetKey = "" } = {}
) {
  const [state, setState] = useState({ key: resetKey, page: 1 })

  const total = items.length
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const requested = state.key === resetKey ? state.page : 1
  const page = Math.min(Math.max(requested, 1), pageCount)

  const pageItems = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize]
  )

  const setPage = (next: number) => setState({ key: resetKey, page: next })

  return {
    page,
    pageCount,
    pageItems,
    setPage,
    total,
    start: total === 0 ? 0 : (page - 1) * pageSize + 1,
    end: Math.min(page * pageSize, total),
  }
}
