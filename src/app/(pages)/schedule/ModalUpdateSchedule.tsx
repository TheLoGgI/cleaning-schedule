"use client"

import { useRef, useState } from "react"

import { AuthUser } from "@supabase/supabase-js"
import { updateSchedule } from "@/app/server/actions/updateSchedule"

// import { experimental_useFormStatus as useFormStatus } from 'react-dom'

type Props = {
  schedule: Schedule
  user: AuthUser
  children?: JSX.Element
}

export default function ModalUpdateSchedule({
  schedule,
  user,
  children,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  // const { pending, ...status } = useFormStatus()
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <>
      <button
        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
        type="button"
        onClick={() => dialogRef.current?.showModal()}
      >
        Edit Schedule
      </button>
      {/* <button
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Update Schedule
      </button> */}

      <dialog
        ref={dialogRef}
        className="w-full max-w-md max-h-full bg-transparent z-20" /* open={showModal} */
      >
        <div className="bg-white rounded-lg shadow dark:bg-gray-700">
          <header className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Update Schedule
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
            className="flex-1 flex flex-col w-full px-10 py-4 pb-6 justify-center gap-2 text-foreground space-y-4"
            action={async (formData) => {
              // formRef.current?.reset()

              await updateSchedule(formData)
              dialogRef.current?.close()
            }}
          >
            <input
              type="hidden"
              name="scheduleId"
              value={schedule?.id}
              required
            />
            <input type="hidden" name="authId" value={user?.id} required />
            <div className="flex flex-col">
              <label className="text-md dark:text-white" htmlFor="scheduleName">
                Schedule Name
              </label>
              <input
                id="scheduleName"
                className="rounded-md px-4 py-2 bg-inherit dark:bg-slate-500 dark:text-white border"
                name="scheduleName"
                defaultValue={schedule.name}
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-md dark:text-white" htmlFor="startingWeek">
                Starting Week
              </label>
              <input
                type="number"
                id="startingWeek"
                className="rounded-md px-4 py-2 bg-inherit dark:bg-slate-500 dark:text-white border"
                name="startingWeek"
                defaultValue={schedule.startingWeek.toString()}
                required
              />
            </div>
            <div className="flex flex-row items-center justify-between">
              <label
                className="text-md dark:text-white"
                htmlFor="inCleaningSchedule"
              >
                In Schedule Rotation
              </label>
              <input
                type="checkbox"
                id="inCleaningSchedule"
                defaultChecked={schedule.isActive}
                className="rounded-md px-4 bg-inherit text-blue-500 text-2xl border accent-current"
                name="inCleaningSchedule"
              />
            </div>

            <button
              type="submit"
              className="border border-gray-700 dark:border-gray-300 bg-blue-400 hover:bg-blue-500 dark:text-white rounded px-4 py-2 text-black disabled:opacity-70"
              // aria-disabled={pending}
              // disabled={pending}
            >
              Update Schedule
            </button>
            {/* <Messages /> */}
          </form>
        </div>
        {/* {pending && (
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        )} */}
      </dialog>
    </>
  )
}
