export interface Medication {
  name: string
  dose: string
  frequency: string
  adherenceRate: number
  lastTaken: string
  refillDue: string
}

export interface VitalsReading {
  date: string
  systolic?: number
  diastolic?: number
  glucose?: number
  heartRate?: number
  tsh?: number
  weight?: number
}

export interface CheckIn {
  date: string
  symptoms: string[]
  note: string
  moodScore: number
}

export interface Alert {
  patientId: number
  level: "URGENT" | "WARNING" | "WATCH"
  summary: string
  time: string
  actions: string[]
}

export interface Patient {
  id: number
  name: string
  age: number
  gender: "M" | "F"
  bloodType: string
  phone: string
  conditions: string[]
  risk: "High" | "Moderate" | "Low"
  adherence: number
  adherenceWeek: (0 | 1)[] // 7 days: 1=taken, 0=missed
  lastCheckin: string
  allergies: string[]
  medications: Medication[]
  vitalsHistory: VitalsReading[]
  recentCheckIns: CheckIn[]
}

export const patients: Patient[] = [
  {
    id: 1,
    name: "Arjun Mehta",
    age: 42,
    gender: "M",
    bloodType: "O+",
    phone: "+91 98765 43210",
    conditions: ["Diabetes", "Hypertension"],
    risk: "High",
    adherence: 57,
    adherenceWeek: [1, 1, 0, 1, 0, 1, 0],
    lastCheckin: "2 days ago",
    allergies: ["Sulfonamides"],
    medications: [
      { name: "Metformin", dose: "500mg", frequency: "Twice daily", adherenceRate: 60, lastTaken: "Yesterday, 8:00 AM", refillDue: "In 8 days" },
      { name: "Amlodipine", dose: "5mg", frequency: "Once daily (morning)", adherenceRate: 55, lastTaken: "Yesterday, 8:00 AM", refillDue: "In 15 days" },
      { name: "Losartan", dose: "50mg", frequency: "Once daily (evening)", adherenceRate: 52, lastTaken: "2 days ago", refillDue: "In 10 days" },
    ],
    vitalsHistory: [
      { date: "Mar 19", glucose: 148, systolic: 152, diastolic: 94 },
      { date: "Mar 20", glucose: 155, systolic: 155, diastolic: 96 },
      { date: "Mar 21", glucose: 162, systolic: 158, diastolic: 98 },
      { date: "Mar 22", glucose: 144, systolic: 150, diastolic: 92 },
      { date: "Mar 23", glucose: 170, systolic: 162, diastolic: 100 },
    ],
    recentCheckIns: [
      { date: "Mar 23, 9:00 AM", symptoms: ["Fatigue", "Blurred vision"], note: "Feeling tired all day. Vision was blurry after lunch.", moodScore: 2 },
      { date: "Mar 21, 10:00 AM", symptoms: ["Fatigue"], note: "A bit tired today, skipped evening walk.", moodScore: 3 },
      { date: "Mar 19, 8:30 AM", symptoms: [], note: "Feeling okay today. Took all medications.", moodScore: 4 },
    ],
  },
  {
    id: 2,
    name: "Riya Kapoor",
    age: 55,
    gender: "F",
    bloodType: "A+",
    phone: "+91 91234 56789",
    conditions: ["Cardiac", "Hypertension"],
    risk: "High",
    adherence: 29,
    adherenceWeek: [0, 0, 0, 1, 0, 0, 0],
    lastCheckin: "3 days ago",
    allergies: ["Penicillin", "NSAIDs"],
    medications: [
      { name: "Aspirin", dose: "75mg", frequency: "Once daily", adherenceRate: 30, lastTaken: "Mar 22", refillDue: "In 20 days" },
      { name: "Atorvastatin", dose: "40mg", frequency: "Once daily (night)", adherenceRate: 28, lastTaken: "Mar 22", refillDue: "In 18 days" },
      { name: "Metoprolol", dose: "25mg", frequency: "Twice daily", adherenceRate: 25, lastTaken: "Mar 22", refillDue: "In 12 days" },
    ],
    vitalsHistory: [
      { date: "Mar 19", heartRate: 88, systolic: 148, diastolic: 92, weight: 68 },
      { date: "Mar 20", heartRate: 92, systolic: 152, diastolic: 95, weight: 68 },
      { date: "Mar 21", heartRate: 96, systolic: 158, diastolic: 98, weight: 69 },
      { date: "Mar 22", heartRate: 100, systolic: 162, diastolic: 100, weight: 69 },
      { date: "Mar 23", heartRate: 104, systolic: 168, diastolic: 104, weight: 69 },
    ],
    recentCheckIns: [
      { date: "Mar 22, 11:00 AM", symptoms: ["Chest tightness", "Shortness of breath"], note: "Chest felt tight in the morning. Hard to breathe after climbing stairs.", moodScore: 1 },
      { date: "Mar 21, 9:30 AM", symptoms: ["Chest tightness"], note: "Mild chest discomfort. Rested most of the day.", moodScore: 2 },
      { date: "Mar 19, 8:00 AM", symptoms: [], note: "Felt okay. Did light stretching.", moodScore: 3 },
    ],
  },
  {
    id: 3,
    name: "Priya Nair",
    age: 38,
    gender: "F",
    bloodType: "B+",
    phone: "+91 87654 32109",
    conditions: ["Thyroid"],
    risk: "Moderate",
    adherence: 71,
    adherenceWeek: [1, 1, 0, 1, 1, 0, 1],
    lastCheckin: "Today",
    allergies: [],
    medications: [
      { name: "Levothyroxine", dose: "50mcg", frequency: "Once daily (fasting)", adherenceRate: 71, lastTaken: "Today, 7:00 AM", refillDue: "In 22 days" },
    ],
    vitalsHistory: [
      { date: "Mar 19", tsh: 2.8, weight: 62 },
      { date: "Mar 20", tsh: 2.6, weight: 62 },
      { date: "Mar 21", tsh: 3.1, weight: 62 },
      { date: "Mar 22", tsh: 2.9, weight: 63 },
      { date: "Mar 23", tsh: 2.7, weight: 63 },
    ],
    recentCheckIns: [
      { date: "Mar 25, 8:00 AM", symptoms: [], note: "Feeling good today. Took medication before breakfast.", moodScore: 4 },
      { date: "Mar 23, 9:00 AM", symptoms: ["Mild fatigue"], note: "A little tired but okay.", moodScore: 3 },
      { date: "Mar 21, 8:30 AM", symptoms: [], note: "Normal day. Missed evening walk.", moodScore: 4 },
    ],
  },
  {
    id: 4,
    name: "Ramesh Kumar",
    age: 67,
    gender: "M",
    bloodType: "B-",
    phone: "+91 76543 21098",
    conditions: ["Cardiac"],
    risk: "Moderate",
    adherence: 42,
    adherenceWeek: [0, 1, 0, 0, 1, 0, 1],
    lastCheckin: "Yesterday",
    allergies: ["Codeine"],
    medications: [
      { name: "Aspirin", dose: "75mg", frequency: "Once daily", adherenceRate: 45, lastTaken: "Yesterday", refillDue: "In 14 days" },
      { name: "Carvedilol", dose: "6.25mg", frequency: "Twice daily", adherenceRate: 38, lastTaken: "Yesterday, morning", refillDue: "In 9 days" },
    ],
    vitalsHistory: [
      { date: "Mar 19", heartRate: 72, systolic: 138, diastolic: 86, weight: 74 },
      { date: "Mar 20", heartRate: 76, systolic: 142, diastolic: 88, weight: 74 },
      { date: "Mar 21", heartRate: 74, systolic: 140, diastolic: 87, weight: 75 },
      { date: "Mar 22", heartRate: 78, systolic: 145, diastolic: 90, weight: 75 },
      { date: "Mar 23", heartRate: 80, systolic: 148, diastolic: 92, weight: 75 },
    ],
    recentCheckIns: [
      { date: "Mar 24, 9:00 AM", symptoms: ["Mild breathlessness"], note: "Felt slightly breathless climbing to the second floor.", moodScore: 3 },
      { date: "Mar 22, 10:00 AM", symptoms: [], note: "Fine today. Took a short walk.", moodScore: 4 },
      { date: "Mar 20, 8:30 AM", symptoms: [], note: "Good day overall.", moodScore: 4 },
    ],
  },
  {
    id: 5,
    name: "Sunita Patel",
    age: 38,
    gender: "F",
    bloodType: "AB+",
    phone: "+91 65432 10987",
    conditions: ["Thyroid"],
    risk: "Low",
    adherence: 95,
    adherenceWeek: [1, 1, 1, 1, 1, 1, 1],
    lastCheckin: "Today",
    allergies: [],
    medications: [
      { name: "Levothyroxine", dose: "75mcg", frequency: "Once daily (fasting)", adherenceRate: 95, lastTaken: "Today, 6:45 AM", refillDue: "In 28 days" },
    ],
    vitalsHistory: [
      { date: "Mar 19", tsh: 1.9, weight: 58 },
      { date: "Mar 20", tsh: 2.0, weight: 58 },
      { date: "Mar 21", tsh: 2.1, weight: 58 },
      { date: "Mar 22", tsh: 1.8, weight: 58 },
      { date: "Mar 23", tsh: 2.2, weight: 58 },
    ],
    recentCheckIns: [
      { date: "Mar 25, 7:30 AM", symptoms: [], note: "Feeling great today!", moodScore: 5 },
      { date: "Mar 23, 7:30 AM", symptoms: [], note: "All good. Exercised this morning.", moodScore: 5 },
      { date: "Mar 21, 8:00 AM", symptoms: [], note: "Normal day.", moodScore: 4 },
    ],
  },
  {
    id: 6,
    name: "Priya Sharma",
    age: 44,
    gender: "F",
    bloodType: "O-",
    phone: "+91 54321 09876",
    conditions: ["Type 2 Diabetes"],
    risk: "Low",
    adherence: 88,
    adherenceWeek: [1, 1, 1, 0, 1, 1, 1],
    lastCheckin: "Yesterday",
    allergies: [],
    medications: [
      { name: "Metformin", dose: "500mg", frequency: "Twice daily", adherenceRate: 90, lastTaken: "Yesterday, 8:00 PM", refillDue: "In 18 days" },
      { name: "Glipizide", dose: "5mg", frequency: "Once daily (before breakfast)", adherenceRate: 85, lastTaken: "Yesterday, 7:30 AM", refillDue: "In 21 days" },
    ],
    vitalsHistory: [
      { date: "Mar 19", glucose: 98, weight: 65 },
      { date: "Mar 20", glucose: 104, weight: 65 },
      { date: "Mar 21", glucose: 96, weight: 65 },
      { date: "Mar 22", glucose: 108, weight: 65 },
      { date: "Mar 23", glucose: 102, weight: 65 },
    ],
    recentCheckIns: [
      { date: "Mar 24, 8:00 AM", symptoms: [], note: "Feeling fine. Blood sugar seems stable.", moodScore: 5 },
      { date: "Mar 22, 9:00 AM", symptoms: [], note: "Good day. Ate healthy meals.", moodScore: 4 },
      { date: "Mar 20, 7:30 AM", symptoms: [], note: "Missed lunch medication — ate late.", moodScore: 3 },
    ],
  },
]

export const alerts: Alert[] = [
  {
    patientId: 2,
    level: "URGENT",
    summary: "Missed medications 3 consecutive days. Today's check-in reported chest tightness and shortness of breath.",
    time: "2 hours ago",
    actions: ["Call Now", "Schedule Visit"],
  },
  {
    patientId: 1,
    level: "WARNING",
    summary: "HbA1c trend worsening over 3 months. Missed 2 check-ins this week. Last reported fatigue and blurred vision.",
    time: "4 hours ago",
    actions: ["Call", "Adjust Meds"],
  },
  {
    patientId: 3,
    level: "WATCH",
    summary: "Missed evening medication yesterday. Next check-in due today. Monitor for symptom changes.",
    time: "6 hours ago",
    actions: ["View"],
  },
]

export function getPatientById(id: number): Patient | undefined {
  return patients.find((p) => p.id === id)
}

export function getAlertForPatient(patientId: number): Alert | undefined {
  return alerts.find((a) => a.patientId === patientId)
}
