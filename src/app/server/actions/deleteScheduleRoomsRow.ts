"use server"

import { db } from "@/lib/db"
import { scheduleRow } from "@/lib/schema"
import { and, eq, inArray } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function deleteScheduleRoomsRowAction(formdata: FormData) {
  const ids = formdata.getAll("id").map(Number)
  const scheduleId = String(formdata.get("scheduleId"))

  try {
    await db
      .delete(scheduleRow)
      .where(
        and(
          inArray(scheduleRow.id, ids),
          eq(scheduleRow.scheduleId, scheduleId)
        )
      )

    revalidatePath("/schedule/[id]", "page")
  } catch (error) {
    console.warn("error: ", error)
  }
}
