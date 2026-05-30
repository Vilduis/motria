import { TableCell, TableRow } from "@/components/ui/table"

interface LoadingRowsProps {
  cols: number
  rows?: number
}

const WIDTHS = ["55%", "75%", "45%", "65%", "80%", "50%", "70%"]

export function LoadingRows({ cols, rows = 5 }: LoadingRowsProps) {
  return Array.from({ length: rows }).map((_, i) => (
    <TableRow key={i} className="animate-pulse hover:bg-transparent">
      {Array.from({ length: cols }).map((_, j) => (
        <TableCell key={j}>
          <div
            className="h-4 rounded-md bg-secondary/70"
            style={{ width: WIDTHS[(i + j) % WIDTHS.length] }}
          />
        </TableCell>
      ))}
    </TableRow>
  ))
}
