"use server"

import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"

export async function deleteRoom(formData: FormData) {
  const scheduleId = formData.get("scheduleId")
  const roomId = formData.get("roomId")

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

  // TODO: check if scheduleId exists eg. params.id

  try {
    const deletedRoom = await supabase
      .from("Room")
      .delete()
      .match({ id: roomId, scheduleID: scheduleId })
      .explain()

    revalidatePath("/schedule/[id]", "page")
  } catch (error) {
    // throw new Error("error: can't delete room")
    console.warn("error: ", error)
  }
}
