"use client"

import {
  Dispatch,
  RefObject,
  SetStateAction,
  createContext,
  forwardRef,
  useContext,
  useRef,
  useState,
} from "react"

import Messages from "../login/messages"
import { inviteUser } from "@/app/server/actions/inviteUser"

type Props = {
  scheduleId: string
  user: User | null
}

const ModalInviteUserContext = createContext<{
  ref: null | RefObject<HTMLDialogElement>
  setModalState: Dispatch<SetStateAction<Props>>
}>({
  ref: null,
  setModalState: () => null,
})

const useInviteUserModal = ({ scheduleId, user }: Props) => {
  const { ref, setModalState } = useContext(ModalInviteUserContext)

  if (ref === null)
    return {
      open: () => null,
      close: () => null,
    }

  return {
    open: () => {
      setModalState({ scheduleId, user })
      console.log("ref: ", ref, user?.firstName)
      ref.current?.showModal()
    },
    close: () => {
      ref.current?.close()
    },
  }
}

export const InviteModalButton = ({ scheduleId, user }: Props) => {
  const { open } = useInviteUserModal({
    scheduleId,
    user,
  })

  return (
    <button
      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
      type="button"
      onClick={() => open()}
    >
      {user?.email == null ? "Invite" : "Resent invite"}
    </button>
  )
}

export const ModalContextProvider = ({ children }: any) => {
  const ref = useRef<HTMLDialogElement>(null)
  const [modalState, setModalState] = useState<Props>({
    scheduleId: "",
    user: null,
  })

  // TODO: Fix initial state has to be invoked twice

  return (
    <ModalInviteUserContext.Provider value={{ ref, setModalState }}>
      <ModalInviteUser
        scheduleId={modalState.scheduleId}
        user={modalState.user}
        ref={ref}
      />
      {children}
    </ModalInviteUserContext.Provider>
  )
}

export const ModalInviteUser = forwardRef<HTMLDialogElement, Props>(
  function ModalInviteUser({ scheduleId, user }, ref) {
    // TODO: add optimistic update for closing modal
    return (
      <dialog
        ref={ref}
        className="w-full max-w-md max-h-full bg-transparent z-20 top-0 bottom-0"
        // open={showModal}
      >
        <div className="bg-white rounded-lg shadow-lg dark:bg-gray-700">
          <header className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Invite User: {user?.firstName} {user?.lastName}
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
            action={(formAction) => {
              inviteUser(formAction)
              // @ts-ignore
              // if (ref && ref.current) ref.current.close()
            }}
          >
            <input type="hidden" name="scheduleId" value={scheduleId} />
            {user && <input type="hidden" name="userId" value={user.id} />}
            <div className="flex flex-col">
              <label className="text-md dark:text-white" htmlFor="email">
                User Email
              </label>
              <input
                type="email"
                // defaultValue={room.roomNr}
                className="rounded-md px-4 py-2 bg-inherit dark:bg-slate-500 dark:text-white border mb-6"
                name="email"
                required
              />
            </div>

            <button
              type="submit"
              className="border border-gray-700 dark:border-gray-300 bg-blue-400 hover:bg-blue-500 dark:text-white rounded px-4 py-2 text-black"
            >
              Invite User
            </button>

            {/* <Messages /> */}
          </form>
        </div>
      </dialog>
    )
  }
)
