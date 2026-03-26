"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

type BPDataPoint = { date: string; systolic: number; diastolic: number }
type HRSpO2DataPoint = { date: string; heartRate: number; spo2: number }
type DataPoint = { date: string; value: number }

interface VitalsChartsProps {
  bpData: BPDataPoint[]
  hrSpo2Data: HRSpO2DataPoint[]
  glucoseData: DataPoint[]
  weightData: DataPoint[]
}

const bpConfig = {
  systolic: { label: "Systolic", color: "#2563eb" },
  diastolic: { label: "Diastolic", color: "#93c5fd" },
} satisfies ChartConfig

const hrConfig = {
  heartRate: { label: "Heart Rate (bpm)", color: "#dc2626" },
  spo2: { label: "SpO2 (%)", color: "#16a34a" },
} satisfies ChartConfig

const glucoseConfig = {
  value: { label: "Glucose (mg/dL)", color: "#ea580c" },
} satisfies ChartConfig

const weightConfig = {
  value: { label: "Weight (kg)", color: "#7c3aed" },
} satisfies ChartConfig

export default function VitalsCharts({ bpData, hrSpo2Data, glucoseData, weightData }: VitalsChartsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Blood Pressure */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
          <CardDescription>Systolic &amp; Diastolic over 30 days (mmHg)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={bpConfig} className="h-[200px]">
            <LineChart data={bpData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis domain={[60, 180]} tick={{ fontSize: 10 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line type="monotone" dataKey="systolic" stroke="var(--color-systolic)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="diastolic" stroke="var(--color-diastolic)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Heart Rate & SpO2 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Heart Rate &amp; SpO2</CardTitle>
          <CardDescription>Heart rate (bpm) and oxygen saturation (%)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={hrConfig} className="h-[200px]">
            <LineChart data={hrSpo2Data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="left" domain={[40, 130]} tick={{ fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" domain={[85, 100]} tick={{ fontSize: 10 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line yAxisId="left" type="monotone" dataKey="heartRate" stroke="var(--color-heartRate)" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="spo2" stroke="var(--color-spo2)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Glucose */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Blood Glucose</CardTitle>
          <CardDescription>Glucose level over 30 days (mg/dL) — dashed line at 126 mg/dL threshold</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={glucoseConfig} className="h-[200px]">
            <BarChart data={glucoseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis domain={[60, 200]} tick={{ fontSize: 10 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--color-value)" radius={[2, 2, 0, 0]} />
              <ReferenceLine y={126} stroke="#dc2626" strokeDasharray="4 4" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Weight */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Weight</CardTitle>
          <CardDescription>Weight trend over 30 days (kg)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={weightConfig} className="h-[200px]">
            <AreaChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis domain={["auto", "auto"]} tick={{ fontSize: 10 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--color-value)"
                fill="var(--color-value)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
