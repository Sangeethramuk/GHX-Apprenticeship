import { notFound } from "next/navigation"
import { getPatientById } from "@/lib/patient-data"
import { ConsultationClient } from "./ConsultationClient"

interface Props {
  params: Promise<{ id: string }>
}

export default async function ConsultationPage({ params }: Props) {
  const { id } = await params
  const patient = getPatientById(Number(id))

  if (!patient) notFound()

  return <ConsultationClient patient={patient} />
}
