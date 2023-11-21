"use client"

import { useEffect, useState } from "react"

import { swapScheduleRoomsRow } from "@/app/server/actions/swapScheduleRoomsRow"
import { twMerge } from "tailwind-merge"

const RoomCellAdmin = ({
  room,
  selected,
}: // setSelectedRoomSwap,
{
  room: Room
  selected: boolean
  // setSelectedRoomSwap: (room: Room) => void
}) => {
  // console.log("selected: ", selected)
  return (
    <td
      className={twMerge(
        "px-6 py-4 group hover:bg-gray-200 cursor-pointer",
        selected && "bg-gray-200 border border-blue-300"
      )}
      // onClick={() => {
      //   setSelectedRoomSwap(room)
      // }}
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
  // console.log("schedule: ", schedule)
  const [selectedRoomSwap, setSelectedRoomSwap] = useState<string[]>([])

  const handleSwap = (room: Room) => {
    // console.log("selectedRoomSwap.length: ", selectedRoomSwap.length)
    // console.log("roomid", room.id)

    if (selectedRoomSwap.length >= 2) {
      console.log(selectedRoomSwap.length)
      // swapScheduleRoomsRow(...selectedRoomSwap)
      return
    }

    console.log("selectedRoomSwap: ", selectedRoomSwap)
    console.log(
      "selectedRoomSwap.includes(room.id): ",
      selectedRoomSwap.includes(room.id)
    )
    if (selectedRoomSwap.includes(room.id)) {
      // Clicked on already selected room, Remove it from selected
      const rest = selectedRoomSwap.filter((id) => id !== room.id)
      console.log("rest: ", rest)
      setSelectedRoomSwap(rest)
    } else {
      console.log("add room: ", room.id)
      setSelectedRoomSwap((prevState) => [...prevState, room.id])
    }
    // console.log("selectedRoomSwap: ", selectedRoomSwap)
  }

  return (
    <tbody>
      {schedule.weeks.map((row: any) => {
        return (
          <tr
            key={row.id}
            className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 text-gray"
          >
            <td className="px-6 py-4">{row.weekNr}</td>
            {row.rooms.map((room: Room) => {
              return (
                <RoomCellAdmin
                  key={room.roomNr}
                  room={room}
                  selected={false}
                  // selected={selectedRoomSwap.includes(row..id)}
                  // setSelectedRoomSwap={handleSwap}
                />
              )
            })}

            {/* <RoomCellAdmin
              room={row.roomTwo}
              selected={selectedRoomSwap.includes(row.roomTwo.id)}
              setSelectedRoomSwap={handleSwap}
            /> */}
          </tr>
        )
      })}
    </tbody>
  )
}

export const ScheduleTabBody = ({ schedule }: { schedule: Schedule }) => {
  console.log("schedule: ", schedule)
  return (
    <tbody>
      {schedule.weeks.map((row: any) => {
        console.log("row: ", row)
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
