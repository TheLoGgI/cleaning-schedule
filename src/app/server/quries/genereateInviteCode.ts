"use server"

import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

export const generateInviteCode = async (scheduleId: string) => {
  const generatedCode = Math.random().toString(36).substring(2, 15)

  const supabase = createServerComponentClient(
    { cookies },
    {
      // supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      options: {
        global: {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json, */*; ",
          },
        },
      },
    }
  )

  const inviteKey = await supabase
    .from("InviteKey")
    .upsert(
      { scheduleId, key: generatedCode }
      // {
      //   onConflict: "scheduleId",
      // }
    )
    .explain()

  if (inviteKey.error) {
    const existingInviteKey = await supabase
      .from("InviteKey")
      .select("key")
      .eq("scheduleId", scheduleId)
      .single()
    console.info("used existing key: ", existingInviteKey)

    if (existingInviteKey.error) return null

    return existingInviteKey.data?.key
  }

  return generatedCode
}
