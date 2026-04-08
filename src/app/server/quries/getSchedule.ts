"use server"

import { db } from "@/lib/db"
import { scheduleRow as scheduleRowTable, room as roomTable, user as userTable } from "@/lib/schema"
import { eq, asc } from "drizzle-orm"

const deleteRoomUser = {
  id: "empty",
  activeInSchedule: true,
  roomNr: 0,
  user: {
    id: "empty",
    firstName: "Missing",
    lastName: "Room",
    email: "",
  },
}

export const getSchedule = async (
  scheduleId: string
): Promise<
  | (Omit<Schedule, "weeks"> & {
      weeks: {
        weekNr: number
        rooms: Array<Omit<Room, "id"> & { row: number }>
      }[]
    })
  | null
> => {
  const rows = await db
    .select({
      id: scheduleRowTable.id,
      weekNr: scheduleRowTable.weekNr,
      roomId: roomTable.id,
      activeInSchedule: roomTable.activeInSchedule,
      roomNr: roomTable.roomNr,
      userId: userTable.id,
      firstName: userTable.firstName,
      lastName: userTable.lastName,
      email: userTable.email,
    })
    .from(scheduleRowTable)
    .leftJoin(roomTable, eq(scheduleRowTable.room, roomTable.id))
    .leftJoin(userTable, eq(roomTable.userId, userTable.id))
    .where(eq(scheduleRowTable.scheduleId, scheduleId))
    .orderBy(asc(scheduleRowTable.weekNr))

  const assembleSchedule = rows.reduce<{
    scheduleId: string
    weeks: Map<number, { weekNr: number; rooms: Array<Omit<Room, "id"> & { row: number }> }>
  }>(
    (acc, row) => {
      const roomEntry =
        row.roomId !== null
          ? {
              activeInSchedule: row.activeInSchedule ?? true,
              roomNr: row.roomNr ?? 0,
              user: {
                id: row.userId ?? "empty",
                firstName: row.firstName ?? "Missing",
                lastName: row.lastName ?? "Room",
                email: row.email ?? "",
              },
            }
          : {
              activeInSchedule: deleteRoomUser.activeInSchedule,
              roomNr: deleteRoomUser.roomNr,
              user: deleteRoomUser.user,
            }

      if (acc.weeks.has(row.weekNr)) {
        acc.weeks.get(row.weekNr)!.rooms.push({ row: row.id, ...roomEntry })
      } else {
        acc.weeks.set(row.weekNr, {
          weekNr: row.weekNr,
          rooms: [{ row: row.id, ...roomEntry }],
        })
      }
      return acc
    },
    { scheduleId, weeks: new Map() }
  )

  return {
    ...assembleSchedule,
    weeks: [...assembleSchedule.weeks.values()],
  }
}
