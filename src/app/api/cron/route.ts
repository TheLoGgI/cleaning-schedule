import { NextResponse } from "next/server"

import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

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

    const supabase = createServerComponentClient({ cookies })
    const role = await supabase.from("Role").select("id").limit(1)

    return NextResponse.json({ status: "OK" }, { status: 200 })
}
