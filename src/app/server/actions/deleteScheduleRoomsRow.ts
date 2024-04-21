"use server"

import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"

export async function deleteScheduleRoomsRowAction(formdata: FormData) {

  const ids = formdata.getAll('id')
  const scheduleId = formdata.getAll('scheduleId')

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

  try {
    await supabase
      .from("ScheduleRow")
      .delete()
      .in("id", ids)
      .eq("scheduleId", scheduleId)

    revalidatePath("/schedule/[id]", "page")
  } catch (error) {
    // throw new Error("error: can't delete room")
    console.warn("error: ", error)
  }

}
