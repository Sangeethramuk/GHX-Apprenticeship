"use client"

import { useState } from "react"
import Link from "next/link"
import {
  FilePlus2,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  User,
  CheckCircle2,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// ─── Static Data ────────────────────────────────────────────────────────────

const PATIENTS = [
  { value: "arjun-mehta", label: "Arjun Mehta", condition: "Hypertension" },
  { value: "priya-sharma", label: "Priya Sharma", condition: "Type 2 Diabetes" },
  { value: "ramesh-kumar", label: "Ramesh Kumar", condition: "Cardiac" },
  { value: "sunita-patel", label: "Sunita Patel", condition: "Thyroid" },
]

const DRUGS = [
  { value: "metformin", label: "Metformin", category: "Antidiabetic" },
  { value: "amlodipine", label: "Amlodipine", category: "Antihypertensive" },
  { value: "lisinopril", label: "Lisinopril", category: "Antihypertensive" },
  { value: "atorvastatin", label: "Atorvastatin", category: "Statin" },
  { value: "levothyroxine", label: "Levothyroxine", category: "Thyroid" },
  { value: "aspirin", label: "Aspirin", category: "Antiplatelet" },
  { value: "metoprolol", label: "Metoprolol", category: "Beta-blocker" },
  { value: "omeprazole", label: "Omeprazole", category: "Proton Pump Inhibitor" },
  { value: "warfarin", label: "Warfarin", category: "Anticoagulant" },
  { value: "amoxicillin", label: "Amoxicillin", category: "Antibiotic" },
]

const HISTORY = [
  { id: "RX-2401", patient: "Arjun Mehta", medication: "Amlodipine", dosage: "5mg", frequency: "Once daily", date: "Mar 20, 2026", status: "Active" },
  { id: "RX-2402", patient: "Priya Sharma", medication: "Metformin", dosage: "500mg", frequency: "Twice daily", date: "Mar 18, 2026", status: "Active" },
  { id: "RX-2403", patient: "Ramesh Kumar", medication: "Metoprolol", dosage: "25mg", frequency: "Twice daily", date: "Mar 15, 2026", status: "Active" },
  { id: "RX-2404", patient: "Sunita Patel", medication: "Levothyroxine", dosage: "50mcg", frequency: "Once daily", date: "Mar 10, 2026", status: "Completed" },
]

// ─── AI Suggestion Data ──────────────────────────────────────────────────────

type DrugSuggestion = {
  recommendedDose: string
  notes: string[]
  warnings: string[] | null
  interactions: string | null
}

const AI_SUGGESTIONS: Record<string, DrugSuggestion> = {
  metformin: {
    recommendedDose: "500mg–1000mg twice daily with meals",
    notes: [
      "Start low (500mg once daily) and titrate to minimise GI side effects.",
      "Monitor renal function (eGFR) before initiating and periodically.",
      "Hold before contrast procedures.",
    ],
    warnings: ["Contraindicated if eGFR < 30 mL/min/1.73m²"],
    interactions: null,
  },
  amlodipine: {
    recommendedDose: "5mg once daily; may increase to 10mg",
    notes: [
      "Peripheral oedema is the most common side effect — reassure patient.",
      "Takes 7–14 days for full antihypertensive effect.",
    ],
    warnings: null,
    interactions: null,
  },
  lisinopril: {
    recommendedDose: "10mg once daily initially; target 20–40mg",
    notes: [
      "Monitor potassium and serum creatinine at baseline and after dose changes.",
      "Persistent dry cough in ~10% of patients — consider ARB switch if intolerable.",
    ],
    warnings: ["Contraindicated in pregnancy — confirm patient is not pregnant."],
    interactions: "Caution with NSAIDs (reduces efficacy, increases renal risk).",
  },
  atorvastatin: {
    recommendedDose: "10–80mg once daily (typically at night)",
    notes: [
      "Check baseline LFTs; recheck if patient develops symptoms.",
      "Myopathy risk increases with higher doses — ask about muscle pain.",
    ],
    warnings: null,
    interactions: "Avoid with strong CYP3A4 inhibitors (e.g., clarithromycin, grapefruit juice).",
  },
  levothyroxine: {
    recommendedDose: "1.6 mcg/kg/day; start 25–50 mcg in elderly or cardiac patients",
    notes: [
      "Administer 30–60 minutes before breakfast on an empty stomach.",
      "Recheck TSH in 6–8 weeks after initiation or dose change.",
    ],
    warnings: null,
    interactions: "Absorption reduced by calcium, iron, antacids — separate by 4 hours.",
  },
  aspirin: {
    recommendedDose: "75–100mg once daily for cardioprotection",
    notes: [
      "Use enteric-coated formulation to reduce GI irritation.",
      "Review indication annually — evidence of net benefit varies by patient profile.",
    ],
    warnings: null,
    interactions: "Increased bleeding risk with anticoagulants, NSAIDs, and SSRIs.",
  },
  metoprolol: {
    recommendedDose: "25mg–100mg twice daily (tartrate); 25mg–200mg once daily (succinate)",
    notes: [
      "Do not abruptly discontinue — taper over 1–2 weeks.",
      "Preferred in cardiac patients with HFrEF — use succinate formulation.",
    ],
    warnings: ["Avoid in decompensated heart failure or severe bradycardia."],
    interactions: "Caution with other rate-slowing agents (verapamil, diltiazem).",
  },
  omeprazole: {
    recommendedDose: "20–40mg once daily before breakfast",
    notes: [
      "Reassess need at regular intervals — avoid long-term use without clear indication.",
      "May mask symptoms of gastric malignancy — investigate before prescribing in high-risk patients.",
    ],
    warnings: null,
    interactions: "May reduce efficacy of clopidogrel — consider pantoprazole instead.",
  },
  warfarin: {
    recommendedDose: "Individualised — target INR 2.0–3.0 for most indications",
    notes: [
      "Requires frequent INR monitoring, especially when initiating.",
      "Many drug–drug and drug–food interactions — review full medication list.",
    ],
    warnings: [
      "HIGH RISK: Narrow therapeutic index — bleeding risk if supratherapeutic.",
      "Educate patient to avoid large dietary changes (vitamin K foods).",
    ],
    interactions: "Interacts with aspirin, NSAIDs, antibiotics, and antifungals — always review co-medications.",
  },
  amoxicillin: {
    recommendedDose: "500mg three times daily for most infections (7–10 days)",
    notes: [
      "Confirm penicillin allergy status before prescribing.",
      "Review culture results when available and de-escalate if appropriate.",
    ],
    warnings: null,
    interactions: null,
  },
  _default: {
    recommendedDose: "Refer to current prescribing guidelines",
    notes: [
      "Verify indication and contraindications before prescribing.",
      "Review full patient medication list for potential interactions.",
    ],
    warnings: null,
    interactions: null,
  },
}

function getSuggestion(drugValue: string | null): DrugSuggestion {
  return AI_SUGGESTIONS[drugValue ?? ""] ?? AI_SUGGESTIONS["_default"]
}

function getDrugLabel(value: string | null) {
  return DRUGS.find((d) => d.value === value)?.label ?? value ?? ""
}

function getPatientLabel(value: string | null) {
  return PATIENTS.find((p) => p.value === value)?.label ?? value ?? ""
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default function PrescriptionsPage() {
  const [patientValue, setPatientValue] = useState<string | null>("")
  const [medicationValue, setMedicationValue] = useState<string | null>("")
  const [dosage, setDosage] = useState("")
  const [frequency, setFrequency] = useState<string | null>("")
  const [route, setRoute] = useState<string | null>("")
  const [duration, setDuration] = useState("")
  const [durationUnit, setDurationUnit] = useState<string | null>("days")
  const [instructions, setInstructions] = useState("")

  const [aiState, setAiState] = useState<"idle" | "loading" | "result">("idle")

  function handleGenerateSuggestion() {
    setAiState("loading")
    setTimeout(() => setAiState("result"), 1500)
  }

  const suggestion = getSuggestion(medicationValue)

  const frequencyLabels: Record<string, string> = {
    "once-daily": "Once daily",
    "twice-daily": "Twice daily",
    "three-daily": "Three times daily",
    "every-8h": "Every 8 hours",
    "as-needed": "As needed",
  }

  const routeLabels: Record<string, string> = {
    oral: "Oral",
    topical: "Topical",
    injection: "Injection",
    inhalation: "Inhalation",
    sublingual: "Sublingual",
  }

  return (
    <div className="flex h-screen w-full flex-col bg-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
        <div className="flex items-center gap-2">
          <FilePlus2 className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">Write Prescription</h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
          <Button render={<Link href="/" />} nativeButton={false} variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">

          {/* Top Row: Form + AI Panel */}
          <div className="grid gap-6 lg:grid-cols-3">

            {/* Prescription Form */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>New Prescription</CardTitle>
                <CardDescription>Fill in the details and generate AI-assisted suggestions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">

                <Field>
                  <FieldLabel>Patient</FieldLabel>
                  <Combobox value={patientValue} onValueChange={setPatientValue}>
                    <ComboboxInput showTrigger showClear placeholder="Search patient...">
                      <ComboboxContent>
                        <ComboboxList>
                          {PATIENTS.map((p) => (
                            <ComboboxItem key={p.value} value={p.value}>
                              {p.label}
                              <span className="ml-auto text-xs text-muted-foreground">{p.condition}</span>
                            </ComboboxItem>
                          ))}
                          <ComboboxEmpty>No patient found.</ComboboxEmpty>
                        </ComboboxList>
                      </ComboboxContent>
                    </ComboboxInput>
                  </Combobox>
                </Field>

                <Field>
                  <FieldLabel>Medication</FieldLabel>
                  <Combobox value={medicationValue} onValueChange={(v) => { setMedicationValue(v); setAiState("idle") }}>
                    <ComboboxInput showTrigger showClear placeholder="Search medication...">
                      <ComboboxContent>
                        <ComboboxList>
                          {DRUGS.map((d) => (
                            <ComboboxItem key={d.value} value={d.value}>
                              {d.label}
                              <span className="ml-auto text-xs text-muted-foreground">{d.category}</span>
                            </ComboboxItem>
                          ))}
                          <ComboboxEmpty>No medication found.</ComboboxEmpty>
                        </ComboboxList>
                      </ComboboxContent>
                    </ComboboxInput>
                  </Combobox>
                </Field>

                <Field>
                  <FieldLabel>Dosage</FieldLabel>
                  <Input
                    placeholder="e.g. 500mg"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                  />
                  <FieldDescription>Include unit (mg, mcg, ml, etc.)</FieldDescription>
                </Field>

                <Field>
                  <FieldLabel>Frequency</FieldLabel>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="once-daily">Once daily</SelectItem>
                        <SelectItem value="twice-daily">Twice daily</SelectItem>
                        <SelectItem value="three-daily">Three times daily</SelectItem>
                        <SelectItem value="every-8h">Every 8 hours</SelectItem>
                        <SelectItem value="as-needed">As needed</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Route</FieldLabel>
                  <Select value={route} onValueChange={setRoute}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select route" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="oral">Oral</SelectItem>
                        <SelectItem value="topical">Topical</SelectItem>
                        <SelectItem value="injection">Injection</SelectItem>
                        <SelectItem value="inhalation">Inhalation</SelectItem>
                        <SelectItem value="sublingual">Sublingual</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Duration</FieldLabel>
                  <div className="flex gap-2">
                    <Input
                      className="w-20"
                      placeholder="e.g. 7"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                    <Select value={durationUnit} onValueChange={setDurationUnit}>
                      <SelectTrigger className="flex-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="days">Days</SelectItem>
                          <SelectItem value="weeks">Weeks</SelectItem>
                          <SelectItem value="months">Months</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </Field>

                <Field>
                  <FieldLabel>Special Instructions</FieldLabel>
                  <Textarea
                    placeholder="e.g. Take with food, avoid alcohol..."
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                  />
                </Field>

              </CardContent>
              <CardFooter className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={handleGenerateSuggestion}
                  disabled={!medicationValue || aiState === "loading"}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {aiState === "loading" ? "Generating..." : "Generate AI Suggestion"}
                </Button>
                <Button variant="outline">Save</Button>
              </CardFooter>
            </Card>

            {/* AI Suggestions Panel */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      AI Suggestions
                    </CardTitle>
                    <CardDescription>Real-time clinical guidance based on the selected medication.</CardDescription>
                  </div>
                  <Badge variant={aiState === "result" ? "default" : "outline"}>
                    {aiState === "result" ? "Ready" : "Waiting"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>

                {/* Idle state */}
                {aiState === "idle" && (
                  <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-muted-foreground">
                    <Sparkles className="h-10 w-10 opacity-30" />
                    <p className="text-sm">Select a medication and click <span className="font-medium text-foreground">Generate AI Suggestion</span> to get started.</p>
                  </div>
                )}

                {/* Loading state */}
                {aiState === "loading" && (
                  <div className="space-y-3 py-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-4 w-4/5" />
                  </div>
                )}

                {/* Result state */}
                {aiState === "result" && (
                  <div className="space-y-4">

                    {/* Warnings */}
                    {suggestion.warnings && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Safety Warning</AlertTitle>
                        <AlertDescription>
                          <ul className="mt-1 list-disc pl-4 space-y-1">
                            {suggestion.warnings.map((w, i) => (
                              <li key={i}>{w}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Interactions */}
                    {suggestion.interactions && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Drug Interactions</AlertTitle>
                        <AlertDescription>{suggestion.interactions}</AlertDescription>
                      </Alert>
                    )}

                    {/* Recommended Dose */}
                    <Card size="sm">
                      <CardContent>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Recommended Dose</p>
                        <p className="font-semibold text-sm">{suggestion.recommendedDose}</p>
                      </CardContent>
                    </Card>

                    {/* Clinical Notes */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Clinical Notes</p>
                      <ul className="space-y-2">
                        {suggestion.notes.map((note, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Separator />

                    {/* Prescription Preview */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Prescription Preview</p>
                      <div className="rounded-lg bg-muted/50 p-4 text-sm space-y-1.5">
                        <div className="flex gap-2">
                          <span className="w-28 shrink-0 text-muted-foreground">Patient</span>
                          <span className="font-medium">{patientValue ? getPatientLabel(patientValue) : <span className="text-muted-foreground italic">Not selected</span>}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="w-28 shrink-0 text-muted-foreground">Medication</span>
                          <span className="font-medium">{getDrugLabel(medicationValue)}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="w-28 shrink-0 text-muted-foreground">Dosage</span>
                          <span className="font-medium">{dosage || <span className="text-muted-foreground italic">Not entered</span>}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="w-28 shrink-0 text-muted-foreground">Frequency</span>
                          <span className="font-medium">{frequency ? frequencyLabels[frequency] : <span className="text-muted-foreground italic">Not selected</span>}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="w-28 shrink-0 text-muted-foreground">Route</span>
                          <span className="font-medium">{route ? routeLabels[route] : <span className="text-muted-foreground italic">Not selected</span>}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="w-28 shrink-0 text-muted-foreground">Duration</span>
                          <span className="font-medium">{duration ? `${duration} ${durationUnit}` : <span className="text-muted-foreground italic">Not entered</span>}</span>
                        </div>
                        {instructions && (
                          <div className="flex gap-2">
                            <span className="w-28 shrink-0 text-muted-foreground">Instructions</span>
                            <span className="font-medium">{instructions}</span>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                )}

              </CardContent>
            </Card>
          </div>

          {/* Prescription History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>Prescription History</CardTitle>
                  <CardDescription>Recent prescriptions written for your patients.</CardDescription>
                </div>
                <Badge variant="secondary">{HISTORY.length} prescriptions</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>RX ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Medication</TableHead>
                    <TableHead>Dosage</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {HISTORY.map((rx) => (
                    <TableRow key={rx.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{rx.id}</TableCell>
                      <TableCell className="font-medium">{rx.patient}</TableCell>
                      <TableCell>{rx.medication}</TableCell>
                      <TableCell>{rx.dosage}</TableCell>
                      <TableCell>{rx.frequency}</TableCell>
                      <TableCell className="text-muted-foreground">{rx.date}</TableCell>
                      <TableCell>
                        <Badge variant={rx.status === "Active" ? "default" : "outline"}>
                          {rx.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  )
}
