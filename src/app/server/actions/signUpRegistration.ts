"use server"

import { NextRequest } from "next/server"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { getDomainUrl } from "@/app/helpers/getUrl"

export async function signUpRegistration(prevState: any, formData: FormData) {
  const email = String(formData.get("email"))
  const firstName = String(formData.get("first-name"))
  const lastName = String(formData.get("last-name"))
  const password = String(formData.get("password"))
  const repeatedPassword = String(formData.get("re-password"))

  // Optional
  const scheduleId = String(formData.get("scheduleId"))
  const inviteCode = String(formData.get("inviteCode"))
  const hasInvitationCode = !(scheduleId !== null && inviteCode !== null)

  if (!email) return { error: "Please enter email" }
  if (!firstName) return { error: "First name is required" }
  if (!password) return { error: "You need a password for your account" }
  if (!repeatedPassword) return { error: "Please repeat your password" }

  if (password !== repeatedPassword) return { error: "Passwords do not match" }
  if (password.length < 8)
    return { error: "Password must be at least 8 characters" }

  const supabase = createServerComponentClient(
    { cookies },
    {
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
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

  // Check if the user as an invite code, and if it is valid
  if (hasInvitationCode) {
    const doesInviteCodeExists = await supabase
      .from("InviteKey")
      .select()
      .eq("key", inviteCode)
      .eq("scheduleId", scheduleId)
      .single()

    console.log("doesInviteCodeExists: ", doesInviteCodeExists)

    const expireTime = new Date(doesInviteCodeExists.data.created_at)
    expireTime.setDate(expireTime.getDate() + 1)

    const codeHasExpired = expireTime < new Date()
    if (codeHasExpired) {
      return { error: "Sorry, your invitation as expired" }
    }

    if (doesInviteCodeExists.error) {
      console.warn("error: ", doesInviteCodeExists.error)
      return { error: "Sorry, could not create the user" }
    }
  }

  const doesUserExists = await supabase
    .from("User")
    .select()
    .eq("email", email)
    .single()

  if (doesUserExists.data !== null) {
    console.warn("User already exists")
    return { error: "Sorry, could not create the user" }
  }

  const domain = getDomainUrl()

  const newAuthenticatedUser = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${domain}/auth/callback`,
      data: {
        firstName,
        lastName,
        role: "User",
      },
    },
  })

  if (newAuthenticatedUser.error)
    return { error: newAuthenticatedUser.error.message }

  const createNewUser = await supabase
    .from("User")
    .insert({
      firstName,
      lastName,
      email,
      authId: newAuthenticatedUser.data.user?.id,
    })
    .select("id")
    .single()

  console.log("createNewUser: ", createNewUser)

  if (createNewUser.error) return { error: createNewUser.error.message }

  if (hasInvitationCode) {
    await supabase.from("Room").insert({
      scheduleID: scheduleId,
      userId: createNewUser.data?.id,
      activeInSchedule: false,
      roomNr: -1,
    })
  }

  return { message: "Check email to continue sign in process" }
}
