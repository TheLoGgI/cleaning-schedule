"use server"

import {
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs"

import { cookies } from "next/headers"
import { shuffleRooms } from "@/app/helpers/shuffleRooms"
import { getWeekNumber } from "@/app/helpers/getWeekNumber"

export type ScheduleRow = {
  id: number
  room: string | null
  scheduleId: string
  weekNr: number
}

type Schedule = {
  id: string
  
  [key: string]: any
}


export async function rollSchedules() {

  const supabase = createServerComponentClient<any>({ cookies })

  const schedules = await supabase
  .from("Schedule")
  .select(
    `id, 
    rooms: Room(id, activeInSchedule, roomNr, User(id, firstName, lastName, email))
    `)

    const currentWeekNumber = getWeekNumber(new Date())
  
  // Remove all schedule rows
  await supabase
      .from("ScheduleRow")
      .delete()
      .lte("weekNr", currentWeekNumber - 1)

  const collectionRows = schedules.data?.flatMap((schedule: Schedule ) => {
    const scheduleId = schedule.id
    
    const shuffledRooms = shuffleRooms((schedule.rooms as unknown as Room[]) || [])
  
    // Create new schedule rows and insert them into the database
    const newScheduleRows: Omit<ScheduleRow, "id">[] = []
    let weekNr = currentWeekNumber + 1
    for (let index = 0; index < shuffledRooms.length; index += 2, weekNr++) {
      const first = shuffledRooms[index]
      const second = shuffledRooms[index + 1]
  
      if (first === undefined || second === undefined) {
        newScheduleRows.push(
          {
            scheduleId,
            weekNr: weekNr,
            room: first?.id ?? null,
          },
          {
            scheduleId,
            weekNr: weekNr,
            room: second?.id ?? null,
          }
        )
  
        // Skip the rest of the loop and continue with the next iteration
        continue
      }
  
      newScheduleRows.push(
        {
          scheduleId,
          weekNr: weekNr,
          room: first.id,
        },
        {
          scheduleId,
          weekNr: weekNr,
          room: second.id,
        }
      )
    }

    return newScheduleRows

  })
  
  await supabase.from("ScheduleRow").insert(collectionRows)
}
