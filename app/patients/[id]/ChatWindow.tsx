"use client"

import { useEffect, useRef, useState } from "react"
import { MessageCircle, Send } from "lucide-react"

import type { Patient } from "@/lib/mock-patients"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"

interface Message {
  role: "user" | "assistant"
  content: string
}

const QUICK_QUESTIONS = [
  "Summarize the last 3 weeks",
  "Are medications appropriate?",
  "What follow-up is recommended?",
  "Explain the adherence drop",
]

interface ChatWindowProps {
  patient: Patient
}

export function ChatWindow({ patient }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, streamingContent])

  async function sendMessage(text: string) {
    if (!text.trim() || isStreaming) return

    const userMessage: Message = { role: "user", content: text.trim() }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsStreaming(true)
    setStreamingContent("")

    try {
      const res = await fetch("/api/patient-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: patient.id,
          mode: "chat",
          messages: messages,
          newMessage: text.trim(),
        }),
      })

      if (!res.ok) throw new Error("Request failed")

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let accumulated = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setStreamingContent(accumulated)
      }

      setMessages((prev) => [...prev, { role: "assistant", content: accumulated }])
      setStreamingContent("")
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't process that request. Please try again.",
        },
      ])
      setStreamingContent("")
    } finally {
      setIsStreaming(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(inputValue)
    }
  }

  return (
    <Card className="flex flex-col" style={{ minHeight: "420px" }}>
      <CardHeader className="flex flex-row items-center gap-2 pb-3 shrink-0">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
          <MessageCircle className="h-4 w-4 text-primary" />
        </div>
        <CardTitle className="text-sm font-semibold">Ask AI about {patient.name}</CardTitle>
        {isStreaming && <Spinner className="ml-auto h-4 w-4 text-muted-foreground" />}
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3 p-4 pt-0 min-h-0">
        {/* Message area */}
        <ScrollArea className="flex-1 pr-1" style={{ height: "260px" }}>
          {messages.length === 0 && !isStreaming ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-6">
              <p className="text-xs text-muted-foreground text-center">
                Ask anything about {patient.name}&apos;s care
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {QUICK_QUESTIONS.map((q) => (
                  <Button
                    key={q}
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => sendMessage(q)}
                    disabled={isStreaming}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-1">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <span className="text-[10px] text-muted-foreground px-1">
                    {msg.role === "user" ? "You" : "Wellytics AI"}
                  </span>
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-muted text-foreground rounded-bl-none"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Live streaming bubble */}
              {isStreaming && (
                <div className="flex flex-col gap-1 items-start">
                  <span className="text-[10px] text-muted-foreground px-1">Wellytics AI</span>
                  <div className="max-w-[85%] rounded-lg rounded-bl-none bg-muted px-3 py-2 text-sm leading-relaxed text-foreground">
                    {streamingContent || (
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Spinner className="h-3 w-3" />
                        Thinking...
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </ScrollArea>

        <Separator />

        {/* Input area */}
        <div className="flex gap-2 items-end shrink-0">
          <Textarea
            placeholder="Ask about medications, vitals, symptoms..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
            rows={2}
            className="resize-none text-sm"
          />
          <Button
            size="icon"
            onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim() || isStreaming}
            className="shrink-0 h-10 w-10"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center">
          Press Enter to send · Shift+Enter for new line
        </p>
      </CardContent>
    </Card>
  )
}
