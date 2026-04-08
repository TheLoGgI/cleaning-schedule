"use server"

import { db } from "@/lib/db"
import { schedule, scheduleRow, room as roomTable } from "@/lib/schema"
import { lte } from "drizzle-orm"
import { shuffleRooms } from "@/app/helpers/shuffleRooms"
import { getWeekNumber } from "@/app/helpers/getWeekNumber"

export type ScheduleRow = {
  id: number
  room: string | null
  scheduleId: string
  weekNr: number
}

export async function rollSchedules() {
  const currentWeekNumber = getWeekNumber(new Date())

  // Remove old schedule rows (past weeks)
  await db
    .delete(scheduleRow)
    .where(lte(scheduleRow.weekNr, currentWeekNumber - 1))

  const schedules = await db.query.schedule.findMany({
    with: {
      rooms: {
        with: { user: true },
      },
    },
  })

  const collectionRows = schedules.flatMap((s) => {
    const shuffledRooms = shuffleRooms((s.rooms as unknown as Room[]) || [])
    const newScheduleRows: Omit<ScheduleRow, "id">[] = []
    let weekNr = currentWeekNumber + 1
    for (let index = 0; index < shuffledRooms.length; index += 2, weekNr++) {
      const first = shuffledRooms[index]
      const second = shuffledRooms[index + 1]
      newScheduleRows.push(
        { scheduleId: s.id, weekNr, room: first?.id ?? null },
        { scheduleId: s.id, weekNr, room: second?.id ?? null }
      )
    }
    return newScheduleRows
  })

  if (collectionRows.length > 0) {
    await db.insert(scheduleRow).values(collectionRows)
  }
}
