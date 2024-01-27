"use client"

import {
  Dispatch,
  RefObject,
  SetStateAction,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"

import { AuthUser } from "@supabase/supabase-js"
import { PendingButton } from "@/app/components/signInOut/pendingButton"
import { deleteScheduleAction } from "@/app/server/actions/deleteScheduleAction"
import { useFormState } from "react-dom"

type Props = { schedule: DashboardSchedule; authId: AuthUser["id"] }

const ModalDeleteScheduleContext = createContext<{
  ref: null | RefObject<HTMLDialogElement>
  setModalState: Dispatch<SetStateAction<Props | null>>
}>({
  ref: null,
  setModalState: () => null,
})

export const useDeleteSchedule = ({ schedule, authId }: Props) => {
  const { ref, setModalState } = useContext(ModalDeleteScheduleContext)

  if (ref === null)
    return {
      open: () => null,
      close: () => null,
    }

  return {
    open: () => {
      setModalState({ schedule, authId })
      ref.current?.showModal()
    },
    close: () => {
      ref.current?.close()
    },
  }
}

export const ModalDeleteScheduleButton = ({ schedule, authId }: Props) => {
  const { open } = useDeleteSchedule({ schedule, authId })

  return (
    <button
      className="font-medium text-red-600 dark:text-red-500 hover:underline text-base"
      onClick={open}
    >
      Delete
    </button>
  )
}

export const ModalDeleteScheduleContextProvider = ({ children }: any) => {
  const ref = useRef<HTMLDialogElement>(null)
  const [modalState, setModalState] = useState<Props | null>(null)

  return (
    <ModalDeleteScheduleContext.Provider value={{ ref, setModalState }}>
      <ModalDeleteSchedule
        schedule={modalState?.schedule || ({} as DashboardSchedule)}
        authId={modalState?.authId || ""}
        ref={ref}
      />
      {children}
    </ModalDeleteScheduleContext.Provider>
  )
}

const initialState = {
  // status: "idle",
}

export const ModalDeleteSchedule = forwardRef<HTMLDialogElement, Props>(
  function ModalDeleteSchedule({ schedule, authId }, ref) {
      // @ts-ignore - TODO: fix type formstate
    const [state, formAction] = useFormState(deleteScheduleAction, initialState)

    return (
      <>
        <dialog
          className="w-full max-w-md max-h-full bg-transparent z-20 top-0 bottom-0"
          ref={ref}
        >
          <div className="bg-white rounded-lg shadow-lg dark:bg-gray-700">
            <header className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Delete Schedule: {schedule.name}
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={() => {
                  // @ts-ignore
                  if (ref && ref.current) ref.current.close()
                }}
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
              action={async (formData) => {
                  // @ts-ignore - TODO: fix type formstate
                formAction(formData)
                setTimeout(() => {
                  // @ts-ignore
                  if (ref && ref.current) ref.current.close()
                }, 800)
              }}
            >
              <input type="hidden" name="scheduleId" value={schedule.id} />
              <input type="hidden" name="authId" value={authId} />

              <p className="text-lg ">
                Are you sure you want to delete this schedule?
              </p>
              <p>
                When the schedule is deleted there is no revival, all rooms
                associated with schedule will be removed as well
              </p>

              <PendingButton
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
              >
                Delete Schedule
              </PendingButton>
            </form>
          </div>
        </dialog>
      </>
    )
  }
)
