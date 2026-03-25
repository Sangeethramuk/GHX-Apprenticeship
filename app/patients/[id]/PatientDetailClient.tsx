"use client"

import Link from "next/link"
import {
  Activity,
  AlertTriangle,
  ChevronLeft,
  Clock,
  Droplet,
  Heart,
  Phone,
  Pill,
  ShieldAlert,
  Stethoscope,
  User,
} from "lucide-react"

import type { Patient } from "@/lib/patient-data"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AISummaryCard } from "./AISummaryCard"
import { ChatWindow } from "./ChatWindow"

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase()
}

function RiskBadge({ risk }: { risk: Patient["risk"] }) {
  if (risk === "High")
    return <Badge variant="destructive">High Risk</Badge>
  if (risk === "Moderate")
    return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Moderate Risk</Badge>
  return <Badge variant="outline" className="text-green-700 border-green-300">Low Risk</Badge>
}

function VitalsTable({ patient }: { patient: Patient }) {
  const { vitalsHistory, conditions } = patient
  const isCardiac = conditions.some((c) => c.toLowerCase().includes("cardiac") || c.toLowerCase().includes("hypertension"))
  const isDiabetes = conditions.some((c) => c.toLowerCase().includes("diabetes"))
  const isThyroid = conditions.some((c) => c.toLowerCase().includes("thyroid"))

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-xs">Date</TableHead>
          {isCardiac && <TableHead className="text-xs">BP (mmHg)</TableHead>}
          {isCardiac && <TableHead className="text-xs">HR (bpm)</TableHead>}
          {isDiabetes && <TableHead className="text-xs">Glucose (mg/dL)</TableHead>}
          {isThyroid && <TableHead className="text-xs">TSH (mIU/L)</TableHead>}
          {vitalsHistory[0]?.weight && <TableHead className="text-xs">Weight (kg)</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {vitalsHistory.slice(-5).map((v, i) => (
          <TableRow key={i}>
            <TableCell className="text-xs text-muted-foreground">{v.date}</TableCell>
            {isCardiac && (
              <TableCell className="text-xs">
                {v.systolic ? `${v.systolic}/${v.diastolic}` : "—"}
              </TableCell>
            )}
            {isCardiac && (
              <TableCell className="text-xs">{v.heartRate ?? "—"}</TableCell>
            )}
            {isDiabetes && (
              <TableCell className="text-xs">{v.glucose ?? "—"}</TableCell>
            )}
            {isThyroid && (
              <TableCell className="text-xs">{v.tsh ?? "—"}</TableCell>
            )}
            {vitalsHistory[0]?.weight && (
              <TableCell className="text-xs">{v.weight ?? "—"}</TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export function PatientDetailClient({ patient }: { patient: Patient }) {
  const adherenceColor =
    patient.adherence >= 80
      ? "text-green-600"
      : patient.adherence >= 60
      ? "text-orange-500"
      : "text-red-500"

  const latestSymptoms = patient.recentCheckIns[0]?.symptoms ?? []

  return (
    <div className="flex h-screen flex-col bg-muted/20">
      {/* Top nav */}
      <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background px-6">
        <Button variant="ghost" size="sm" render={<Link href="/" />} className="gap-1.5">
          <ChevronLeft className="h-4 w-4" />
          Dashboard
        </Button>
        <Separator orientation="vertical" className="h-5" />
        <Activity className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Wellytics Continuous Care</span>
      </header>

      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">

          {/* Patient profile header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <Avatar className="h-16 w-16 text-lg shrink-0">
              <AvatarFallback className="bg-primary text-primary-foreground font-bold text-lg">
                {getInitials(patient.name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold">{patient.name}</h1>
                <RiskBadge risk={patient.risk} />
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  {patient.age} yrs · {patient.gender === "M" ? "Male" : "Female"}
                </span>
                <span className="flex items-center gap-1">
                  <Droplet className="h-3.5 w-3.5" />
                  {patient.bloodType}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {patient.phone}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {patient.conditions.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium"
                  >
                    <Stethoscope className="mr-1 h-3 w-3" />
                    {c}
                  </span>
                ))}
                {patient.allergies.length > 0 && (
                  <span className="inline-flex items-center rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-xs font-medium text-red-700">
                    ⚠ Allergies: {patient.allergies.join(", ")}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Phone className="h-4 w-4" />
                Call
              </Button>
              <Button size="sm" className="gap-1.5">
                <Pill className="h-4 w-4" />
                Adjust Meds
              </Button>
            </div>
          </div>

          <Separator />

          {/* Split panel */}
          <div className="grid gap-6 lg:grid-cols-12">

            {/* Left — Patient data */}
            <div className="lg:col-span-5 space-y-4">

              {/* Key metrics */}
              <div className="grid grid-cols-3 gap-3">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className={`text-2xl font-bold ${adherenceColor}`}>
                      {patient.adherence}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">Adherence</p>
                    <Progress
                      value={patient.adherence}
                      className="mt-2 h-1.5"
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="flex justify-center">
                      {latestSymptoms.length > 0 ? (
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                      ) : (
                        <Heart className="h-6 w-6 text-green-500" />
                      )}
                    </div>
                    <p className="text-xs font-medium mt-1">
                      {latestSymptoms.length > 0 ? latestSymptoms[0] : "No symptoms"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">Latest Signal</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <ShieldAlert
                      className={`h-6 w-6 mx-auto ${
                        patient.risk === "High"
                          ? "text-destructive"
                          : patient.risk === "Moderate"
                          ? "text-orange-500"
                          : "text-green-500"
                      }`}
                    />
                    <p className="text-xs font-medium mt-1">{patient.risk}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Risk Level</p>
                  </CardContent>
                </Card>
              </div>

              {/* Last check-in */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Last Check-in
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {patient.recentCheckIns[0] ? (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">{patient.recentCheckIns[0].date}</p>
                      <p className="text-sm">{patient.recentCheckIns[0].note}</p>
                      {latestSymptoms.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {latestSymptoms.map((s) => (
                            <Badge key={s} variant="destructive" className="text-xs">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Mood: {Array.from({ length: 5 }, (_, i) => (
                          <span key={i} className={i < patient.recentCheckIns[0].moodScore ? "text-yellow-500" : "text-muted"}>★</span>
                        ))}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No recent check-in data</p>
                  )}
                </CardContent>
              </Card>

              {/* Medications */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Pill className="h-4 w-4 text-muted-foreground" />
                    Current Medications
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <Accordion type="multiple">
                    {patient.medications.map((med, i) => (
                      <AccordionItem key={i} value={`med-${i}`}>
                        <AccordionTrigger className="text-sm py-3">
                          <div className="flex items-center gap-2 text-left pr-2">
                            <span>{med.name} {med.dose}</span>
                            <Badge
                              variant={med.adherenceRate >= 80 ? "outline" : med.adherenceRate >= 60 ? "secondary" : "destructive"}
                              className="text-xs ml-auto shrink-0"
                            >
                              {med.adherenceRate}%
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 text-xs text-muted-foreground">
                            <div className="flex justify-between">
                              <span>Frequency</span>
                              <span className="text-foreground">{med.frequency}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Last taken</span>
                              <span className="text-foreground">{med.lastTaken}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Refill due</span>
                              <span className="text-foreground">{med.refillDue}</span>
                            </div>
                            <Progress value={med.adherenceRate} className="mt-1 h-1.5" />
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>

              {/* Vitals */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    Recent Vitals
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 overflow-x-auto">
                  <VitalsTable patient={patient} />
                </CardContent>
              </Card>

            </div>

            {/* Right — AI Panel */}
            <div className="lg:col-span-7 space-y-4">
              <AISummaryCard patientId={patient.id} />
              <ChatWindow patient={patient} />
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
