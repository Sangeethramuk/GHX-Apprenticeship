import { notFound } from "next/navigation"
import Link from "next/link"
import {
  Activity,
  AlertTriangle,
  Clock,
  Droplets,
  Heart,
  Phone,
  Pill,
  Scale,
  Thermometer,
  User,
  Video,
  Wind,
} from "lucide-react"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { MOCK_PATIENTS, toPatient } from "@/lib/mock-patients"
import { BackButton } from "./_components/BackButton"
import DailyProgressChart from "./_components/DailyProgressChart"
import VitalsCharts from "./_components/VitalsCharts"
import { AISummaryCard } from "./AISummaryCard"
import { ChatWindow } from "./ChatWindow"

export default async function PatientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const patient = MOCK_PATIENTS.find((p) => p.id === parseInt(id))
  if (!patient) notFound()

  // Pre-shape chart data for client components
  const bpData = patient.vitals.bloodPressureSystolic.map((s, i) => ({
    date: s.date,
    systolic: s.value,
    diastolic: patient.vitals.bloodPressureDiastolic[i]?.value ?? 0,
  }))

  const hrSpo2Data = patient.vitals.heartRate.map((h, i) => ({
    date: h.date,
    heartRate: h.value,
    spo2: patient.vitals.spo2[i]?.value ?? 0,
  }))

  const glucoseData = patient.vitals.glucose.map((g) => ({ date: g.date, value: g.value }))
  const weightData = patient.vitals.weight.map((w) => ({ date: w.date, value: w.value }))

  // Latest vital snapshot values
  const latestBPSys = patient.vitals.bloodPressureSystolic.at(-1)?.value ?? 0
  const latestBPDia = patient.vitals.bloodPressureDiastolic.at(-1)?.value ?? 0
  const latestHR = patient.vitals.heartRate.at(-1)?.value ?? 0
  const latestSpO2 = patient.vitals.spo2.at(-1)?.value ?? 0
  const latestTemp = patient.vitals.temperature.at(-1)?.value ?? 0
  const latestGlucose = patient.vitals.glucose.at(-1)?.value ?? 0
  const latestWeight = patient.vitals.weight.at(-1)?.value ?? 0

  const activeAlerts = patient.alerts.filter((a) => !a.resolved)
  const initials = patient.name.split(" ").map((n) => n[0]).join("")

  return (
    <div className="flex h-screen w-full flex-col bg-muted/20">
      {/* HEADER */}
      <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background px-6">
        <BackButton />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{patient.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-4">
          <Button render={<Link href={`/patients/${patient.id}/consultation`} />} nativeButton={false} variant="outline" size="sm">
            <Video className="mr-2 h-4 w-4" />
            Start Consultation
          </Button>
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Shift active
          </Button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
        </div>
      </header>

      {/* PATIENT IDENTITY BAR */}
      <div className="border-b bg-background px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <Avatar size="lg">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold">{patient.name}</h2>
              <Badge
                variant={
                  patient.risk === "Critical"
                    ? "destructive"
                    : patient.risk === "Medium"
                      ? "secondary"
                      : "outline"
                }
              >
                {patient.risk}
              </Badge>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>{patient.condition}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Age {patient.age}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Blood Type {patient.bloodType}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Dr. {patient.attendingDoctor.replace("Dr. ", "")}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Last check-in: {patient.lastCheckin}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="outline" title="Call Patient">
              <Phone className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" title="Adjust Medication">
              <Pill className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN - Patient Data */}
          <div className="lg:col-span-8 space-y-6">

          {/* ACTIVE ALERTS BANNER */}
          {activeAlerts.length > 0 && (
            <div className="space-y-2">
              {activeAlerts.map((alert) => (
                <Alert
                  key={alert.id}
                  variant={alert.severity === "Critical" ? "destructive" : "default"}
                >
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>{alert.type}</AlertTitle>
                  <AlertDescription>
                    {alert.description} — {alert.date}
                  </AlertDescription>
                  <AlertAction>
                    <Button
                      size="sm"
                      variant={alert.severity === "Critical" ? "destructive" : "outline"}
                    >
                      Resolve
                    </Button>
                  </AlertAction>
                </Alert>
              ))}
            </div>
          )}

          {/* CURRENT VITALS SNAPSHOT */}
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{latestBPSys}/{latestBPDia}</div>
                <p className="text-xs text-muted-foreground">mmHg</p>
                <Badge variant={latestBPSys > 140 ? "destructive" : "outline"} className="mt-1 text-xs">
                  {latestBPSys > 140 ? "High" : "Normal"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{latestHR}</div>
                <p className="text-xs text-muted-foreground">bpm</p>
                <Badge variant={latestHR > 100 ? "destructive" : "outline"} className="mt-1 text-xs">
                  {latestHR > 100 ? "Elevated" : "Normal"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">SpO2</CardTitle>
                <Wind className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{latestSpO2}%</div>
                <p className="text-xs text-muted-foreground">Oxygen saturation</p>
                <Badge variant={latestSpO2 < 95 ? "destructive" : "outline"} className="mt-1 text-xs">
                  {latestSpO2 < 95 ? "Low" : "Normal"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                <Thermometer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{latestTemp}°C</div>
                <p className="text-xs text-muted-foreground">Body temperature</p>
                <Badge variant={latestTemp > 37.5 ? "destructive" : "outline"} className="mt-1 text-xs">
                  {latestTemp > 37.5 ? "Elevated" : "Normal"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Glucose</CardTitle>
                <Droplets className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{latestGlucose}</div>
                <p className="text-xs text-muted-foreground">mg/dL</p>
                <Badge variant={latestGlucose > 126 ? "destructive" : "outline"} className="mt-1 text-xs">
                  {latestGlucose > 126 ? "High" : "Normal"}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Weight</CardTitle>
                <Scale className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{latestWeight}</div>
                <p className="text-xs text-muted-foreground">kg</p>
              </CardContent>
            </Card>
          </div>

          {/* VITALS CHARTS */}
          <VitalsCharts
            bpData={bpData}
            hrSpo2Data={hrSpo2Data}
            glucoseData={glucoseData}
            weightData={weightData}
          />

          {/* DAILY PROGRESS */}
          <DailyProgressChart dailyProgress={patient.dailyProgress} />

          {/* HISTORY TABS */}
          <Card>
            <CardHeader>
              <CardTitle>Patient History</CardTitle>
              <CardDescription>
                Visits, check-ins, medications, symptoms, admissions, and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="visits">
                <TabsList className="mb-4 flex-wrap h-auto gap-1">
                  <TabsTrigger value="visits">Visits</TabsTrigger>
                  <TabsTrigger value="checkins">Check-ins</TabsTrigger>
                  <TabsTrigger value="medications">Medications</TabsTrigger>
                  <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
                  <TabsTrigger value="admissions">Admissions</TabsTrigger>
                  <TabsTrigger value="alerts">Alerts</TabsTrigger>
                </TabsList>

                {/* Visits */}
                <TabsContent value="visits">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Doctor</TableHead>
                        <TableHead>Outcome</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patient.visits.map((visit) => (
                        <TableRow key={visit.id}>
                          <TableCell className="whitespace-nowrap">{visit.date}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                visit.type === "Emergency"
                                  ? "destructive"
                                  : visit.type === "Teleconsult"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {visit.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{visit.doctor}</TableCell>
                          <TableCell>{visit.outcome}</TableCell>
                          <TableCell className="max-w-[240px] truncate text-muted-foreground">
                            {visit.notes}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                {/* Check-ins */}
                <TabsContent value="checkins">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Mood</TableHead>
                        <TableHead>Symptoms</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patient.checkIns.map((ci) => (
                        <TableRow key={ci.id}>
                          <TableCell className="whitespace-nowrap">{ci.date}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                ci.mood === "Poor"
                                  ? "destructive"
                                  : ci.mood === "Fair"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {ci.mood}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {ci.reportedSymptoms.length === 0 ? (
                              <span className="text-muted-foreground">None</span>
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                {ci.reportedSymptoms.map((s) => (
                                  <Badge key={s} variant="outline">
                                    {s}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{ci.notes || "—"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                {/* Medications */}
                <TabsContent value="medications">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medication</TableHead>
                        <TableHead>Dose</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Since</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Adherence</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patient.medications.map((med) => (
                        <TableRow key={med.id}>
                          <TableCell className="font-medium">{med.name}</TableCell>
                          <TableCell>{med.dose}</TableCell>
                          <TableCell>{med.frequency}</TableCell>
                          <TableCell>{med.prescribedDate}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                med.status === "Discontinued"
                                  ? "destructive"
                                  : med.status === "On Hold"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {med.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="w-8 text-sm">{med.adherencePercent}%</span>
                              <Progress value={med.adherencePercent} className="w-[60px]" />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                {/* Symptoms */}
                <TabsContent value="symptoms">
                  {patient.symptoms.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">No symptoms recorded.</p>
                  ) : (
                    <Accordion>
                      {patient.symptoms.map((sym) => (
                        <AccordionItem key={sym.id} value={sym.id}>
                          <AccordionTrigger>
                            <div className="flex items-center gap-3">
                              <span className="w-28 shrink-0 text-xs text-muted-foreground">{sym.date}</span>
                              <span>{sym.symptom}</span>
                              <Badge
                                variant={
                                  sym.severity === "Severe"
                                    ? "destructive"
                                    : sym.severity === "Moderate"
                                      ? "secondary"
                                      : "outline"
                                }
                              >
                                {sym.severity}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-sm text-muted-foreground">
                              Status:{" "}
                              <span className={sym.resolved ? "text-primary font-medium" : "text-destructive font-medium"}>
                                {sym.resolved ? "Resolved" : "Active — under monitoring"}
                              </span>
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </TabsContent>

                {/* Admissions */}
                <TabsContent value="admissions">
                  {patient.admissions.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">No hospital admissions recorded.</p>
                  ) : (
                    <Accordion>
                      {patient.admissions.map((adm) => (
                        <AccordionItem key={adm.id} value={adm.id}>
                          <AccordionTrigger>
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="text-xs text-muted-foreground">
                                {adm.admittedDate} — {adm.dischargedDate ?? "Present"}
                              </span>
                              <span>{adm.reason}</span>
                              <Badge variant="outline">{adm.ward}</Badge>
                              {!adm.dischargedDate && (
                                <Badge variant="destructive">Currently Admitted</Badge>
                              )}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4">
                              <div>
                                <p className="mb-1 text-sm font-medium">Attending Doctor</p>
                                <p className="text-sm text-muted-foreground">{adm.attendingDoctor}</p>
                              </div>
                              {adm.dischargeNotes && (
                                <div>
                                  <p className="mb-1 text-sm font-medium">Discharge Notes</p>
                                  <p className="text-sm text-muted-foreground">{adm.dischargeNotes}</p>
                                </div>
                              )}
                              <div>
                                <p className="mb-2 text-sm font-medium">Medications at Admission</p>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Medication</TableHead>
                                      <TableHead>Dose</TableHead>
                                      <TableHead>Action</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {adm.medicationsAtAdmission.map((m, i) => (
                                      <TableRow key={i}>
                                        <TableCell>{m.name}</TableCell>
                                        <TableCell>{m.dose}</TableCell>
                                        <TableCell>
                                          <Badge
                                            variant={
                                              m.action === "Stopped"
                                                ? "destructive"
                                                : m.action === "Started"
                                                  ? "default"
                                                  : m.action === "Changed"
                                                    ? "secondary"
                                                    : "outline"
                                            }
                                          >
                                            {m.action}
                                          </Badge>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </TabsContent>

                {/* Alerts */}
                <TabsContent value="alerts">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Resolved By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {patient.alerts.map((alert) => (
                        <TableRow key={alert.id}>
                          <TableCell className="whitespace-nowrap">{alert.date}</TableCell>
                          <TableCell>
                            <Badge
                              variant={alert.type === "Emergency" ? "destructive" : "outline"}
                            >
                              {alert.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[220px] truncate">{alert.description}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                alert.severity === "Critical"
                                  ? "destructive"
                                  : alert.severity === "Medium"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              {alert.severity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={alert.resolved ? "outline" : "destructive"}>
                              {alert.resolved ? "Resolved" : "Active"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {alert.resolvedBy ?? "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          </div>

          {/* RIGHT COLUMN - AI Panel */}
          <div className="lg:col-span-4 space-y-4">
            <AISummaryCard patientId={patient.id} />
            <ChatWindow patient={toPatient(patient)} />
          </div>

        </div>
      </main>
    </div>
  )
}
