"use client"

import Messages from "../login/messages"
import { createPortal } from "react-dom"
import { updateRoom } from "@/app/server/actions/updateRoom"
import { useState } from "react"

type Props = {
  scheduleId: string
  room: Room
}

export default function ModalUpdateRoom({ scheduleId, room }: Props) {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button
        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Edit
      </button>

      {createPortal(
        <dialog
          className="w-full max-w-md max-h-full bg-transparent z-20 top-0 bottom-0"
          open={showModal}
        >
          <div className="bg-white rounded-lg shadow-lg dark:bg-gray-700">
            <header className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Update Room
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => setShowModal(false)}
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
              className="flex-1 flex flex-col w-full px-10 py-4 pb-6 justify-center gap-2 text-foreground"
              action={(formData) => {
                updateRoom(formData)
                setShowModal(false)
              }}
            >
              <input type="hidden" name="scheduleId" value={scheduleId} />
              <input type="hidden" name="roomId" value={room.id} />
              <div className="flex flex-col">
                <label className="text-md dark:text-white" htmlFor="email">
                  Room Number
                </label>
                <input
                  type="number"
                  defaultValue={room.roomNr}
                  className="rounded-md px-4 py-2 bg-inherit dark:bg-slate-500 dark:text-white border mb-6"
                  name="roomNr"
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
                  defaultValue={room.User?.firstName}
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
                  defaultValue={room.User?.lastName}
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
                  aria-checked={room.activeInSchedule}
                  defaultChecked={room.activeInSchedule}
                />
              </div>

              <button
                type="submit"
                className="border border-gray-700 dark:border-gray-300 bg-blue-400 hover:bg-blue-500 dark:text-white rounded px-4 py-2 text-black"
              >
                Update Room
              </button>

              <Messages />
            </form>
          </div>
        </dialog>,
        document.body
      )}
    </>
  )
}
