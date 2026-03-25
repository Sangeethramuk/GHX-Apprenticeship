import { notFound } from "next/navigation"
import { getPatientById } from "@/lib/patient-data"
import { PatientDetailClient } from "./PatientDetailClient"

interface Props {
  params: Promise<{ id: string }>
}

export default async function PatientPage({ params }: Props) {
  const { id } = await params
  const patient = getPatientById(Number(id))

  if (!patient) notFound()

  return <PatientDetailClient patient={patient} />
}
