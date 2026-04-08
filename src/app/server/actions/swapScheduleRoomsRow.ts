"use server"

import { db } from "@/lib/db"
import { scheduleRow } from "@/lib/schema"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function swapScheduleRoomsRow(
  scheduleId: string,
  scheduleSwap: [ScheduleCell, ScheduleCell]
) {
  if (scheduleSwap[0]?.weekNr === scheduleSwap[1]?.weekNr) {
    return
  }

  try {
    await db
      .update(scheduleRow)
      .set({ weekNr: scheduleSwap[1].weekNr })
      .where(
        and(
          eq(scheduleRow.scheduleId, scheduleId),
          eq(scheduleRow.id, scheduleSwap[0].scheduleRowId)
        )
      )

    await db
      .update(scheduleRow)
      .set({ weekNr: scheduleSwap[0].weekNr })
      .where(
        and(
          eq(scheduleRow.scheduleId, scheduleId),
          eq(scheduleRow.id, scheduleSwap[1].scheduleRowId)
        )
      )
  } catch (error) {
    console.warn("error: ", error)
  }

  revalidatePath(`/schedule/${scheduleId}`)
}
