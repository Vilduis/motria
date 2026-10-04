import { useState } from "react"
import { ChevronsUpDown } from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface ComboboxOption {
  value: number
  label: string
  /** Secondary line shown under the label and included in the search. */
  description?: string
}

interface EntityComboboxProps {
  id?: string
  value: number
  onChange: (value: number) => void
  options: ComboboxOption[]
  placeholder: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  invalid?: boolean
  className?: string
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
}

// Accent-insensitive, every typed word must appear ("abc toyota", "lucia").
function matches(haystack: string, search: string) {
  const parts = normalize(search).trim().split(/\s+/).filter(Boolean)
  const text = normalize(haystack)
  return parts.every((part) => text.includes(part)) ? 1 : 0
}

/**
 * Searchable select for long lists (customers, vehicles, technicians).
 * Looks like the form's Select trigger; opens a filterable list.
 * `value` 0 means "nothing selected", matching the forms' DTO convention.
 */
export function EntityCombobox({
  id,
  value,
  onChange,
  options,
  placeholder,
  searchPlaceholder = "Buscar...",
  emptyText = "Sin resultados.",
  disabled,
  invalid,
  className,
}: EntityComboboxProps) {
  const [open, setOpen] = useState(false)
  const selected = options.find((option) => option.value === value)

  return (
    // `modal` keeps wheel/touch scrolling working when used inside a Dialog.
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-invalid={invalid || undefined}
          disabled={disabled}
          className={cn(
            "flex h-9 w-full min-w-0 items-center justify-between gap-2 rounded-lg border border-input bg-card py-2 pr-2 pl-3 text-left text-sm text-foreground transition-[border-color,box-shadow] duration-150 outline-none dark:bg-white/[0.025]",
            "hover:border-muted-foreground",
            "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20",
            "data-[state=open]:border-ring data-[state=open]:ring-[3px] data-[state=open]:ring-ring/20",
            "aria-invalid:border-destructive/60 aria-invalid:ring-[3px] aria-invalid:ring-destructive/15",
            "disabled:pointer-events-none disabled:opacity-40",
            className
          )}
        >
          <span
            className={cn("truncate", !selected && "text-muted-foreground")}
          >
            {selected ? selected.label : placeholder}
          </span>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-(--radix-popover-trigger-width) min-w-64 p-0"
      >
        <Command
          filter={(_value, search, keywords) =>
            matches((keywords ?? []).join(" "), search)
          }
        >
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList className="max-h-64">
            <CommandEmpty>{emptyText}</CommandEmpty>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={String(option.value)}
                keywords={[option.label, option.description ?? ""]}
                data-checked={option.value === value}
                onSelect={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
              >
                <div className="min-w-0">
                  <div className="truncate">{option.label}</div>
                  {option.description && (
                    <div className="truncate text-xs text-muted-foreground">
                      {option.description}
                    </div>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
