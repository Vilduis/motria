import { useEffect, useState } from "react"
import { motion, animate } from "motion/react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })
    return () => controls.stop()
  }, [value])

  return <>{display.toLocaleString("es-ES")}</>
}

interface StatCardProps {
  title: string
  value: number | string
  description?: string
  trend?: string
  icon: React.ReactNode
  index?: number
  className?: string
}

export function StatCard({
  title,
  value,
  description,
  trend,
  icon,
  index = 0,
  className,
}: StatCardProps) {
  const isNumeric = typeof value === "number"

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.06,
      }}
    >
      <Card
        className={cn(
          "transition-shadow duration-200 ease-(--ease-out-quart) hover:shadow-elevated",
          className,
        )}
      >
        <CardContent className="pb-5 pt-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1.5">
              <p className="text-eyebrow">{title}</p>
              <p className="text-num text-[28px] font-semibold leading-none tracking-[-0.02em]">
                {isNumeric ? <AnimatedNumber value={value} /> : value}
              </p>
            </div>
            <div className="shrink-0 rounded-lg border border-border/70 bg-secondary/40 p-2 text-muted-foreground/80">
              {icon}
            </div>
          </div>
          {(description || trend) && (
            <div className="mt-4 border-t border-border/50 pt-3">
              <p className="text-caption">
                {description}
                {trend && (
                  <span className="ml-1.5 font-medium text-brand">{trend}</span>
                )}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
