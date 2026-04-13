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

type Props = {
  scheduleId: string
  user: User | null
}

const ModalInviteUserContext = createContext<{
  ref: null | RefObject<HTMLDialogElement | null>
  setModalState: Dispatch<SetStateAction<Props>>
}>({
  ref: null,
  setModalState: () => null,
})


export const ModalInviteUserContextProvider = ({ children }: any) => {
  const ref = useRef<HTMLDialogElement>(null)
  const [modalState, setModalState] = useState<Props>({
    scheduleId: "",
    user: null,
  })

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
    const [inviteCode, setInviteCode] = useState<string | null>(null)

    return (
      <dialog
        ref={ref}
        className="w-full max-w-md max-h-full bg-transparent z-20 top-0 bottom-0"
      >
        <div className="bg-white rounded-lg shadow-lg dark:bg-gray-700">
          <header className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Invite to Schedule
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
          <div className="flex-1 flex flex-col w-full px-10 py-4 pb-6 gap-4">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Share the invite code below with the person you want to add.
              They can enter this code when creating their user account.
            </p>
            {inviteCode ? (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium dark:text-white">
                  Invite Code
                </label>
                <code className="block bg-gray-100 dark:bg-gray-800 rounded px-4 py-2 text-lg font-mono tracking-widest text-center">
                  {inviteCode}
                </code>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => navigator.clipboard.writeText(inviteCode)}
                >
                  Copy to clipboard
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="border border-gray-700 dark:border-gray-300 bg-blue-400 hover:bg-blue-500 dark:text-white rounded px-4 py-2 text-black"
                onClick={async () => {
                  const res = await fetch(
                    `/api/invite-code?scheduleId=${scheduleId}`
                  )
                  const data = await res.json()
                  if (data.code) setInviteCode(data.code)
                }}
              >
                Generate Invite Code
              </button>
            )}
          </div>
        </div>
      </dialog>
    )
  }
)


