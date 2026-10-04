import { LogoMark } from "@/components/brand/logo"
import { cn } from "@/lib/utils"

export function MotriaLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "motria-wordmark inline-flex items-center gap-2.5",
        className
      )}
    >
      <span className="motria-mark flex size-10 items-center justify-center rounded-full border-2 border-current">
        <LogoMark size={24} strokeWidth={2.7} />
      </span>
      <span>
        motria<span className="text-primary">.</span>
      </span>
    </span>
  )
}
