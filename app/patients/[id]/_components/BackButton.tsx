"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

export function BackButton() {
  return (
    <Link
      href="/"
      className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
      title="Back to Dashboard"
    >
      <ArrowLeft className="h-4 w-4" />
    </Link>
  )
}
