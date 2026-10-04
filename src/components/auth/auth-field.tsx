import { useState, type ComponentProps, type ReactNode } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type AuthFieldProps = ComponentProps<"input"> & {
  id: string
  label: string
  error?: string
  trailing?: ReactNode
}

export function AuthField({
  id,
  label,
  error,
  trailing,
  type,
  className,
  ...props
}: AuthFieldProps) {
  const [visible, setVisible] = useState(false)
  const isPassword = type === "password"
  const description =
    [props["aria-describedby"], error ? `${id}-error` : undefined]
      .filter(Boolean)
      .join(" ") || undefined

  return (
    <div className="min-w-0 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <Label htmlFor={id}>{label}</Label>
        {trailing}
      </div>
      <div className="relative">
        <Input
          {...props}
          id={id}
          name={props.name ?? id}
          type={isPassword && visible ? "text" : type}
          className={cn(isPassword && "pr-12", className)}
          aria-invalid={Boolean(error)}
          aria-describedby={description}
        />
        {isPassword && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="motria-password-toggle"
            onClick={() => setVisible((value) => !value)}
            disabled={props.disabled}
            aria-label={`${visible ? "Ocultar" : "Mostrar"} ${label.toLowerCase()}`}
            aria-controls={id}
          >
            {visible ? (
              <EyeOff className="size-4" aria-hidden="true" />
            ) : (
              <Eye className="size-4" aria-hidden="true" />
            )}
          </Button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="motria-auth-error">
          {error}
        </p>
      )}
    </div>
  )
}
