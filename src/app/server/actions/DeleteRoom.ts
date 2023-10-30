"use server"

import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"

export async function deleteRoom(formData: FormData) {
  const scheduleId = formData.get("scheduleId")
  const roomId = formData.get("roomId")
  console.log("roomId: ", { roomId })
  console.log("scheduleId: ", scheduleId)

  const supabase = createServerComponentClient<any>({ cookies })

  // TODO: check if scheduleId exists eg. params.id

  try {
    const deletedRoom = await supabase
      .from("Room")
      .delete()
      .match({ id: roomId, scheduleID: scheduleId })
      .explain()

    console.log("deletedRoom: ", deletedRoom)
    revalidatePath("/schedule/[id]", "page")
  } catch (error) {
    // throw new Error("error: can't delete room")
    console.log("error: ", error)
  }
}
