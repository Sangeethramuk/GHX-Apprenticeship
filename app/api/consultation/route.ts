import { getPatientById } from "@/lib/patient-data"

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

function buildConsultationSummary(patientId: number, transcript: string): string {
  const patient = getPatientById(patientId)
  if (!patient) return "Unable to generate summary: patient data not found."

  const t = transcript.toLowerCase()

  const symptomKeywords: Record<string, string> = {
    "fatigue": "Fatigue",
    "chest pain": "Chest pain",
    "chest tightness": "Chest tightness",
    "shortness of breath": "Shortness of breath",
    "breathlessness": "Breathlessness",
    "blurred vision": "Blurred vision",
    "dizziness": "Dizziness",
    "headache": "Headache",
    "swelling": "Peripheral oedema",
    "palpitation": "Palpitations",
    "nausea": "Nausea",
    "vomiting": "Vomiting",
    "pain": "Pain reported",
  }

  const detectedSymptoms = Object.entries(symptomKeywords)
    .filter(([kw]) => t.includes(kw))
    .map(([, label]) => label)

  const reportedSymptoms =
    detectedSymptoms.length > 0
      ? detectedSymptoms.join(", ")
      : patient.recentCheckIns[0]?.symptoms.join(", ") || "None specifically identified during consultation"

  const medNames = patient.medications.map((m) => m.name.toLowerCase())
  const detectedMeds = medNames.filter((m) => t.includes(m))
  const mentionedMeds =
    detectedMeds.length > 0
      ? detectedMeds
          .map((m) => patient.medications.find((med) => med.name.toLowerCase() === m)!)
          .map((m) => `${m.name} ${m.dose} (${m.frequency})`)
          .join(", ")
      : patient.medications.map((m) => `${m.name} ${m.dose}`).join(", ")

  const followUpActions: string[] = []
  if (patient.adherence < 60)
    followUpActions.push("Address medication adherence barriers at next patient contact")
  if (patient.risk === "High")
    followUpActions.push("Escalate care plan review within 48 hours")
  if (detectedSymptoms.length > 0)
    followUpActions.push(`Monitor and follow up on reported symptoms: ${detectedSymptoms.join(", ")}`)
  followUpActions.push("Update patient electronic record with consultation findings")
  followUpActions.push("Schedule follow-up appointment in 1–2 weeks")

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  const genderLabel = patient.gender === "M" ? "Male" : "Female"
  const riskNote =
    patient.risk === "High"
      ? "Patient remains at high clinical risk — close monitoring and prompt follow-up is essential."
      : patient.risk === "Moderate"
      ? "Patient is at moderate risk — continue current monitoring frequency and review at next contact."
      : "Patient is clinically stable with a low risk profile — continue routine monitoring."

  const adherenceNote =
    patient.adherence < 75
      ? `Adherence is below the 75% threshold — patient counselling on medication importance is strongly advised.`
      : "Adherence is satisfactory — reinforce and continue current regimen."

  return `CONSULTATION SUMMARY — ${patient.name}
Date: ${today}
Conditions: ${patient.conditions.join(", ")} | Risk Level: ${patient.risk} | Age: ${patient.age} ${genderLabel}

CHIEF COMPLAINTS / SYMPTOMS DISCUSSED
${reportedSymptoms}. Patient adherence this week stands at ${patient.adherence}%. Last check-in was recorded on ${patient.lastCheckin}.

CLINICAL OBSERVATIONS
${patient.name} (${patient.age}yo, ${genderLabel}) is being managed for ${patient.conditions.join(" and ")}. ${riskNote} Allergies on record: ${patient.allergies.length > 0 ? patient.allergies.join(", ") : "None documented"}.

MEDICATIONS DISCUSSED
${mentionedMeds}. 7-day adherence rate: ${patient.adherence}%. ${adherenceNote}

RECOMMENDED FOLLOW-UP ACTIONS
${followUpActions.map((a, i) => `${i + 1}. ${a}`).join("\n")}

Note: This summary was auto-generated from live consultation transcription. Verify all clinical details against the patient's full medical record before acting on this information.`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { patientId, transcript } = body as { patientId: number; transcript: string }

    const patient = getPatientById(patientId)
    if (!patient) {
      return Response.json({ error: "Patient not found" }, { status: 404 })
    }

    if (!transcript || typeof transcript !== "string" || transcript.trim().length === 0) {
      return Response.json({ error: "Transcript is required" }, { status: 400 })
    }

    const summary = buildConsultationSummary(patientId, transcript)
    return streamText(summary)
  } catch {
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
