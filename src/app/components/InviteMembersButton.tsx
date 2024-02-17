"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { EnvelopeIcon } from "@heroicons/react/24/outline"
import { Transition } from "@headlessui/react"
import { generateInviteCode } from "../server/quries/generateInviteCode"

type props = {
  scheduleId: string
}

export const InviteMembersButton = ({ scheduleId }: props) => {
  const [isShowing, setIsShowing] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setTimeout(() => {
      setIsShowing(false)
    }, 1000)
  }, [isShowing])

  return (
    <button
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 cursor-copy"
      type="button"
      onClick={async () => {
        const inviteCode = await generateInviteCode(scheduleId)
        if (inviteCode === null) return
        setIsShowing(true)
        const templateURL = `${window.location.origin}/signup?scheduleId=${scheduleId}&inviteCode=${inviteCode}`
        const inviteParam = new URLSearchParams(searchParams)
        inviteParam.set("inviteLink", templateURL)
        router.push(pathname + "?" + inviteParam.toString())

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
  )
}

export const InviteLink = () => {
  const searchParams = useSearchParams()

  const inviteLink = searchParams.get("inviteLink")
  console.log("inviteLink: ", inviteLink)

  return (
    <Transition
      show={inviteLink !== null}
      as="p"
      className="bg-gray-200 text-sm px-5 py-2 my-4 rounded-lg"
      enter="transition-opacity ease-linear duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity ease-linear duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <span className="font-bold select-none">Link: </span> {inviteLink}
    </Transition>
  )
}
