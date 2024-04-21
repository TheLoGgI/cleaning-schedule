"use client"

import { Role } from "@/app/components/EnumRole"
import { swapScheduleRoomsRow } from "@/app/server/actions/swapScheduleRoomsRow"
import { twMerge } from "tailwind-merge"
import { useState } from "react"
import { useUserRole } from "@/app/hooks/useUserRole"
import { useStore } from "@/app/hooks/useStore"
import {  deleteScheduleRoomsRowAction } from "@/app/server/actions/deleteScheduleRoomsRow"

const RoomCellAdmin = ({
  room,
  selected,
  toggleSelectedSwapItems,
}: {
  room: RoomWithoutId
  selected: boolean
  toggleSelectedSwapItems: () => void
}) => {
  return (
    <td
      className={twMerge(
        "px-6 py-4 group hover:bg-gray-200 cursor-pointer",
        selected && "bg-gray-200 border border-blue-300"
      )}
      onClick={toggleSelectedSwapItems}
    >
      <button
        className={twMerge(
          "group-hover:text-blue-600 group-hover:dark:text-blue-500 text-gray-800 flex justify-between w-full",
          selected && "text-blue-600 dark:text-blue-500"
        )}
        type="button"
      >
        {room === null
          ? "Empty"
          : `${room.roomNr}: ${room.User?.firstName} ${room.User?.lastName}`}
        <span className="font-semibold group-hover:visible invisible">
          Swap
        </span>
      </button>
    </td>
  )
}

export const ScheduleTabBodyAdmin = ({ schedule }: { schedule: Schedule }) => {
  const [selectedRoomSwap, setSelectedRoomSwap] = useState<ScheduleCell[]>([])

  const handleSwap = async (
    room: RoomWithoutId,
    weekNr: number,
    isSelected: boolean,
    selectedRoomSwap: ScheduleCell[]
  ) => {
    const newState = isSelected
      ? selectedRoomSwap.filter(
        (scheduleItem) => scheduleItem.scheduleRowId !== room.row
      )
      : [...selectedRoomSwap, { scheduleRowId: room.row, weekNr }]

    if (newState.length == 2) {
      await swapScheduleRoomsRow(schedule.scheduleId, [
        newState[0],
        newState[1],
      ])
      setSelectedRoomSwap([])
    } else {
      setSelectedRoomSwap(newState)
    }
  }

  return (
    <tbody>
      {schedule.weeks.map((week, index) => {
        return (
          <tr
            key={week.weekNr + index}
            className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 text-gray"
          >
            <td className="px-6 py-4">{week.weekNr}</td>
            {week.rooms.map((room, index: number) => {
              const isSelected = selectedRoomSwap.some(
                (scheduleItem) => scheduleItem.scheduleRowId === room.row
              )
              return (
                <RoomCellAdmin
                  key={room?.roomNr ?? 0 + index}
                  room={room}
                  selected={isSelected}
                  toggleSelectedSwapItems={() =>
                    handleSwap(room, week.weekNr, isSelected, selectedRoomSwap)
                  }
                />
              )
            })}
            <td className="py-4">
              <form action={deleteScheduleRoomsRowAction}>
                <input
                  type="hidden"
                  name="scheduleId"
                  value={schedule.scheduleId}
                />
                {week.rooms.map((room, index: number) => {
                  return (
                    <input
                      key={room?.roomNr ?? 0 + index}
                      type="hidden"
                      name="id"
                      value={room.row}
                    />
                  )
                })}
                <button className="block mx-auto text-white bg-red-700 enabled:hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-2 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800  disabled:bg-gray-400 disabled:cursor-not-allowed"
                  type="submit"
                  title="Delete Row"
                >
                  Delete Row
                </button>
              </form>
            </td>
          </tr>
        )
      })}
    </tbody>
  )
}

export const ScheduleTabBody = ({ schedule }: { schedule: Schedule }) => {
  return (
    <tbody>
      {schedule.weeks.map((row: any) => {
        return (
          <tr
            key={row.weekNr}
            className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 text-gray"
          >
            <td className="px-6 py-4">{row.weekNr}</td>
            {row.rooms.map((room: Room) => {
              return <RoomCell key={room.roomNr} room={room} />
            })}
          </tr>
        )
      })}
    </tbody>
  )
}

const RoomCell = ({ room }: { room: Room }) => {
  return (
    <td className="px-6 py-4 text-black">
      {room === null
        ? "Empty"
        : `${room.roomNr}: ${room.User?.firstName} ${room.User?.lastName}`}
    </td>
  )
}

export const DisplayTableBody = ({ schedule }: { schedule: Schedule }) => {
  const userRole = useUserRole()
  const { editMode } = useStore()

  const isUserAdminOrModerator =
    userRole === Role.Admin || userRole === Role.Moderator



  return isUserAdminOrModerator && editMode === true ? (
    <ScheduleTabBodyAdmin schedule={schedule} />
  ) : (
    <ScheduleTabBody schedule={schedule} />
  )
}
