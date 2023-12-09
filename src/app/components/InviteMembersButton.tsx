"use client"

import { useEffect, useState } from "react"

import { EnvelopeIcon } from "@heroicons/react/24/outline"
import { generateInviteCode } from "../server/quries/genereateInviteCode"

type props = {
  scheduleId: string
}

export const InviteMembersButton = ({ scheduleId }: props) => {
  const [isShowing, setIsShowing] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsShowing(false)
    }, 1000)
  }, [isShowing])

  return (
    <>
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-copy"
        type="button"
        onClick={async () => {
          setIsShowing(true)
          const inviteCode = await generateInviteCode(scheduleId)
          if (inviteCode === null) return
          const templateURL = `${window.location.origin}/signup?scheduleId=${scheduleId}&inviteCode=${inviteCode}`
          navigator.clipboard.writeText(templateURL)
        }}
      >
        {isShowing ? (
          <span>Copied to clipboard!</span>
        ) : (
          <span className="flex gap-2">
            <EnvelopeIcon className="w-5 h-5 " /> Invite Members
          </span>
        )}
      </button>
    </>
  )
}
