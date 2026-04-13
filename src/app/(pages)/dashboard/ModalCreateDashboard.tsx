"use client"

import { useRef, useState, useActionState, type ReactNode } from "react"

import { createSchedule } from "@/app/server/actions/createSchedule"
import { getWeekNumber } from "@/app/helpers/getWeekNumber"

type Props = {
  createdBy: string
  children?: ReactNode
}

const initialState = {
  status: undefined,
  body: undefined,
}

export default function ModalCreateDashboard({ createdBy, children }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)

  const today = new Date()
  const currentWeekNumber = getWeekNumber(today)

  const [startingWeek, setStartingWeek] = useState<number>(currentWeekNumber)
  // @ts-ignore
  const [state, formAction] = useActionState(createSchedule, initialState)

  return (
    <>
      <button
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        type="button"
        onClick={() => dialogRef.current?.showModal()}
      >
        Create Schedule
      </button>

      <dialog
        className="w-full max-w-md max-h-full bg-transparent"
        ref={dialogRef}
      >
        <div className="bg-white rounded-lg shadow dark:bg-gray-700">
          <header className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Create Schedule
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
            action={async (formData) => {
              // @ts-ignore
              formAction(formData)
              setTimeout(() => {
                if (state.status === 200) dialogRef.current?.close()
                formRef.current?.reset()
              }, 800)
            }}
          >
            <input type="hidden" name="createdBy" value={createdBy} />
            <div className="flex flex-col">
              <label className="text-md" htmlFor="scheduleName">
                Schedule Name
              </label>
              <input
                className="rounded-md px-4 py-2 bg-inherit border mb-6"
                name="scheduleName"
                id="scheduleName"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-md" htmlFor="startingWeek">
                Starting Week
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  id="startingWeek"
                  className="rounded-md w-20 px-4 py-2 bg-inherit border"
                  name="startingWeek"
                  value={startingWeek}
                  onChange={(e) => setStartingWeek(parseInt(e.target.value))}
                  required
                />
                <button
                  className="flex-grow bg-gray-200 px-2 py-2.5 hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm"
                  type="button"
                  onClick={() => setStartingWeek(currentWeekNumber)}
                >
                  Set to Current week
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create Schedule
            </button>
          </form>
        </div>
      </dialog>
    </>
  )
}
