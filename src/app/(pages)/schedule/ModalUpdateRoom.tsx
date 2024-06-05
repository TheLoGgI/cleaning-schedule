"use client"

import {
  Dispatch,
  RefObject,
  SetStateAction,
  createContext,
  forwardRef,
  use,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

import { updateRoom } from "@/app/server/actions/updateRoom"
import { Spinner } from "@/app/components/spinner"

type Props = {
  scheduleId: string
  room: Room | null
}

const ModalUpdateRoomContext = createContext<{
  ref: null | RefObject<HTMLDialogElement>
  setModalState: Dispatch<SetStateAction<Props>>
}>({
  ref: null,
  setModalState: () => null,
})

export const useUpdateRoomModal = ({ scheduleId, room }: Props) => {
  const { ref, setModalState } = useContext(ModalUpdateRoomContext)

  if (ref === null)
    return {
      open: () => null,
      close: () => null,
    }

  return {
    open: () => {
      setModalState({ scheduleId, room })
      ref.current?.showModal()
    },
    close: () => {
      ref.current?.close()
    },
  }
}

export const ModalUpdateRoomButton = ({ scheduleId, room }: Props) => {
  const { open } = useUpdateRoomModal({
    scheduleId,
    room,
  })

  return (
    <button
      className="font-medium text-blue-600 dark:text-blue-500 hover:underline py-2 sm:py-0"
      type="button"
      onClick={() => open()}
    >
      Edit
    </button>
  )
}

export const ModalUpdateRoomContextProvider = ({ children }: any) => {
  const ref = useRef<HTMLDialogElement>(null)
  const [modalState, setModalState] = useState<Props>({
    scheduleId: "",
    room: null,
  })

  return (
    <ModalUpdateRoomContext.Provider value={{ ref, setModalState }}>
      <ModalUpdateRoom
        scheduleId={modalState.scheduleId}
        room={modalState.room}
        ref={ref}
      />
      {children}
    </ModalUpdateRoomContext.Provider>
  )
}

export const ModalUpdateRoom = forwardRef<HTMLDialogElement, Props>(
  function ModalUpdateRoom({ scheduleId, room }, ref) {
    
    const [roomNr, setRoomNr] = useState(room?.roomNr || 0)
    const [firstName, setFirstName] = useState(room?.User?.firstName || "")
    const [lastName, setLastName] = useState(room?.User?.lastName || "")
    const [activeInSchedule, setActiveInSchedule] = useState(
      room?.activeInSchedule || false
    )
    
    useLayoutEffect(() => {
      // FIX: set the initial value of activeInSchedule, before the component is rendered
      if (room) {
        setRoomNr(room.roomNr)
        setFirstName(room.User.firstName)
        setLastName(room.User.lastName)
        setActiveInSchedule(room.activeInSchedule)
      }
      }, [room])

    return (
      <>
        <dialog
          className="w-full max-w-md max-h-full bg-transparent z-20 top-0 bottom-0"
          ref={ref}
        >
          <div className="bg-white rounded-lg shadow-lg dark:bg-gray-700">
            <header className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Update Room
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
              action={(formData) => {
                updateRoom(formData)
                // @ts-ignore
                if (ref && ref.current) ref.current.close()
              }}
            >
              <input type="hidden" name="scheduleId" value={scheduleId} />
              {room && <input type="hidden" name="roomId" value={room?.id} />}
              <div className="flex flex-col">
                <label className="text-md dark:text-white" htmlFor="roomNr">
                  Room Number
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  value={roomNr}
                  onChange={(e) => setRoomNr((e.target as HTMLInputElement).valueAsNumber)}
                  className="rounded-md px-4 py-2 bg-inherit dark:bg-slate-500 dark:text-white border mb-6"
                  id="roomNr"
                  name="roomNr"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="text-md dark:text-white" htmlFor="firstName">
                  First Name
                </label>
                <input
                  className="rounded-md px-4 py-2 bg-inherit dark:bg-slate-500 dark:text-white border mb-6"
                  id="firstName"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => 
                    setFirstName((e.target as HTMLInputElement).value)
                  }
                />
              </div>
              <div className="flex flex-col">
                <label className="text-md dark:text-white" htmlFor="lastName">
                  Last Name
                </label>
                <input
                  className="rounded-md px-4 py-2 bg-inherit dark:bg-slate-500 dark:text-white border mb-6"
                  name="lastName"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => 
                    setLastName((e.target as HTMLInputElement).value)
                  }
                  required
                />
              </div>
              <div className="flex justify-between items-center">
                <label
                  className="text-md dark:text-white"
                  htmlFor="inCleaningSchedule"
                >
                  In Schedule Rotation
                </label>
                <input
                  type="checkbox"
                  className="rounded-md px-4 py-2 bg-inherit dark:bg-slate-500 dark:text-white border mb-6"
                  id="inCleaningSchedule"
                  name="inCleaningSchedule"
                  aria-checked={activeInSchedule}
                  checked={activeInSchedule}
                  onChange={(e) => setActiveInSchedule(e.target.checked)}
                />
              </div>

              <button
                type="submit"
                className="border border-gray-700 dark:border-gray-300 bg-blue-400 hover:bg-blue-500 dark:text-white rounded px-4 py-2 text-black"
              >
                Update Room
              </button>
            </form>
          </div>
        </dialog>
      </>
    )
  }
)
