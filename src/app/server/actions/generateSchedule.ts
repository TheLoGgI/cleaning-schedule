"use server"

import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"

type ScheduleRow = {
  id: number
  room: string | null
  scheduleId: string
  weekNr: number
}

function shuffleRooms(rooms: Room[]): Room[] {
  let currentIndex = rooms.length,
    temporaryValue,
    randomIndex,
    counter = 0
  const schedule: Schedule[] = []

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    counter++
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = rooms[currentIndex]
    rooms[currentIndex] = rooms[randomIndex]
    rooms[randomIndex] = temporaryValue
  }

  return rooms
}

export async function generateSchedule(formData: FormData) {
  const scheduleId = String(formData.get("scheduleId"))
  const startingWeek = Number(formData.get("startingWeek"))

  const supabase = createServerComponentClient<any>({ cookies })

  // await sb.from('Schedule').select(`startingWeek`).eq('id', scheduleId).single()

  // Count rows in ScheduleRow for scheduleId
  const scheduleRows = await supabase
    .from("ScheduleRow")
    .select("", { count: "exact", head: true })
    .eq("scheduleId", scheduleId)

  if (scheduleRows.error) {
    throw new Error("Schedule Count went wrong: " + scheduleRows.error.message)
  }

  if (scheduleRows.count == null) {
    throw new Error("Schedule Count could not be found")
  }

  if ((scheduleRows.count || 0) > 0) {
    const deletedScheduleRows = await supabase
      .from("ScheduleRow")
      .delete()
      .eq("scheduleId", scheduleId)
  }

  // TODO: add functions to client also

  const rooms = await supabase
    .from("Room")
    .select(
      `
          id,
          activeInSchedule,
          roomNr,
          User(id, firstName, lastName, email)
          `
    )
    .match({ scheduleID: scheduleId, activeInSchedule: true })
    .order("roomNr")

  const shuffledRooms = shuffleRooms((rooms.data as unknown as Room[]) || [])

  const newScheduleRows: Omit<ScheduleRow, "id">[] = []
  let weekNr = startingWeek
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

  await supabase.from("ScheduleRow").insert(newScheduleRows)

  revalidatePath("/schedule/[id]#Schedule", "page")
}
