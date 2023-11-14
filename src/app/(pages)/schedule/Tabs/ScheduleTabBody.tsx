"use client"

import { useEffect, useState } from "react"

import { twMerge } from "tailwind-merge"

const RoomCell = ({
  room,
  selected,
  setSelectedRoomSwap,
}: {
  room: Room
  selected: boolean
  setSelectedRoomSwap: (room: Room) => void
}) => {
  console.log("selected: ", selected)
  return (
    <td
      className={twMerge(
        "px-6 py-4 group hover:bg-gray-200 cursor-pointer w-2/4",
        selected && "bg-gray-200 border border-blue-300"
      )}
      onClick={() => {
        setSelectedRoomSwap(room)
      }}
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

export const ScheduleTabBody = ({ schedule }: { schedule: Schedule[] }) => {
  const [selectedRoomSwap, setSelectedRoomSwap] = useState<string[]>([])

  const handleSwap = (room: Room) => {
    if (selectedRoomSwap.length > 2) return null
    console.log("selectedRoomSwap: ", selectedRoomSwap)
    if (selectedRoomSwap.includes(room.id)) {
      setSelectedRoomSwap(selectedRoomSwap.filter((id) => id !== room.id))
    } else {
      setSelectedRoomSwap((prevState) => [...prevState, room.id])
    }
  }

  return (
    <tbody>
      {schedule.map((row: any) => {
        return (
          <tr
            key={row.id}
            className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 text-gray"
          >
            <td className="px-6 py-4">{row.weekNr}</td>
            <RoomCell
              room={row.roomOne}
              selected={selectedRoomSwap.includes(row.roomOne.id)}
              setSelectedRoomSwap={handleSwap}
            />
            <RoomCell
              room={row.roomTwo}
              selected={selectedRoomSwap.includes(row.roomOne.id)}
              setSelectedRoomSwap={handleSwap}
            />
          </tr>
        )
      })}
    </tbody>
  )
}
