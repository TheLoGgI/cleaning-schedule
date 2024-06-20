"use server"

import { NextResponse } from "next/server"
import { NotifyUsersOfSchedule } from "@/app/components/emails/notifyUserOfSchedule"
import { Resend } from "resend"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { getWeekNumber } from "@/app/helpers/getWeekNumber"
import { rollSchedules } from "@/app/server/actions/rollSchedulesJob"

const resend = new Resend(process.env.RESEND_API_KEY ?? undefined)

export async function GET(request: Request) {
  const url = new URL(request.url)
  const secret = url.searchParams.get("cron_api_secret")
  const debugMode = url.searchParams.get("debug")

  // TODO: Add Authorization header check
  if (
    secret !== process.env.CRON_SECRET
    // || request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({
      status: 401,
      body: "Unauthorized",
    })
  }

  // Get current week number
  const today = new Date()
  const currentWeekNumber = getWeekNumber(today)

  const supabase = createServerComponentClient({ cookies })
  const nextWeekScheduleRows = await supabase
    .from("ScheduleRow")
    .select(
      `
    scheduleId,
    room: Room(id, activeInSchedule, roomNr, User(id, firstName, lastName, email, notification))
    `
    )
    .eq("weekNr", currentWeekNumber + 1)

  const emailRecipients = []
  for (const scheduleRow of nextWeekScheduleRows.data ?? []) {
    const scheduleId = scheduleRow.scheduleId
    delete scheduleRow.scheduleId // Remove scheduleId from object, destructing behavior
    const usersOfScheduleRow = Object.values(scheduleRow).filter(
      (user) => user.User.email && user.User.notification
    )

    emailRecipients.push(
      ...usersOfScheduleRow.map((user) => ({ scheduleId, ...user }))
    )
  }

  
if (debugMode == "true") {
  const names = emailRecipients.map((recipient) => recipient.User.firstName)
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
    const responseResend = await resend.emails.send({
      from: "ME <business@lasseaakjaer.com>",
      to: [recipient.User.email],
      subject: `Do your duty!, Cleaning week ${currentWeekNumber + 1}`,
      react: NotifyUsersOfSchedule({
        username: `${recipient.User.firstName} ${recipient.User.lastName}`,
        scheduleId: recipient.scheduleId,
      }),
    })

    console.info(
      "Email sent to ",
      recipient.User.email,
      " for roomId: ",
      responseResend.data?.id
    )
  }
  
  await resend.emails.send({
    from: "ME <business@lasseaakjaer.com>",
    to: "lasse_aakjaer@hotmail.com",
    subject: `Do your duty!, Cleaning week ${currentWeekNumber + 1}`,
    text: JSON.stringify(emailRecipients) + " was sent email of schedule week",
  })
  


  
  return NextResponse.json({ query: emailRecipients }, { status: 200 })
}
