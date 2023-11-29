"use client"

import { useRef, useState } from "react"

import { createRoom } from "@/app/server/actions/createRoom"

type Props = {
  title: string
  rooms: Room[]
  scheduleId: string
}

export default function ModalCreateRoom({ title, rooms, scheduleId }: Props) {
  const [roomNumber, setRoomNumber] = useState((rooms?.length || 0) + 1)
  const formRef = useRef<HTMLFormElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  return (
    <>
      <button
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        onClick={() => dialogRef.current?.showModal()}
      >
        Add Room
      </button>

      <dialog
        className="w-full max-w-md max-h-full bg-transparent z-20"
        ref={dialogRef}
        // open={showModal}
      >
        <div className="bg-white rounded-lg shadow-lg dark:bg-gray-700">
          <header className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Add Room to Schedule
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
              createRoom(formData)
              formRef.current?.reset()
              setRoomNumber((prev) => prev + 1)
              dialogRef.current?.close()
            }}
          >
            <input type="hidden" name="scheduleId" value={scheduleId} />
            <div className="flex flex-col">
              <label className="text-md dark:text-white" htmlFor="email">
                Room Number
              </label>
              <input
                type="number"
                className="rounded-md px-4 py-2 bg-inherit dark:bg-slate-500 dark:text-white border mb-6"
                name="roomNr"
                value={roomNumber}
                onChange={(e) => setRoomNumber(parseInt(e.target.value))}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-md dark:text-white" htmlFor="email">
                First Name
              </label>
              <input
                className="rounded-md px-4 py-2 bg-inherit dark:bg-slate-500 dark:text-white border mb-6"
                name="firstName"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-md dark:text-white" htmlFor="email">
                Last Name
              </label>
              <input
                className="rounded-md px-4 py-2 bg-inherit dark:bg-slate-500 dark:text-white border mb-6"
                name="lastName"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-md dark:text-white" htmlFor="email">
                In Schedule Rotation
              </label>
              <input
                type="checkbox"
                className="rounded-md px-4 py-2 bg-inherit dark:bg-slate-500 dark:text-white border mb-6"
                name="inCleaningSchedule"
              />
            </div>

            <button
              type="submit"
              className="border border-gray-700 dark:border-gray-300 bg-blue-400 hover:bg-blue-500 dark:text-white rounded px-4 py-2 text-black"
            >
              Create Room
            </button>

            {/* <Messages /> */}
          </form>
        </div>
      </dialog>
    </>
  )
}
