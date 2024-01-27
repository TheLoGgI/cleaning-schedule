"use server"

import { ScheduleRow } from "./generateSchedule"
import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"
import { shuffleRooms } from "@/app/helpers/shuffleRooms"

export async function generateNextWeekSchedule(
  prevState: any,
  formData: FormData
) {
  const scheduleId = String(formData.get("scheduleId"))
  console.log("scheduleId: ", scheduleId)

  const supabase = createServerComponentClient<any>({ cookies })

  const weeksNumbersForSchedule = await supabase
    .from("ScheduleRow")
    .select("weekNr")
    .eq("scheduleId", scheduleId)

  const maxWeek =
    weeksNumbersForSchedule.data &&
    Math.max(...weeksNumbersForSchedule.data.map((week) => week.weekNr)) + 1 // currentWeek + 1 for the next Week
  console.log("maxWeek: ", maxWeek)

  if (maxWeek == null) {
    throw new Error(
      "Ops, there was a problem can't generate schedules right now, try again later"
    )
  }

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
  let weekNr = maxWeek
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
