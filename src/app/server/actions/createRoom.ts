"use server"

import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"

export async function createRoom(formData: FormData) {
  const scheduleId = formData.get("scheduleId")
  const roomNr = formData.get("roomNr")
  const firstName = formData.get("firstName")
  const lastName = formData.get("lastName")
  const inCleaningSchedule = formData.get("inCleaningSchedule")

  const supabase = createServerComponentClient<any>({ cookies })

  // TODO: check if scheduleId exists eg. params.id
  // TODO: Create room with existing user

  try {
    const newUser = await supabase
      .from("User")
      .insert({
        firstName,
        lastName,
      })
      .select("id")
      .single()

    await supabase.from("Room").insert({
      scheduleID: scheduleId,
      userId: newUser.data?.id,
      activeInSchedule: inCleaningSchedule !== null ? true : false,
      roomNr,
    })

    //
  } catch (error) {
    console.warn("error: ", error)
  }

  revalidatePath("/schedule/[id]", "page")
}
