export type VitalReading = { date: string; value: number }

export type PatientDetail = {
  id: number
  name: string
  condition: string
  adherence: number
  latestSymptom: string
  risk: "Low" | "Medium" | "Critical"
  lastCheckin: string
  age: number
  gender: string
  bloodType: string
  allergies: string[]
  diagnosedDate: string
  attendingDoctor: string
  phone: string
  email: string
  vitals: {
    bloodPressureSystolic: VitalReading[]
    bloodPressureDiastolic: VitalReading[]
    heartRate: VitalReading[]
    spo2: VitalReading[]
    temperature: VitalReading[]
    glucose: VitalReading[]
    weight: VitalReading[]
  }
  admissions: {
    id: string
    admittedDate: string
    dischargedDate: string | null
    reason: string
    ward: string
    attendingDoctor: string
    dischargeNotes: string
    medicationsAtAdmission: { name: string; dose: string; action: "Started" | "Stopped" | "Changed" | "Continued" }[]
  }[]
  dailyProgress: {
    date: string
    mood: "Good" | "Fair" | "Poor"
    adherence: number
    vitalsLogged: boolean
    notes: string
    flagged: boolean
  }[]
  alerts: {
    id: string
    date: string
    type: "Missed Medication" | "Abnormal Vital" | "Symptom Spike" | "Missed Check-in" | "Emergency"
    description: string
    severity: "Low" | "Medium" | "Critical"
    resolved: boolean
    resolvedDate: string | null
    resolvedBy: string | null
  }[]
  medications: { id: string; name: string; dose: string; frequency: string; prescribedDate: string; status: "Active" | "Discontinued" | "On Hold"; adherencePercent: number }[]
  visits: { id: string; date: string; type: "In-Person" | "Teleconsult" | "Emergency"; doctor: string; notes: string; outcome: string }[]
  checkIns: { id: string; date: string; mood: "Good" | "Fair" | "Poor"; reportedSymptoms: string[]; notes: string }[]
  symptoms: { id: string; date: string; symptom: string; severity: "Mild" | "Moderate" | "Severe"; resolved: boolean }[]
}

const DATES = ["Feb 24", "Feb 27", "Mar 2", "Mar 5", "Mar 8", "Mar 11", "Mar 14", "Mar 17", "Mar 20", "Mar 25"]

const PROGRESS_DATES = [
  "Mar 11", "Mar 12", "Mar 13", "Mar 14", "Mar 15",
  "Mar 16", "Mar 17", "Mar 18", "Mar 19", "Mar 20",
  "Mar 21", "Mar 22", "Mar 23", "Mar 24", "Mar 25",
]

export const MOCK_PATIENTS: PatientDetail[] = [
  {
    id: 1,
    name: "Arjun Mehta",
    condition: "Hypertension",
    adherence: 65,
    latestSymptom: "Dizziness",
    risk: "Medium",
    lastCheckin: "2 hours ago",
    age: 54,
    gender: "Male",
    bloodType: "B+",
    allergies: ["Penicillin", "Sulfa drugs"],
    diagnosedDate: "Jan 2022",
    attendingDoctor: "Dr. Preethi Nair",
    phone: "+91 98765 43210",
    email: "arjun.mehta@email.com",
    vitals: {
      bloodPressureSystolic: DATES.map((date, i) => ({ date, value: [132, 135, 138, 140, 137, 135, 132, 130, 133, 136][i] })),
      bloodPressureDiastolic: DATES.map((date, i) => ({ date, value: [88, 90, 92, 91, 89, 88, 87, 85, 88, 90][i] })),
      heartRate: DATES.map((date, i) => ({ date, value: [78, 80, 82, 79, 77, 81, 83, 80, 78, 81][i] })),
      spo2: DATES.map((date, i) => ({ date, value: [97, 97, 96, 97, 97, 98, 97, 97, 96, 97][i] })),
      temperature: DATES.map((date, i) => ({ date, value: [36.8, 37.0, 37.1, 37.2, 36.9, 37.0, 37.1, 36.8, 37.0, 37.2][i] })),
      glucose: DATES.map((date, i) => ({ date, value: [95, 98, 100, 102, 98, 96, 99, 101, 97, 100][i] })),
      weight: DATES.map((date, i) => ({ date, value: [75.2, 75.4, 75.6, 75.3, 75.5, 75.7, 75.4, 75.2, 75.5, 75.3][i] })),
    },
    admissions: [
      {
        id: "adm-1-1",
        admittedDate: "Dec 10, 2024",
        dischargedDate: "Dec 14, 2024",
        reason: "Hypertensive crisis — BP 180/115",
        ward: "Cardiology",
        attendingDoctor: "Dr. Preethi Nair",
        dischargeNotes: "BP stabilised with IV labetalol. Switched to amlodipine 10mg. Follow-up in 2 weeks.",
        medicationsAtAdmission: [
          { name: "Amlodipine", dose: "5mg", action: "Changed" },
          { name: "Losartan", dose: "50mg", action: "Continued" },
          { name: "IV Labetalol", dose: "20mg", action: "Started" },
        ],
      },
    ],
    dailyProgress: PROGRESS_DATES.map((date, i) => ({
      date,
      mood: (["Good", "Good", "Fair", "Fair", "Poor", "Fair", "Good", "Good", "Fair", "Good", "Good", "Poor", "Fair", "Good", "Good"] as const)[i],
      adherence: [80, 75, 60, 55, 45, 65, 70, 80, 75, 85, 80, 50, 65, 75, 70][i],
      vitalsLogged: [true, true, false, true, false, true, true, true, true, true, true, false, true, true, true][i],
      notes: ["", "", "Skipped afternoon dose", "", "Reported dizziness, missed 2 doses", "", "", "", "Mild headache", "", "", "Dizziness again", "", "", ""][i],
      flagged: [false, false, false, false, true, false, false, false, false, false, false, true, false, false, false][i],
    })),
    alerts: [
      { id: "alt-1-1", date: "Mar 25, 2026", type: "Symptom Spike", description: "Patient reported severe dizziness and blurred vision", severity: "Medium", resolved: false, resolvedDate: null, resolvedBy: null },
      { id: "alt-1-2", date: "Mar 15, 2026", type: "Missed Medication", description: "Missed 2 consecutive doses of Amlodipine", severity: "Medium", resolved: false, resolvedDate: null, resolvedBy: null },
      { id: "alt-1-3", date: "Feb 28, 2026", type: "Abnormal Vital", description: "BP reading 148/96 — above threshold", severity: "Low", resolved: true, resolvedDate: "Mar 1, 2026", resolvedBy: "Dr. Preethi Nair" },
    ],
    medications: [
      { id: "med-1-1", name: "Amlodipine", dose: "10mg", frequency: "Once daily (morning)", prescribedDate: "Dec 2024", status: "Active", adherencePercent: 65 },
      { id: "med-1-2", name: "Losartan", dose: "50mg", frequency: "Once daily (evening)", prescribedDate: "Jan 2022", status: "Active", adherencePercent: 70 },
      { id: "med-1-3", name: "Aspirin", dose: "75mg", frequency: "Once daily", prescribedDate: "Jan 2022", status: "Active", adherencePercent: 80 },
      { id: "med-1-4", name: "Atenolol", dose: "25mg", frequency: "Twice daily", prescribedDate: "Mar 2023", status: "Discontinued", adherencePercent: 55 },
    ],
    visits: [
      { id: "vis-1-1", date: "Mar 20, 2026", type: "Teleconsult", doctor: "Dr. Preethi Nair", notes: "BP still elevated at 136/90. Discussed adherence issues. Increased Amlodipine awareness.", outcome: "Medication review, follow-up in 2 weeks" },
      { id: "vis-1-2", date: "Feb 15, 2026", type: "In-Person", doctor: "Dr. Preethi Nair", notes: "Routine quarterly review. BP trending down. Ordered renal panel.", outcome: "Stable, continue current regimen" },
      { id: "vis-1-3", date: "Dec 14, 2024", type: "Emergency", doctor: "Dr. Ramanan", notes: "Admitted for hypertensive crisis. IV treatment given.", outcome: "Discharged with medication change" },
    ],
    checkIns: [
      { id: "ci-1-1", date: "Mar 25, 2026", mood: "Poor", reportedSymptoms: ["Dizziness", "Blurred vision"], notes: "Felt unwell since morning" },
      { id: "ci-1-2", date: "Mar 24, 2026", mood: "Fair", reportedSymptoms: [], notes: "" },
      { id: "ci-1-3", date: "Mar 23, 2026", mood: "Good", reportedSymptoms: [], notes: "Feeling better today" },
      { id: "ci-1-4", date: "Mar 22, 2026", mood: "Poor", reportedSymptoms: ["Dizziness", "Headache"], notes: "Forgot to take evening medication" },
      { id: "ci-1-5", date: "Mar 20, 2026", mood: "Good", reportedSymptoms: [], notes: "" },
    ],
    symptoms: [
      { id: "sym-1-1", date: "Mar 25, 2026", symptom: "Dizziness", severity: "Moderate", resolved: false },
      { id: "sym-1-2", date: "Mar 22, 2026", symptom: "Headache", severity: "Mild", resolved: true },
      { id: "sym-1-3", date: "Mar 15, 2026", symptom: "Dizziness", severity: "Moderate", resolved: true },
      { id: "sym-1-4", date: "Feb 28, 2026", symptom: "Blurred vision", severity: "Mild", resolved: true },
    ],
  },

  {
    id: 2,
    name: "Priya Sharma",
    condition: "Type 2 Diabetes",
    adherence: 88,
    latestSymptom: "None",
    risk: "Low",
    lastCheckin: "Yesterday",
    age: 45,
    gender: "Female",
    bloodType: "O+",
    allergies: ["None known"],
    diagnosedDate: "Jun 2020",
    attendingDoctor: "Dr. Vikram Iyer",
    phone: "+91 87654 32109",
    email: "priya.sharma@email.com",
    vitals: {
      bloodPressureSystolic: DATES.map((date, i) => ({ date, value: [122, 120, 124, 122, 121, 123, 120, 122, 121, 123][i] })),
      bloodPressureDiastolic: DATES.map((date, i) => ({ date, value: [80, 78, 82, 80, 79, 81, 78, 80, 79, 81][i] })),
      heartRate: DATES.map((date, i) => ({ date, value: [68, 70, 67, 69, 71, 68, 70, 67, 69, 68][i] })),
      spo2: DATES.map((date, i) => ({ date, value: [98, 99, 98, 99, 98, 99, 98, 98, 99, 98][i] })),
      temperature: DATES.map((date, i) => ({ date, value: [36.6, 36.7, 36.8, 36.7, 36.6, 36.8, 36.7, 36.6, 36.7, 36.8][i] })),
      glucose: DATES.map((date, i) => ({ date, value: [145, 138, 152, 160, 148, 142, 138, 150, 145, 140][i] })),
      weight: DATES.map((date, i) => ({ date, value: [69.2, 69.0, 68.8, 68.9, 69.1, 68.8, 68.7, 68.9, 69.0, 68.8][i] })),
    },
    admissions: [
      {
        id: "adm-2-1",
        admittedDate: "Aug 5, 2023",
        dischargedDate: "Aug 7, 2023",
        reason: "Hypoglycaemic episode — glucose 48 mg/dL",
        ward: "General Medicine",
        attendingDoctor: "Dr. Vikram Iyer",
        dischargeNotes: "Glucose stabilised. Metformin dose adjusted. Patient counselled on diet management.",
        medicationsAtAdmission: [
          { name: "Metformin", dose: "500mg", action: "Changed" },
          { name: "IV Dextrose", dose: "25g", action: "Started" },
          { name: "Glipizide", dose: "5mg", action: "Stopped" },
        ],
      },
    ],
    dailyProgress: PROGRESS_DATES.map((date, i) => ({
      date,
      mood: (["Good", "Good", "Good", "Fair", "Good", "Good", "Good", "Good", "Good", "Fair", "Good", "Good", "Good", "Good", "Good"] as const)[i],
      adherence: [90, 95, 88, 80, 92, 90, 88, 95, 90, 75, 92, 88, 90, 95, 88][i],
      vitalsLogged: [true, true, true, true, true, true, true, true, true, false, true, true, true, true, true][i],
      notes: ["", "", "", "Skipped lunch dose — busy at work", "", "", "", "", "", "", "", "", "", "", ""][i],
      flagged: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false][i],
    })),
    alerts: [
      { id: "alt-2-1", date: "Mar 5, 2026", type: "Abnormal Vital", description: "Glucose 160 mg/dL post-meal — above normal threshold", severity: "Low", resolved: true, resolvedDate: "Mar 6, 2026", resolvedBy: "Dr. Vikram Iyer" },
    ],
    medications: [
      { id: "med-2-1", name: "Metformin", dose: "1000mg", frequency: "Twice daily (with meals)", prescribedDate: "Jun 2020", status: "Active", adherencePercent: 92 },
      { id: "med-2-2", name: "Sitagliptin", dose: "100mg", frequency: "Once daily", prescribedDate: "Jan 2023", status: "Active", adherencePercent: 88 },
      { id: "med-2-3", name: "Atorvastatin", dose: "20mg", frequency: "Once daily (night)", prescribedDate: "Jun 2020", status: "Active", adherencePercent: 90 },
      { id: "med-2-4", name: "Glipizide", dose: "5mg", frequency: "Once daily", prescribedDate: "Aug 2021", status: "Discontinued", adherencePercent: 78 },
    ],
    visits: [
      { id: "vis-2-1", date: "Mar 24, 2026", type: "Teleconsult", doctor: "Dr. Vikram Iyer", notes: "Quarterly review. Glucose trending down. HbA1c at 7.2%. Good progress.", outcome: "Continue current regimen, repeat HbA1c in 3 months" },
      { id: "vis-2-2", date: "Dec 10, 2025", type: "In-Person", doctor: "Dr. Vikram Iyer", notes: "Annual review. Added Sitagliptin to improve glycaemic control.", outcome: "Medication added, follow-up in 3 months" },
    ],
    checkIns: [
      { id: "ci-2-1", date: "Mar 24, 2026", mood: "Good", reportedSymptoms: [], notes: "Feeling great, glucose normal after breakfast" },
      { id: "ci-2-2", date: "Mar 23, 2026", mood: "Good", reportedSymptoms: [], notes: "" },
      { id: "ci-2-3", date: "Mar 22, 2026", mood: "Fair", reportedSymptoms: ["Fatigue"], notes: "Tired after long day" },
      { id: "ci-2-4", date: "Mar 21, 2026", mood: "Good", reportedSymptoms: [], notes: "" },
    ],
    symptoms: [
      { id: "sym-2-1", date: "Mar 22, 2026", symptom: "Fatigue", severity: "Mild", resolved: true },
      { id: "sym-2-2", date: "Mar 5, 2026", symptom: "Excessive thirst", severity: "Mild", resolved: true },
    ],
  },

  {
    id: 3,
    name: "Ramesh Kumar",
    condition: "Cardiac",
    adherence: 42,
    latestSymptom: "Chest tightness",
    risk: "Critical",
    lastCheckin: "10 mins ago",
    age: 62,
    gender: "Male",
    bloodType: "A-",
    allergies: ["Aspirin", "NSAIDs"],
    diagnosedDate: "Mar 2019",
    attendingDoctor: "Dr. Suresh Reddy",
    phone: "+91 76543 21098",
    email: "ramesh.kumar@email.com",
    vitals: {
      bloodPressureSystolic: DATES.map((date, i) => ({ date, value: [148, 152, 158, 162, 155, 158, 150, 154, 160, 156][i] })),
      bloodPressureDiastolic: DATES.map((date, i) => ({ date, value: [95, 98, 100, 102, 98, 100, 96, 98, 102, 99][i] })),
      heartRate: DATES.map((date, i) => ({ date, value: [88, 92, 105, 98, 102, 95, 88, 92, 108, 98][i] })),
      spo2: DATES.map((date, i) => ({ date, value: [93, 92, 91, 92, 93, 92, 91, 93, 90, 92][i] })),
      temperature: DATES.map((date, i) => ({ date, value: [37.1, 37.2, 37.5, 37.3, 37.2, 37.4, 37.1, 37.3, 37.6, 37.3][i] })),
      glucose: DATES.map((date, i) => ({ date, value: [105, 110, 118, 112, 108, 115, 110, 112, 120, 115][i] })),
      weight: DATES.map((date, i) => ({ date, value: [83.2, 83.5, 83.8, 83.6, 83.4, 83.7, 83.5, 83.8, 84.0, 83.7][i] })),
    },
    admissions: [
      {
        id: "adm-3-1",
        admittedDate: "Mar 25, 2026",
        dischargedDate: null,
        reason: "Chest tightness, elevated troponin — possible ACS",
        ward: "Cardiac ICU",
        attendingDoctor: "Dr. Suresh Reddy",
        dischargeNotes: "",
        medicationsAtAdmission: [
          { name: "Clopidogrel", dose: "75mg", action: "Started" },
          { name: "Heparin IV", dose: "5000 IU", action: "Started" },
          { name: "Metoprolol", dose: "25mg", action: "Changed" },
          { name: "Nitroglycerin", dose: "0.4mg SL", action: "Started" },
          { name: "Atorvastatin", dose: "40mg", action: "Continued" },
        ],
      },
      {
        id: "adm-3-2",
        admittedDate: "Sep 12, 2025",
        dischargedDate: "Sep 18, 2025",
        reason: "Acute decompensated heart failure",
        ward: "Cardiology",
        attendingDoctor: "Dr. Suresh Reddy",
        dischargeNotes: "Diuresis successful. EF improved to 40%. Strict fluid restriction (1.5L/day). Follow-up echo in 6 weeks.",
        medicationsAtAdmission: [
          { name: "Furosemide IV", dose: "40mg", action: "Started" },
          { name: "Carvedilol", dose: "6.25mg", action: "Changed" },
          { name: "Spironolactone", dose: "25mg", action: "Started" },
        ],
      },
    ],
    dailyProgress: PROGRESS_DATES.map((date, i) => ({
      date,
      mood: (["Poor", "Fair", "Poor", "Poor", "Fair", "Poor", "Poor", "Fair", "Poor", "Poor", "Poor", "Fair", "Poor", "Poor", "Poor"] as const)[i],
      adherence: [45, 50, 30, 35, 55, 40, 45, 50, 30, 25, 40, 50, 35, 40, 42][i],
      vitalsLogged: [true, false, false, true, true, false, true, false, true, true, false, true, false, true, true][i],
      notes: ["", "Refused morning meds", "Missed all doses", "", "", "Missed 3 of 4 doses", "", "", "Chest tightness reported", "Chest pain, missed meds", "", "", "Fatigue, partial adherence", "", "Admitted — chest tightness"][i],
      flagged: [false, false, true, true, false, true, false, false, true, true, false, false, true, false, true][i],
    })),
    alerts: [
      { id: "alt-3-1", date: "Mar 25, 2026", type: "Emergency", description: "Patient admitted — chest tightness, elevated troponin, possible ACS", severity: "Critical", resolved: false, resolvedDate: null, resolvedBy: null },
      { id: "alt-3-2", date: "Mar 23, 2026", type: "Missed Medication", description: "Missed 3 consecutive days of Metoprolol and Furosemide", severity: "Critical", resolved: false, resolvedDate: null, resolvedBy: null },
      { id: "alt-3-3", date: "Mar 19, 2026", type: "Abnormal Vital", description: "SpO2 dropped to 90%, HR 108 bpm", severity: "Critical", resolved: true, resolvedDate: "Mar 20, 2026", resolvedBy: "Dr. Suresh Reddy" },
      { id: "alt-3-4", date: "Mar 13, 2026", type: "Missed Check-in", description: "No check-in for 3 consecutive days", severity: "Medium", resolved: true, resolvedDate: "Mar 14, 2026", resolvedBy: "Care Coordinator" },
    ],
    medications: [
      { id: "med-3-1", name: "Metoprolol", dose: "25mg", frequency: "Twice daily", prescribedDate: "Mar 2019", status: "Active", adherencePercent: 42 },
      { id: "med-3-2", name: "Furosemide", dose: "40mg", frequency: "Once daily (morning)", prescribedDate: "Sep 2025", status: "Active", adherencePercent: 38 },
      { id: "med-3-3", name: "Carvedilol", dose: "6.25mg", frequency: "Twice daily", prescribedDate: "Sep 2025", status: "Active", adherencePercent: 45 },
      { id: "med-3-4", name: "Spironolactone", dose: "25mg", frequency: "Once daily", prescribedDate: "Sep 2025", status: "Active", adherencePercent: 50 },
      { id: "med-3-5", name: "Atorvastatin", dose: "40mg", frequency: "Once daily (night)", prescribedDate: "Mar 2019", status: "Active", adherencePercent: 55 },
    ],
    visits: [
      { id: "vis-3-1", date: "Mar 25, 2026", type: "Emergency", doctor: "Dr. Suresh Reddy", notes: "Emergency admission for chest tightness. Troponin elevated. ECG changes noted. Initiated ACS protocol.", outcome: "Admitted to Cardiac ICU — ongoing" },
      { id: "vis-3-2", date: "Mar 10, 2026", type: "Teleconsult", doctor: "Dr. Suresh Reddy", notes: "Concerning adherence pattern. Counselled patient on importance of medications. Family member also spoke with doctor.", outcome: "Care coordinator assigned, daily check-in initiated" },
      { id: "vis-3-3", date: "Sep 18, 2025", type: "In-Person", doctor: "Dr. Suresh Reddy", notes: "Discharge after heart failure decompensation. Echo EF 40%. Strict fluid restriction.", outcome: "Discharged with updated medication plan" },
    ],
    checkIns: [
      { id: "ci-3-1", date: "Mar 25, 2026", mood: "Poor", reportedSymptoms: ["Chest tightness", "Shortness of breath", "Fatigue"], notes: "Called emergency — going to hospital" },
      { id: "ci-3-2", date: "Mar 24, 2026", mood: "Poor", reportedSymptoms: ["Chest tightness", "Fatigue"], notes: "Still feeling tight in chest" },
      { id: "ci-3-3", date: "Mar 22, 2026", mood: "Fair", reportedSymptoms: ["Fatigue"], notes: "Missed yesterday's check-in" },
      { id: "ci-3-4", date: "Mar 20, 2026", mood: "Poor", reportedSymptoms: ["Chest tightness", "Dizziness"], notes: "Feeling very unwell" },
    ],
    symptoms: [
      { id: "sym-3-1", date: "Mar 25, 2026", symptom: "Chest tightness", severity: "Severe", resolved: false },
      { id: "sym-3-2", date: "Mar 25, 2026", symptom: "Shortness of breath", severity: "Severe", resolved: false },
      { id: "sym-3-3", date: "Mar 20, 2026", symptom: "Dizziness", severity: "Moderate", resolved: false },
      { id: "sym-3-4", date: "Mar 8, 2026", symptom: "Ankle swelling", severity: "Moderate", resolved: true },
      { id: "sym-3-5", date: "Feb 24, 2026", symptom: "Shortness of breath on exertion", severity: "Mild", resolved: true },
    ],
  },

  {
    id: 4,
    name: "Sunita Patel",
    condition: "Thyroid",
    adherence: 95,
    latestSymptom: "None",
    risk: "Low",
    lastCheckin: "Today",
    age: 38,
    gender: "Female",
    bloodType: "AB+",
    allergies: ["None known"],
    diagnosedDate: "Feb 2021",
    attendingDoctor: "Dr. Ananya Das",
    phone: "+91 65432 10987",
    email: "sunita.patel@email.com",
    vitals: {
      bloodPressureSystolic: DATES.map((date, i) => ({ date, value: [112, 110, 115, 113, 111, 114, 112, 110, 113, 112][i] })),
      bloodPressureDiastolic: DATES.map((date, i) => ({ date, value: [72, 70, 74, 72, 71, 73, 72, 70, 73, 72][i] })),
      heartRate: DATES.map((date, i) => ({ date, value: [64, 62, 66, 68, 63, 65, 62, 64, 67, 63][i] })),
      spo2: DATES.map((date, i) => ({ date, value: [98, 99, 99, 98, 99, 98, 99, 98, 99, 98][i] })),
      temperature: DATES.map((date, i) => ({ date, value: [36.5, 36.6, 36.7, 36.5, 36.6, 36.8, 36.5, 36.6, 36.7, 36.6][i] })),
      glucose: DATES.map((date, i) => ({ date, value: [88, 86, 90, 88, 87, 89, 88, 86, 89, 88][i] })),
      weight: DATES.map((date, i) => ({ date, value: [58.8, 59.0, 58.7, 58.9, 59.1, 58.8, 59.0, 58.7, 58.9, 58.8][i] })),
    },
    admissions: [],
    dailyProgress: PROGRESS_DATES.map((date, i) => ({
      date,
      mood: (["Good", "Good", "Good", "Good", "Good", "Good", "Good", "Good", "Fair", "Good", "Good", "Good", "Good", "Good", "Good"] as const)[i],
      adherence: [98, 100, 95, 100, 98, 100, 95, 98, 80, 100, 98, 100, 95, 100, 98][i],
      vitalsLogged: [true, true, true, true, true, true, true, true, true, true, true, true, true, true, true][i],
      notes: ["", "", "", "", "", "", "", "", "Feeling a little tired — possibly seasonal", "", "", "", "", "", ""][i],
      flagged: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false][i],
    })),
    alerts: [
      { id: "alt-4-1", date: "Jan 10, 2026", type: "Missed Check-in", description: "Missed scheduled check-in — on travel", severity: "Low", resolved: true, resolvedDate: "Jan 11, 2026", resolvedBy: "Sunita Patel" },
    ],
    medications: [
      { id: "med-4-1", name: "Levothyroxine", dose: "75mcg", frequency: "Once daily (fasting)", prescribedDate: "Feb 2021", status: "Active", adherencePercent: 97 },
      { id: "med-4-2", name: "Calcium + Vitamin D", dose: "500mg/400IU", frequency: "Twice daily (with meals)", prescribedDate: "Feb 2021", status: "Active", adherencePercent: 95 },
    ],
    visits: [
      { id: "vis-4-1", date: "Mar 25, 2026", type: "Teleconsult", doctor: "Dr. Ananya Das", notes: "6-monthly review. TSH 2.1 mIU/L — within range. Patient feels well. No dose change needed.", outcome: "Stable, next review in 6 months" },
      { id: "vis-4-2", date: "Sep 20, 2025", type: "In-Person", doctor: "Dr. Ananya Das", notes: "Annual review with thyroid ultrasound. Gland size normal, no nodules. TSH 2.4 mIU/L.", outcome: "Stable, continue Levothyroxine 75mcg" },
    ],
    checkIns: [
      { id: "ci-4-1", date: "Mar 25, 2026", mood: "Good", reportedSymptoms: [], notes: "Feeling great today" },
      { id: "ci-4-2", date: "Mar 24, 2026", mood: "Good", reportedSymptoms: [], notes: "" },
      { id: "ci-4-3", date: "Mar 23, 2026", mood: "Good", reportedSymptoms: [], notes: "" },
      { id: "ci-4-4", date: "Mar 19, 2026", mood: "Fair", reportedSymptoms: ["Fatigue"], notes: "Slightly tired — possibly seasonal" },
    ],
    symptoms: [
      { id: "sym-4-1", date: "Mar 19, 2026", symptom: "Fatigue", severity: "Mild", resolved: true },
    ],
  },
]
