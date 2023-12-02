"use server"

import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

export const generateInviteCode = async (scheduleId: string) => {
  const generatedCode = Math.random().toString(36).substring(2, 15)

  const supabase = createServerComponentClient({ cookies })

  try {
    await supabase
      .from("InviteKey")
      .insert([{ scheduleId, key: generatedCode }])
    return generatedCode
  } catch (error) {
    console.warn("error: ", error)
  }

  return null
}
