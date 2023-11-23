"use client"

import { useEffect, useState } from "react"

import { swapScheduleRoomsRow } from "@/app/server/actions/swapScheduleRoomsRow"
import { twMerge } from "tailwind-merge"

const RoomCellAdmin = ({
  room,
  selected,
  toggleSelectedSwapItems,
}: {
  room: Room
  selected: boolean
  toggleSelectedSwapItems: () => void
}) => {
  // console.log("selected: ", selected)
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
  console.log("schedule: ", schedule)
  const [selectedRoomSwap, setSelectedRoomSwap] = useState<ScheduleCell[]>([])

  const handleSwap = async (
    room: Room,
    weekNr: number,
    isSelected: boolean
  ) => {
    if (selectedRoomSwap.length > 2) {
      console.log(selectedRoomSwap.length)
      await swapScheduleRoomsRow(schedule.scheduleId, [
        selectedRoomSwap[0],
        selectedRoomSwap[1],
      ])
      return
    }

    if (isSelected) {
      // Clicked on already selected room, Remove it from selected
      const rest = selectedRoomSwap.filter(
        (scheduleItem) => scheduleItem.roomId !== room.id
      )
      setSelectedRoomSwap(rest)
    } else {
      setSelectedRoomSwap((prevState) => [
        ...prevState,
        { roomId: room.id, weekNr },
      ])
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
                (scheduleItem) => scheduleItem.roomId === room.id
              )
              return (
                <RoomCellAdmin
                  key={room.roomNr + index}
                  room={room}
                  selected={isSelected}
                  toggleSelectedSwapItems={() =>
                    handleSwap(room, week.weekNr, isSelected)
                  }
                />
              )
            })}
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
