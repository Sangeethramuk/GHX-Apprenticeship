import { getPatientById } from "@/lib/patient-data"

// Mock clinical summaries per patient
const MOCK_SUMMARIES: Record<number, string> = {
  1: "Arjun Mehta is a 42-year-old male managing both Type 2 Diabetes and Hypertension, currently flagged as high risk. His medication adherence has dropped to 57% over the past week, with multiple missed doses of all three medications. He has recently reported fatigue and blurred vision, which may indicate worsening glycaemic control — an immediate medication review and check-in call is recommended.",
  2: "Riya Kapoor is a 55-year-old female with ischemic cardiac disease and hypertension, presenting as the highest-priority patient on the panel today. She has missed medications for 3 consecutive days, bringing her weekly adherence to just 29%, and her most recent check-in reported chest tightness and shortness of breath. Her heart rate trend is escalating (88 to 104 bpm over 5 days) and urgent outreach is strongly advised.",
  3: "Priya Nair is a 38-year-old female with hypothyroidism, currently at moderate risk. Her adherence is 71% this week with one missed dose noted. TSH levels have remained within normal range (2.6–3.1 mIU/L), and her most recent check-in today reported no symptoms. Continued monitoring is appropriate with a reminder to maintain fasting schedule for Levothyroxine.",
  4: "Ramesh Kumar is a 67-year-old male with cardiac disease, at moderate risk with 42% weekly adherence. He reported mild breathlessness during his last check-in yesterday and has had inconsistent medication intake. Heart rate and blood pressure are trending slightly upward. A medication compliance discussion and breathlessness follow-up is recommended at the next contact.",
  5: "Sunita Patel is a 38-year-old female with well-controlled hypothyroidism and exemplary medication adherence at 95% this week. Her TSH readings are stable (1.8–2.2 mIU/L) and all recent check-ins report no symptoms. She is performing very well — no immediate clinical action required.",
  6: "Priya Sharma is a 44-year-old female managing Type 2 Diabetes with good control. Her adherence is 88% this week with one missed dose. Fasting glucose readings are within acceptable range (96–108 mg/dL), and recent check-ins show no symptoms. Her management plan appears to be working well — continue current regimen.",
}

// Keyword-matched chat responses
function getMockChatResponse(patientId: number, message: string): string {
  const patient = getPatientById(patientId)
  if (!patient) return "I'm sorry, I couldn't find the patient data to answer your question."

  const msg = message.toLowerCase()

  if (msg.includes("medication") || msg.includes("med") || msg.includes("dose") || msg.includes("drug")) {
    const medList = patient.medications
      .map((m) => `${m.name} ${m.dose} (${m.frequency}) — ${m.adherenceRate}% adherence`)
      .join("; ")
    return `${patient.name} is currently prescribed: ${medList}. Overall weekly adherence is ${patient.adherence}%. ${
      patient.adherence < 60
        ? "The low adherence rate is concerning and warrants a follow-up call to understand barriers to medication intake."
        : patient.adherence < 80
        ? "Adherence is moderate — consider a brief check-in to reinforce the medication schedule."
        : "Adherence is excellent — no immediate action needed."
    }`
  }

  if (msg.includes("symptom") || msg.includes("complaint") || msg.includes("feeling") || msg.includes("reported")) {
    const latest = patient.recentCheckIns[0]
    if (!latest) return `No recent check-in data is available for ${patient.name}.`
    const symptoms = latest.symptoms.length > 0 ? latest.symptoms.join(", ") : "no symptoms"
    return `In their most recent check-in on ${latest.date}, ${patient.name} reported ${symptoms}. Their mood score was ${latest.moodScore}/5. Note: "${latest.note}"`
  }

  if (msg.includes("vital") || msg.includes("blood pressure") || msg.includes("glucose") || msg.includes("heart rate") || msg.includes("tsh")) {
    const latest = patient.vitalsHistory[patient.vitalsHistory.length - 1]
    const parts: string[] = []
    if (latest.systolic) parts.push(`BP: ${latest.systolic}/${latest.diastolic} mmHg`)
    if (latest.glucose) parts.push(`Glucose: ${latest.glucose} mg/dL`)
    if (latest.heartRate) parts.push(`Heart Rate: ${latest.heartRate} bpm`)
    if (latest.tsh) parts.push(`TSH: ${latest.tsh} mIU/L`)
    if (latest.weight) parts.push(`Weight: ${latest.weight} kg`)
    return `Latest vitals for ${patient.name} (${latest.date}): ${parts.join(", ")}. The 5-day trend should be reviewed for any escalating patterns.`
  }

  if (msg.includes("adherence") || msg.includes("compliance") || msg.includes("missed") || msg.includes("skip")) {
    return `${patient.name}'s 7-day adherence is ${patient.adherence}%. ${
      patient.adherence < 50
        ? "This is critically low. More than half of prescribed doses have been missed this week. Urgent intervention is advised — consider scheduling a visit or calling to identify barriers."
        : patient.adherence < 75
        ? "This is below the target threshold of 75%. Consider a motivational check-in call and reviewing whether any side effects are causing avoidance."
        : "This is within an acceptable range. Keep monitoring and reinforce positive adherence habits."
    }`
  }

  if (msg.includes("risk") || msg.includes("concern") || msg.includes("priority") || msg.includes("urgent")) {
    return `${patient.name} is currently classified as ${patient.risk} risk. ${
      patient.risk === "High"
        ? "Immediate attention is warranted. Review their recent vitals, symptoms, and medication status carefully and consider proactive outreach today."
        : patient.risk === "Moderate"
        ? "Monitor closely. Schedule a routine check-in and review adherence trends over the next 48 hours."
        : "The patient is stable. Continue current care plan and routine monitoring."
    }`
  }

  if (msg.includes("follow") || msg.includes("next step") || msg.includes("recommend") || msg.includes("action") || msg.includes("what should")) {
    const latestSymptoms = patient.recentCheckIns[0]?.symptoms ?? []
    const actions: string[] = []
    if (patient.adherence < 60) actions.push("call the patient to address medication barriers")
    if (latestSymptoms.length > 0) actions.push(`follow up on reported symptoms: ${latestSymptoms.join(", ")}`)
    if (patient.risk === "High") actions.push("escalate review priority")
    if (actions.length === 0) actions.push("continue current monitoring plan")
    return `Recommended next steps for ${patient.name}: ${actions.join("; ")}. All clinical decisions should be validated against the full patient history.`
  }

  if (msg.includes("week") || msg.includes("summarize") || msg.includes("summary") || msg.includes("overview") || msg.includes("past")) {
    return MOCK_SUMMARIES[patientId] ?? `${patient.name} has ${patient.conditions.join(" and ")} with ${patient.adherence}% adherence this week.`
  }

  // Fallback
  return `Based on available data, ${patient.name} (${patient.age}${patient.gender}, ${patient.conditions.join("/")} — ${patient.risk} risk) has ${patient.adherence}% medication adherence this week. Their last check-in was ${patient.lastCheckin}. Is there a specific aspect of their care you'd like to explore — medications, symptoms, vitals, or next steps?`
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
      const summary = MOCK_SUMMARIES[patientId] ?? `${patient.name} has ${patient.conditions.join(" and ")} with ${patient.adherence}% adherence this week.`
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
