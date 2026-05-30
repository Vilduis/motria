import { cn } from "@/lib/utils"

interface LogoMarkProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

export function LogoMark({
  size = 18,
  className,
  strokeWidth = 2,
  ...props
}: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
      {...props}
    >
      <path
        d="M3 6 L7.5 19 L12 9 L16.5 19 L21 6"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg"
  className?: string
  markClassName?: string
  textClassName?: string
  showText?: boolean
  text?: string
}

const SIZE_MAP = {
  xs: { mark: 14, gap: "gap-1.5", text: "text-[13px]" },
  sm: { mark: 16, gap: "gap-2", text: "text-sm" },
  md: { mark: 18, gap: "gap-2", text: "text-[15px]" },
  lg: { mark: 22, gap: "gap-2.5", text: "text-base" },
} as const

export function Logo({
  size = "md",
  className,
  markClassName,
  textClassName,
  showText = true,
  text = "Workshop",
}: LogoProps) {
  const s = SIZE_MAP[size]
  return (
    <span className={cn("inline-flex items-center", s.gap, className)}>
      <LogoMark
        size={s.mark}
        className={cn("text-brand", markClassName)}
      />
      {showText && (
        <span
          className={cn(
            "font-heading font-semibold tracking-[-0.01em] text-foreground",
            s.text,
            textClassName,
          )}
        >
          {text}
        </span>
      )}
    </span>
  )
}
