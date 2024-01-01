"use server"

import { SupabaseClient, UserResponse } from "@supabase/supabase-js"

const deleteRoomUser = {
  id: "empty",
  activeInSchedule: true,
  roomNr: 0,
  User: {
    id: "empty",
    firstName: "Missing",
    lastName: "Room",
    email: "",
  },
}

export const getSchedule = async (
  scheduleId: string,
  auth: UserResponse,
  supabase: SupabaseClient<any, "public", any>
): Promise<
  | (Omit<Schedule, "weeks"> & {
      weeks: {
        weekNr: number
        rooms: Array<Omit<Room, "id"> & { row: number }>
      }[]
    })
  | null
> => {
  const scheduleRows = await supabase
    .from("ScheduleRow")
    .select(
      `
      id,
      weekNr,
      room: Room(id, activeInSchedule, roomNr, User(id, firstName, lastName, email))
      `
    )
    .eq("scheduleId", scheduleId)
    .order("weekNr", { ascending: true })

  const assembleSchedule = (
    scheduleRows.data as unknown as ScheduleRowData[]
  )?.reduce<{
    scheduleId: string
    weeks: Map<
      number,
      {
        weekNr: number
        rooms: Array<Omit<Room, "id"> & { row: number }>
      }
    >
  }>(
    (scheduleCollection, row) => {
      const { activeInSchedule, roomNr, User } =
        row.room !== null ? row.room : deleteRoomUser

      if (scheduleCollection.weeks.has(row.weekNr)) {
        const existingRowForWeek = scheduleCollection.weeks.get(row.weekNr)
        if (!existingRowForWeek) return scheduleCollection

        // TODO: Replace RoomId with Id of row
        existingRowForWeek.rooms.push({
          row: row.id,
          activeInSchedule,
          roomNr,
          User,
        })

        return scheduleCollection
      }

      scheduleCollection.weeks.set(row.weekNr, {
        weekNr: row.weekNr,
        rooms: [
          {
            row: row.id,
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
      // Sample Format
      // [
      //   // { weekNr: 1, rooms: [{ roomNr: 1, User: { firstName: "John", lastName: "Doe" } }] }
      // ],
    }
  )

  if (!assembleSchedule) return null

  return {
    ...assembleSchedule,
    weeks: [...assembleSchedule.weeks.values()],
  }
}
