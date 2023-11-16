"use client"

import { NotifyUsersOfSchedule } from "@/app/components/emails/notifyUserOfSchedule"

export default function EmailTemplate() {
  return (
    <NotifyUsersOfSchedule
      scheduleId="e97c09b1-2cd7-4a8a-9e88-097c2a543207"
      username="Lasse"
    />
  )
}
