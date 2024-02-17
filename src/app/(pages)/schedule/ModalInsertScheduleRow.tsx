"use client"

import { useRef, useState } from "react"

import { ListBox } from "@/app/components/Listbox"
import { insertScheduleRow } from "@/app/server/actions/insertScheduleRow"

type Props = {
  rooms: Room[]
  scheduleId: string
  weekNr: number
}

export default function ModalInsertScheduleRow({
  rooms,
  scheduleId,
  weekNr,
}: Props) {
  const [scheduleWeek, setScheduleWeek] = useState(weekNr + 1)
  const formRef = useRef<HTMLFormElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  const roomsOptions = [
    {
      id: "",
      name: "None",
      activeInSchedule: true,
      value: "",
    },
    ...rooms.map((room) => ({
      id: room.id,
      name: room.User
        ? `${room.User.firstName} ${room.User.lastName}`
        : "No name",
      activeInSchedule: room.activeInSchedule,
      value: room.id,
    })),
  ]

  return (
    <>
      <button
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        onClick={() => dialogRef.current?.showModal()}
      >
        Insert Row
      </button>

      <dialog
        ref={dialogRef}
        className="w-full max-w-md max-h-full bg-transparent z-20"
        // open={showModal}
      >
        <div className="bg-white rounded-lg shadow-lg dark:bg-gray-700">
          <header className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Insert Row to Schedule
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={() => dialogRef.current?.close()}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </header>

          <form
            ref={formRef}
            className="flex-1 flex flex-col w-full px-10 py-4 pb-6 justify-center gap-2 text-foreground"
            action={(formData) => {
              insertScheduleRow(formData)
              formRef.current?.reset()
              setScheduleWeek((prev) => prev + 1)
            }}
          >
            <input type="hidden" name="scheduleId" value={scheduleId} />
            <div className="flex flex-col">
              <label className="text-md dark:text-white" htmlFor="email">
                Week Nr.
              </label>
              <input
                type="number"
                className="rounded-md px-4 py-2 bg-inherit dark:bg-slate-500 dark:text-white border mb-6"
                name="weekNr"
                value={scheduleWeek}
                onChange={(e) => setScheduleWeek(parseInt(e.target.value))}
                required
              />
            </div>
            <div className="flex flex-col">
              <ListBox
                options={roomsOptions}
                label="Cleaner 1"
                name="cleaner1"
              />
            </div>
            <div className="flex flex-col my-6">
              <ListBox
                options={roomsOptions}
                label="Cleaner 2"
                name="cleaner2"
              />
            </div>

            <button
              type="submit"
              className="border border-gray-700 dark:border-gray-300 bg-blue-400 hover:bg-blue-500 dark:text-white rounded px-4 py-2 text-black"
            >
              Insert Row
            </button>

            {/* <Messages /> */}
          </form>
        </div>
      </dialog>
    </>
  )
}
