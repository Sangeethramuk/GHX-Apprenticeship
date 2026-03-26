import { getPatientById } from "@/lib/mock-patients"

const MOCK_SUMMARIES: Record<number, string> = {
  1: "Arjun Mehta is a 54-year-old male managing Hypertension, currently at medium risk. His medication adherence is at 65% with some missed doses reported. Recent vitals show blood pressure readings in the 130-140/85-90 range. Continued monitoring and medication compliance support is recommended.",
  2: "Riya Kapoor is a 55-year-old female with cardiac conditions and hypertension, presenting as high priority. She has shown excellent medication adherence at 97%. Recent vitals are stable with BP around 120/80. Regular monitoring continues to be important for her cardiac health.",
  3: "Priya Nair is a 38-year-old female with hypothyroidism, currently at low risk. Her adherence is excellent at 97% this week. All recent check-ins report no symptoms. She is performing very well with no immediate clinical action required.",
  4: "Sunita Patel is a 38-year-old female with well-controlled hypothyroidism and exemplary medication adherence at 97% this week. All recent check-ins report feeling well. She is stable and continues to perform excellently.",
}

function getMockChatResponse(patientId: number, message: string): string {
  const patient = getPatientById(patientId)
  if (!patient) return "I'm sorry, I couldn't find the patient data to answer your question."

  const msg = message.toLowerCase()

  if (msg.includes("medication") || msg.includes("med") || msg.includes("dose") || msg.includes("drug")) {
    const medList = patient.medications
      .map((m) => `${m.name} ${m.dose} (${m.frequency}) — ${m.adherencePercent}% adherence`)
      .join("; ")
    return `${patient.name} is currently prescribed: ${medList}. Overall adherence is ${patient.adherence}%. ${
      patient.adherence < 60
        ? "The low adherence rate is concerning and warrants a follow-up call to understand barriers to medication intake."
        : patient.adherence < 80
        ? "Adherence is moderate — consider a brief check-in to reinforce the medication schedule."
        : "Adherence is excellent — no immediate action needed."
    }`
  }

  if (msg.includes("symptom") || msg.includes("complaint") || msg.includes("feeling") || msg.includes("reported")) {
    const latest = patient.checkIns[0]
    if (!latest) return `No recent check-in data is available for ${patient.name}.`
    const symptoms = latest.reportedSymptoms.length > 0 ? latest.reportedSymptoms.join(", ") : "no symptoms"
    return `In their most recent check-in on ${latest.date}, ${patient.name} reported ${symptoms}. Their mood was ${latest.mood}. ${latest.notes ? `Note: "${latest.notes}"` : ""}`
  }

  if (msg.includes("vital") || msg.includes("blood pressure") || msg.includes("glucose") || msg.includes("heart rate")) {
    const latestBP = patient.vitals.bloodPressureSystolic.at(-1)
    const latestDia = patient.vitals.bloodPressureDiastolic.at(-1)
    const latestHR = patient.vitals.heartRate.at(-1)
    const parts: string[] = []
    if (latestBP && latestDia) parts.push(`BP: ${latestBP.value}/${latestDia.value} mmHg`)
    if (latestHR) parts.push(`Heart Rate: ${latestHR.value} bpm`)
    const glucose = patient.vitals.glucose.at(-1)
    if (glucose) parts.push(`Glucose: ${glucose.value} mg/dL`)
    const date = latestBP?.date ?? "recent"
    return `Latest vitals for ${patient.name} (${date}): ${parts.join(", ")}. The trend should be reviewed for any escalating patterns.`
  }

  if (msg.includes("adherence") || msg.includes("compliance") || msg.includes("missed") || msg.includes("skip")) {
    return `${patient.name}'s adherence is ${patient.adherence}%. ${
      patient.adherence < 50
        ? "This is critically low. More than half of prescribed doses have been missed. Urgent intervention is advised."
        : patient.adherence < 75
        ? "This is below the target threshold of 75%. Consider a motivational check-in call."
        : "This is within an acceptable range. Keep monitoring and reinforce positive adherence habits."
    }`
  }

  if (msg.includes("risk") || msg.includes("concern") || msg.includes("priority") || msg.includes("urgent")) {
    return `${patient.name} is currently classified as ${patient.risk} risk. ${
      patient.risk === "Critical"
        ? "Immediate attention is warranted. Review their recent vitals, symptoms, and medication status carefully and consider proactive outreach today."
        : patient.risk === "Medium"
        ? "Monitor closely. Schedule a routine check-in and review adherence trends."
        : "The patient is stable. Continue current care plan and routine monitoring."
    }`
  }

  if (msg.includes("follow") || msg.includes("next step") || msg.includes("recommend") || msg.includes("action") || msg.includes("what should")) {
    const latestSymptoms = patient.checkIns[0]?.reportedSymptoms ?? []
    const actions: string[] = []
    if (patient.adherence < 60) actions.push("call the patient to address medication barriers")
    if (latestSymptoms.length > 0) actions.push(`follow up on reported symptoms: ${latestSymptoms.join(", ")}`)
    if (patient.risk === "Critical") actions.push("escalate review priority")
    if (actions.length === 0) actions.push("continue current monitoring plan")
    return `Recommended next steps for ${patient.name}: ${actions.join("; ")}. All clinical decisions should be validated against the full patient history.`
  }

  if (msg.includes("week") || msg.includes("summarize") || msg.includes("summary") || msg.includes("overview") || msg.includes("past")) {
    return MOCK_SUMMARIES[patientId] ?? `${patient.name} has ${patient.condition} with ${patient.adherence}% adherence.`
  }

  return `Based on available data, ${patient.name} (${patient.age} yrs, ${patient.condition} — ${patient.risk} risk) has ${patient.adherence}% medication adherence. Their last check-in was ${patient.lastCheckin}. Is there a specific aspect of their care you'd like to explore — medications, symptoms, vitals, or next steps?`
}

async function streamText(text: string): Promise<Response> {
  const encoder = new TextEncoder()
  const words = text.split(" ")
  const stream = new ReadableStream({
    async start(controller) {
      for (const word of words) {
        controller.enqueue(encoder.encode(word + " "))
        await new Promise((r) => setTimeout(r, 35))
      }
      controller.close()
    },
  })
  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { patientId, mode, newMessage } = body as {
      patientId: number
      mode: "summary" | "chat"
      messages?: { role: string; content: string }[]
      newMessage?: string
    }

    const patient = getPatientById(patientId)
    if (!patient) {
      return Response.json({ error: "Patient not found" }, { status: 404 })
    }

    if (mode === "summary") {
      const summary = MOCK_SUMMARIES[patientId] ?? `${patient.name} has ${patient.condition} with ${patient.adherence}% adherence.`
      return streamText(summary)
    }

    if (mode === "chat" && newMessage) {
      const response = getMockChatResponse(patientId, newMessage)
      return streamText(response)
    }

    return Response.json({ error: "Invalid request" }, { status: 400 })
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
