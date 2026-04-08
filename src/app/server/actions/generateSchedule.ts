"use server"

import { db } from "@/lib/db"
import { scheduleRow, room as roomTable } from "@/lib/schema"
import { eq, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { shuffleRooms } from "@/app/helpers/shuffleRooms"

export type ScheduleRow = {
  id: number
  room: string | null
  scheduleId: string
  weekNr: number
}

export const resetSchedule = async (scheduleId: string) => {
  await db
    .delete(scheduleRow)
    .where(eq(scheduleRow.scheduleId, scheduleId))
}

export async function generateSchedule(prevState: any, formData: FormData) {
  const scheduleId = String(formData.get("scheduleId"))
  const startingWeek = Number(formData.get("startingWeek"))

  await resetSchedule(scheduleId)

  const rooms = await db.query.room.findMany({
    where: and(
      eq(roomTable.scheduleID, scheduleId),
      eq(roomTable.activeInSchedule, true)
    ),
    orderBy: (r, { asc }) => [asc(r.roomNr)],
    with: { user: true },
  })

  const shuffledRooms = shuffleRooms(rooms as unknown as Room[])

  const newScheduleRows: Omit<ScheduleRow, "id">[] = []
  let weekNr = startingWeek
  for (let index = 0; index < shuffledRooms.length; index += 2, weekNr++) {
    const first = shuffledRooms[index]
    const second = shuffledRooms[index + 1]
    newScheduleRows.push(
      { scheduleId, weekNr, room: first?.id ?? null },
      { scheduleId, weekNr, room: second?.id ?? null }
    )
  }

  if (newScheduleRows.length > 0) {
    await db.insert(scheduleRow).values(newScheduleRows)
  }

  revalidatePath("/schedule/[id]#Schedule", "page")
}
