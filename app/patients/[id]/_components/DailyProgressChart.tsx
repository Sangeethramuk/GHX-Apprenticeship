"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"

type DailyProgressEntry = {
  date: string
  mood: "Good" | "Fair" | "Poor"
  adherence: number
  vitalsLogged: boolean
  notes: string
  flagged: boolean
}

interface DailyProgressChartProps {
  dailyProgress: DailyProgressEntry[]
}

const progressConfig = {
  adherence: { label: "Adherence (%)", color: "#2563eb" },
} satisfies ChartConfig

const moodColor: Record<string, string> = {
  Good: "#16a34a",
  Fair: "#ca8a04",
  Poor: "#dc2626",
}

export default function DailyProgressChart({ dailyProgress }: DailyProgressChartProps) {
  const flaggedDays = dailyProgress.filter((d) => d.flagged)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Progress</CardTitle>
        <CardDescription>
          Medication adherence over the past 15 days — colour indicates mood (green = good, yellow = fair, red = poor). Flagged days are highlighted.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={progressConfig} className="h-[200px]">
          <BarChart data={dailyProgress}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 9 }} interval={2} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="adherence" radius={[2, 2, 0, 0]}>
              {dailyProgress.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.flagged ? "#dc2626" : moodColor[entry.mood]}
                  opacity={entry.flagged ? 1 : 0.75}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>

        {flaggedDays.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">Flagged Days</p>
            {flaggedDays.map((day, i) => (
              <div key={i} className="flex items-center gap-3 rounded-md border px-3 py-2 text-sm">
                <span className="text-muted-foreground w-16 shrink-0">{day.date}</span>
                <Badge
                  variant={day.mood === "Poor" ? "destructive" : day.mood === "Fair" ? "secondary" : "outline"}
                >
                  {day.mood}
                </Badge>
                <span>{day.adherence}% adherence</span>
                {day.notes && (
                  <span className="ml-auto text-muted-foreground truncate max-w-[240px]">{day.notes}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
