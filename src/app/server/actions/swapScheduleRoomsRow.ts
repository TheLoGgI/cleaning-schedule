"use server"

import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"

export async function swapScheduleRoomsRow(
  scheduleId: string,
  scheduleSwap: [ScheduleCell, ScheduleCell]
) {
  if (
    scheduleSwap[0]?.weekNr === scheduleSwap[1]?.weekNr
    // ||
    // (scheduleSwap[0] == null && scheduleSwap[1] == null)
  ) {
    // TODO: Throw error
    return
  }

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

  // const auth = await supabase.auth.getUser()

  // First Room

  try {
    await supabase
      .from("ScheduleRow")
      .update({
        weekNr: scheduleSwap[1].weekNr,
      })
      .match({
        scheduleId: scheduleId,
        id: scheduleSwap[0].scheduleRowId,
      })
      .explain()

    await supabase
      .from("ScheduleRow")
      .update({
        weekNr: scheduleSwap[0].weekNr,
      })
      .match({
        scheduleId: scheduleId,
        id: scheduleSwap[1].scheduleRowId,
      })
      .explain()
  } catch (error) {
    console.warn("error: ", error)
  }

  revalidatePath(`/schedule/${scheduleId}`)
}
