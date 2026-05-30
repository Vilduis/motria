import { useTheme } from "@/hooks/use-theme"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  CircleCheck,
  Info,
  TriangleAlert,
  OctagonX,
  Loader2,
} from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: <CircleCheck className="size-4 text-status-done" />,
        info: <Info className="size-4 text-brand" />,
        warning: <TriangleAlert className="size-4 text-status-pending" />,
        error: <OctagonX className="size-4 text-destructive" />,
        loading: <Loader2 className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius-lg)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "cn-toast border-border/80! shadow-elevated! gap-2.5! py-3! pr-3.5!",
          title: "text-[13.5px]! font-medium! tracking-[-0.005em]!",
          description: "text-[12.5px]! text-muted-foreground!",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
