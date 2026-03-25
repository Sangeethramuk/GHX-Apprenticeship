"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Activity, AlertTriangle, CheckCircle2, Clock, Eye, FilePlus2, Phone, Pill, User } from "lucide-react"

import { patients } from "@/lib/patient-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Home() {
  const router = useRouter()

  return (
    <div className="flex h-screen w-full flex-col bg-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">Wellytics Continuous Care</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Button render={<Link href="/prescriptions" />} nativeButton={false} variant="outline" size="sm">
            <FilePlus2 className="mr-2 h-4 w-4" />
            Write Prescription
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

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">

          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,248</div>
                <p className="text-xs text-muted-foreground">+12 since yesterday</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">7</div>
                <p className="text-xs text-muted-foreground">Requires immediate review</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg. Adherence</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <Progress value={78} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Recent Check-ins</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">432</div>
                <p className="text-xs text-muted-foreground">In the last 24 hours</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-7">
            {/* Patient Priority List */}
            <Card className="col-span-5">
              <CardHeader>
                <CardTitle>Priority Patient List</CardTitle>
                <CardDescription>Click a patient row or View to see full details with AI summary.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Condition</TableHead>
                      <TableHead>Adherence</TableHead>
                      <TableHead>Risk Signal</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patients.map((patient) => (
                      <TableRow
                        key={patient.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => router.push(`/patients/${patient.id}`)}
                      >
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell>{patient.conditions.join(", ")}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{patient.adherence}%</span>
                            <Progress value={patient.adherence} className="w-[60px]" />
                          </div>
                        </TableCell>
                        <TableCell>
                          {patient.recentCheckIns[0]?.symptoms.length > 0 ? (
                            <span className="flex items-center gap-1 text-sm text-destructive font-medium">
                              <AlertTriangle className="h-3 w-3" />
                              {patient.recentCheckIns[0].symptoms[0]}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">Normal</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              patient.risk === "High"
                                ? "destructive"
                                : patient.risk === "Moderate"
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {patient.risk}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="icon"
                              variant="outline"
                              title="View Patient"
                              onClick={(e) => {
                                e.stopPropagation()
                                router.push(`/patients/${patient.id}`)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              title="Call Patient"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Phone className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              title="Adjust Medication"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Pill className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Live Feed */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Live Feed</CardTitle>
                <CardDescription>Real-time check-ins & alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "Missed Medication", desc: "Riya K. missed morning dose (3rd day)", time: "10m ago", urgent: true },
                    { title: "Check-in Complete", desc: "Arjun M. reported fatigue", time: "2h ago", urgent: true },
                    { title: "Medication Taken", desc: "Sunita P. logged morning meds", time: "3h ago", urgent: false },
                    { title: "Check-in Complete", desc: "Priya S. feeling normal", time: "5h ago", urgent: false },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-3 border-l-2 pl-4 pb-4 border-muted -ml-px">
                      <div className="mt-1 flex">
                        {item.urgent ? (
                          <div className="-ml-[21px] mr-3 rounded-full bg-destructive p-1 ring-4 ring-background">
                            <AlertTriangle className="h-3 w-3 text-white" />
                          </div>
                        ) : (
                          <div className="-ml-[21px] mr-3 rounded-full bg-primary p-1 ring-4 ring-background">
                            <CheckCircle2 className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-1">
                        <p className={`text-sm font-medium leading-none ${item.urgent ? "text-destructive" : ""}`}>{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                        <span className="text-xs text-muted-foreground/50">{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  )
}
