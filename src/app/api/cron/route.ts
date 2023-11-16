"use server"

import { NextResponse } from "next/server"
import { NotifyUsersOfSchedule } from "@/app/components/emails/notifyUserOfSchedule"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(request: Request) {
  const url = new URL(request.url)
  const secret = url.searchParams.get("cron_api_secret")

  if (
    secret !== process.env.CRON_SECRET
    // || request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({
      status: 401,
      body: "Unauthorized",
    })
  }

  // try {
  const responseResend = await resend.emails.send({
    from: "ME <business@lasseaakjaer.com>",
    to: ["lasse_aakjaer@hotmail.com"],
    subject: `Test from cron job`,
    react: NotifyUsersOfSchedule({ username: "Lasse", scheduleId: "123" }),
  })

  console.log("responseResend: ", responseResend)

  //   return NextResponse.json(null, { status: 200 })
  // } catch (error) {
  //   console.error("error: ", error)
  return NextResponse.json({ responseResend })
  // }
}
