"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

export function SectionCards() {
  const cards = [
    {
      title: "Active Proposals",
      value: "45",
      change: "+12.5%",
      trend: "up" as const,
      icon: TrendingUp,
    },
    {
      title: "Success Rate",
      value: "82%",
      change: "+4.2%",
      trend: "up" as const,
      icon: TrendingUp,
    },
    {
      title: "Total Revenue",
      value: "$1.2M",
      change: "-2.4%",
      trend: "down" as const,
      icon: TrendingDown,
    },
    {
      title: "Avg. Response Time",
      value: "1.2s",
      change: "-15%",
      trend: "up" as const,
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {cards.map((card, i) => (
        <Card key={i} className="@container/card">
          <CardHeader>
            <CardDescription>{card.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {card.value}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <card.icon className="size-3.5" />
                {card.change}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {card.trend === "up" ? "Trending up" : "Trending down"} this month{" "}
              <card.icon className="size-4" />
            </div>
            <div className="text-muted-foreground">
              Visitors for the last 6 months
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
