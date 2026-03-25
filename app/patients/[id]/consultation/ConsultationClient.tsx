"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  Activity,
  Bot,
  ChevronLeft,
  Mic,
  MicOff,
  RotateCcw,
  Stethoscope,
  Pill,
} from "lucide-react"

import type { Patient } from "@/lib/patient-data"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

// Extend window type for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

type ConsultationPhase = "idle" | "recording" | "processing" | "complete"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0")
  const s = (seconds % 60).toString().padStart(2, "0")
  return `${m}:${s}`
}

function parseSummaryIntoSections(text: string): { heading: string; body: string }[] {
  const blocks = text.split("\n\n").filter(Boolean)
  return blocks.map((block) => {
    const lines = block.split("\n")
    const firstLine = lines[0].trim()
    const isHeading = /^[A-Z][A-Z\s\/—\-]+$/.test(firstLine) && firstLine.length > 3
    return {
      heading: isHeading ? firstLine : "",
      body: isHeading ? lines.slice(1).join("\n").trim() : block.trim(),
    }
  })
}

interface Props {
  patient: Patient
}

export function ConsultationClient({ patient }: Props) {
  const [phase, setPhase] = useState<ConsultationPhase>("idle")
  const [transcript, setTranscript] = useState<string>("")
  const [interimTranscript, setInterimTranscript] = useState<string>("")
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0)
  const [summary, setSummary] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const transcriptRef = useRef<string>("")
  const phaseRef = useRef<ConsultationPhase>("idle")
  const scrollRef = useRef<HTMLDivElement>(null)

  // Keep phaseRef in sync with phase state
  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  // Timer — starts on recording, clears on exit
  useEffect(() => {
    if (phase === "recording") {
      setElapsedSeconds(0)
      timerRef.current = setInterval(() => {
        setElapsedSeconds((s) => s + 1)
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [phase])

  // Auto-scroll transcript to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [transcript, interimTranscript])

  // Cleanup on unmount (user navigates away mid-recording)
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null
        recognitionRef.current.stop()
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop())
      }
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  async function startConsultation() {
    setError(null)
    setTranscript("")
    setInterimTranscript("")
    setSummary("")
    transcriptRef.current = ""

    const SpeechRecognitionAPI =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null

    if (!SpeechRecognitionAPI) {
      setError("Live transcription requires Chrome or Edge. Please switch browsers to use this feature.")
      return
    }

    const recognition = new SpeechRecognitionAPI()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = ""
      let finalAddition = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalAddition += result[0].transcript + " "
        } else {
          interim += result[0].transcript
        }
      }
      if (finalAddition) {
        transcriptRef.current += finalAddition
        setTranscript(transcriptRef.current)
      }
      setInterimTranscript(interim)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === "not-allowed") {
        setError("Microphone access was denied. Please allow microphone permissions and try again.")
        setPhase("idle")
      } else if (event.error === "no-speech") {
        // Non-fatal — browser fires this after silence, recognition continues
      } else if (event.error === "network") {
        setError("Network error during transcription. Please check your connection.")
      } else {
        console.warn("SpeechRecognition error:", event.error)
      }
    }

    recognition.onend = () => {
      // Restart if still recording (handles browser auto-stop on silence)
      if (phaseRef.current === "recording") {
        try {
          recognition.start()
        } catch {
          // Ignore — may already be restarting
        }
      }
    }

    recognitionRef.current = recognition

    // MediaRecorder as audio backup (non-fatal if unavailable)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorder.start(1000)
      mediaRecorderRef.current = mediaRecorder
    } catch {
      // Non-fatal — transcription via SpeechRecognition can still proceed
    }

    recognition.start()
    setPhase("recording")
  }

  async function stopConsultation() {
    // Stop SpeechRecognition
    if (recognitionRef.current) {
      recognitionRef.current.onend = null
      recognitionRef.current.stop()
      recognitionRef.current = null
    }

    // Stop MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop())
      mediaRecorderRef.current = null
    }

    setInterimTranscript("")

    const finalTranscript = transcriptRef.current.trim()
    if (!finalTranscript) {
      setError("No speech was detected during the consultation. Please try again.")
      setPhase("idle")
      return
    }

    setPhase("processing")
    await generateSummary(finalTranscript)
  }

  async function generateSummary(finalTranscript: string) {
    setSummary("")
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId: patient.id, transcript: finalTranscript }),
      })

      if (!res.ok) throw new Error("Failed to generate summary")

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let accumulated = ""

      // Switch to complete early so the summary area renders and streams in
      setPhase("complete")

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setSummary(accumulated)
      }
    } catch {
      setError("Unable to generate consultation summary. The transcript has been preserved above.")
      setPhase("complete")
    }
  }

  function resetConsultation() {
    setPhase("idle")
    setTranscript("")
    setInterimTranscript("")
    setSummary("")
    setError(null)
    setElapsedSeconds(0)
    transcriptRef.current = ""
  }

  const riskVariant =
    patient.risk === "High"
      ? "destructive"
      : patient.risk === "Moderate"
      ? "secondary"
      : "outline"

  const summaryBlocks = summary ? parseSummaryIntoSections(summary) : []

  return (
    <div className="flex h-screen flex-col bg-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background px-6">
        <Button
          render={<Link href={`/patients/${patient.id}`} />}
          nativeButton={false}
          variant="ghost"
          size="sm"
          className="gap-1.5"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Patient
        </Button>
        <Separator orientation="vertical" className="h-5" />
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <span className="text-sm font-semibold">Wellytics Continuous Care</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">{patient.name}</span>
          <Badge variant="default" className="gap-1.5">
            {phase === "recording" && (
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
            )}
            <Stethoscope className="h-3 w-3" />
            Live Consultation
          </Badge>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-12">

            {/* Left Panel */}
            <div className="space-y-4 lg:col-span-4">

              {/* Patient Context Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Patient
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(patient.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {patient.age}y · {patient.gender === "M" ? "Male" : "Female"} · {patient.bloodType}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {patient.conditions.map((c) => (
                      <Badge key={c} variant="secondary" className="text-xs">
                        {c}
                      </Badge>
                    ))}
                    <Badge variant={riskVariant} className="text-xs">
                      {patient.risk} Risk
                    </Badge>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                      <Pill className="h-3 w-3" />
                      Current Medications
                    </p>
                    {patient.medications.map((med) => (
                      <div key={med.name} className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium">{med.name}</p>
                        <p className="text-xs text-muted-foreground text-right">{med.dose}</p>
                      </div>
                    ))}
                  </div>

                  {patient.allergies.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Allergies</p>
                        <div className="flex flex-wrap gap-1">
                          {patient.allergies.map((a) => (
                            <Badge key={a} variant="destructive" className="text-xs">
                              {a}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Controls Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                    Consultation Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Timer */}
                  <div className="text-center">
                    <p className="font-mono text-4xl font-bold tracking-tight tabular-nums">
                      {formatTimer(elapsedSeconds)}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {phase === "idle" && "Ready to start"}
                      {phase === "recording" && "Recording in progress..."}
                      {phase === "processing" && "Generating summary..."}
                      {phase === "complete" && "Consultation complete"}
                    </p>
                  </div>

                  {/* Action Button */}
                  {phase === "idle" && (
                    <Button className="w-full gap-2" onClick={startConsultation}>
                      <Mic className="h-4 w-4" />
                      Start Consultation
                    </Button>
                  )}

                  {phase === "recording" && (
                    <Button
                      className="w-full gap-2"
                      variant="destructive"
                      onClick={stopConsultation}
                    >
                      <span className="relative flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
                      </span>
                      <MicOff className="h-4 w-4" />
                      Stop Recording
                    </Button>
                  )}

                  {phase === "processing" && (
                    <Button className="w-full gap-2" variant="secondary" disabled>
                      <Spinner className="h-4 w-4" />
                      Generating Summary...
                    </Button>
                  )}

                  {phase === "complete" && (
                    <Button
                      className="w-full gap-2"
                      variant="outline"
                      onClick={resetConsultation}
                    >
                      <RotateCcw className="h-4 w-4" />
                      Start New Consultation
                    </Button>
                  )}

                  {/* Error Alert */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription className="text-xs">{error}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Panel */}
            <div className="space-y-4 lg:col-span-8">

              {/* Live Transcript Card */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="h-4 w-4 text-muted-foreground" />
                    Live Transcript
                  </CardTitle>
                  {phase === "recording" && (
                    <Badge variant="destructive" className="gap-1.5 animate-pulse">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      Listening
                    </Badge>
                  )}
                  {(transcript || interimTranscript) && phase !== "recording" && (
                    <Badge variant="secondary" className="text-xs">
                      {transcript.trim().split(/\s+/).filter(Boolean).length} words
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-72 rounded-md border bg-muted/30 p-4">
                    {phase === "idle" && !transcript && (
                      <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-muted-foreground">
                        <Mic className="h-8 w-8 opacity-30" />
                        <p className="text-sm">Click "Start Consultation" to begin recording</p>
                        <p className="text-xs opacity-70">Requires Chrome or Edge with microphone access</p>
                      </div>
                    )}
                    {(transcript || interimTranscript || phase === "recording") && (
                      <p className="text-sm leading-relaxed">
                        {transcript}
                        {interimTranscript && (
                          <span className="italic text-muted-foreground">{interimTranscript}</span>
                        )}
                        {phase === "recording" && (
                          <span className="ml-0.5 animate-pulse text-primary">|</span>
                        )}
                      </p>
                    )}
                    <div ref={scrollRef} />
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* AI Summary Card — shown when processing or complete */}
              {(phase === "processing" || phase === "complete") && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="h-4 w-4 text-primary" />
                      AI Clinical Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {phase === "processing" && !summary && (
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    )}
                    {summary && (
                      <ScrollArea className="h-96">
                        <div className="space-y-4 pr-2">
                          {summaryBlocks.map((block, i) => (
                            <div key={i}>
                              {block.heading && (
                                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                  {block.heading}
                                </p>
                              )}
                              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                {block.body}
                              </p>
                              {i < summaryBlocks.length - 1 && <Separator className="mt-4" />}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
