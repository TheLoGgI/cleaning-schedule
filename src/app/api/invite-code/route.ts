import { NextResponse } from "next/server"
import { generateInviteCode } from "@/app/server/quries/generateInviteCode"

export async function GET(request: Request) {
  const url = new URL(request.url)
  const scheduleId = url.searchParams.get("scheduleId")

  if (!scheduleId) {
    return NextResponse.json({ error: "scheduleId required" }, { status: 400 })
  }

  const code = await generateInviteCode(scheduleId)

  if (!code) {
    return NextResponse.json({ error: "Could not generate code" }, { status: 500 })
  }

  return NextResponse.json({ code })
}
