"use server"

import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"

export async function signIn(prevState: any, formData: FormData, permalink: string) {
  const email = String(formData.get("email"))
  const password = String(formData.get("password"))

  if (!email) return { message: "Please enter email", status: "missingEmail" }
  if (!password) return { message: "Please enter password", status: "missingPassword" }

  const supabase = createRouteHandlerClient({ cookies })

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: "Could not authenticate user", status: "error" }
  }

  return { status: "success"}
}
