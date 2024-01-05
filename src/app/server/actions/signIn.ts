"use server"

import { cookies } from "next/headers"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { redirect } from "next/navigation"

export async function signIn(prevState: any, formData: FormData) {
  const email = String(formData.get("email"))
  const password = String(formData.get("password"))

  if (!email) return { message: "Please enter email" }
  if (!password) return { message: "Please enter password" }

  const supabase = createRouteHandlerClient({ cookies })

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: "Could not authenticate user" }
  }

  console.log("data: ", data)

  //   return { message: "Successfully authenticated" }
  redirect("/dashboard")
}