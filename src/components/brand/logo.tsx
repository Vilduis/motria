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
        d="M3 19 L7.5 5 L12 15 L16.5 5 L21 19"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
