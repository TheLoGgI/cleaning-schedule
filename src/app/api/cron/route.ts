"use server"

import { NextResponse } from "next/server"
import { NotifyUsersOfSchedule } from "@/app/components/emails/notifyUserOfSchedule"
import { Resend } from "resend"
import { db } from "@/lib/db"
import { scheduleRow, room as roomTable, user as userTable } from "@/lib/schema"
import { eq } from "drizzle-orm"
import { getWeekNumber } from "@/app/helpers/getWeekNumber"
import { rollSchedules } from "@/app/server/actions/rollSchedulesJob"

const resend = new Resend(process.env.RESEND_API_KEY ?? undefined)

export async function GET(request: Request) {
  const url = new URL(request.url)
  const secret = url.searchParams.get("cron_api_secret")
  const debugMode = url.searchParams.get("debug")

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ status: 401, body: "Unauthorized" })
  }

  const today = new Date()
  const currentWeekNumber = getWeekNumber(today)

  // Fetch next week's schedule rows with room + user info
  const nextWeekRows = await db
    .select({
      scheduleId: scheduleRow.scheduleId,
      firstName: userTable.firstName,
      lastName: userTable.lastName,
      email: userTable.email,
    })
    .from(scheduleRow)
    .innerJoin(roomTable, eq(scheduleRow.room, roomTable.id))
    .innerJoin(userTable, eq(roomTable.userId, userTable.id))
    .where(eq(scheduleRow.weekNr, currentWeekNumber + 1))

  const emailRecipients = nextWeekRows.filter((r) => r.email)

  if (debugMode === "true") {
    const names = emailRecipients.map((r) => r.firstName)
    await resend.emails.send({
      from: "ME <business@lasseaakjaer.com>",
      to: "lasse_aakjaer@hotmail.com",
      subject: `Do your duty!, Cleaning week ${currentWeekNumber + 1}`,
      text: JSON.stringify(names) + " was sent email of schedule week",
    })

    await rollSchedules()
    return NextResponse.json({ query: emailRecipients }, { status: 200 })
  }

  for (const recipient of emailRecipients) {
    await resend.emails.send({
      from: "ME <business@lasseaakjaer.com>",
      to: [recipient.email!],
      subject: `Do your duty!, Cleaning week ${currentWeekNumber + 1}`,
      react: NotifyUsersOfSchedule({
        username: `${recipient.firstName} ${recipient.lastName}`,
        scheduleId: recipient.scheduleId,
      }),
    })
  }

  await rollSchedules()

  return NextResponse.json({ query: emailRecipients }, { status: 200 })
}
