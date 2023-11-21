"use server"

import { SupabaseClient, UserResponse } from "@supabase/supabase-js"

import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

export const getSchedule = async (
  scheduleId: string,
  auth: UserResponse,
  supabase: SupabaseClient<any, "public", any>
): Promise<Schedule | null> => {
  const scheduleRows = await supabase
    .from("ScheduleRow")
    .select(
      `weekNr,
        room: Room(activeInSchedule, roomNr, User(id, firstName, lastName, email))
      `
    )
    .eq("scheduleId", scheduleId)
  // .order("weekNr", { ascending: true })

  const assembleSchedule = scheduleRows.data?.reduce<{
    scheduleId: string
    weeks: Map<number, { weekNr: number; rooms: Omit<Room, "id" | "userId">[] }>
  }>(
    (scheduleCollection, row) => {
      const { activeInSchedule, roomNr, User } = row.room
      if (scheduleCollection.weeks.has(row.weekNr)) {
        const existingRowForWeek = scheduleCollection.weeks.get(row.weekNr)
        if (!existingRowForWeek) return scheduleCollection
        existingRowForWeek.rooms.push({
          activeInSchedule,
          roomNr,
          User,
        })

        // scheduleCollection.weeks.set(row.weekNr, existingRowForWeek)

        return scheduleCollection
      }

      scheduleCollection.weeks.set(row.weekNr, {
        weekNr: row.weekNr,
        rooms: [
          {
            activeInSchedule,
            roomNr,
            User,
          },
        ],
      })
      return scheduleCollection
    },
    {
      scheduleId,
      weeks: new Map(),
      // [
      //   // { weekNr: 1, rooms: [{ roomNr: 1, User: { firstName: "John", lastName: "Doe" } }] }
      // ],
    }
  )

  if (!assembleSchedule) return null
  console.log("assembleSchedule: ", assembleSchedule)

  return {
    ...assembleSchedule,
    weeks: [...assembleSchedule.weeks.values()],
  }
}
