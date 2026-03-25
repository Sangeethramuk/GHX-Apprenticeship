"use client"

import { useEffect, useState } from "react"
import { Bot, RefreshCw } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

interface AISummaryCardProps {
  patientId: number
}

export function AISummaryCard({ patientId }: AISummaryCardProps) {
  const [summary, setSummary] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function fetchSummary() {
    setIsLoading(true)
    setError(null)
    setSummary("")

    try {
      const res = await fetch("/api/patient-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId, mode: "summary" }),
      })

      if (!res.ok) throw new Error("Failed to load summary")

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let accumulated = ""

      setIsLoading(false)

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setSummary(accumulated)
      }
    } catch {
      setIsLoading(false)
      setError("Unable to load AI summary. Please try again.")
    }
  }

  useEffect(() => {
    fetchSummary()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <CardTitle className="text-sm font-semibold">AI Clinical Summary</CardTitle>
        </div>
        {isLoading && <Spinner className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>

      <CardContent>
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 gap-1.5 text-xs ml-4"
                onClick={fetchSummary}
              >
                <RefreshCw className="h-3 w-3" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && summary && (
          <p className="text-sm leading-relaxed text-foreground">{summary}</p>
        )}
      </CardContent>
    </Card>
  )
}
