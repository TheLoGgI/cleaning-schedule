"use client"

import {
  ArrowPathIcon,
  ChevronDownIcon,
  PlusIcon,
} from "@heroicons/react/24/outline"
import { Popover, Transition } from "@headlessui/react"

import { Fragment } from "react"
import ModalInsertScheduleRow from "../ModalInsertScheduleRow"
import { PendingButton } from "@/app/components/signInOut/pendingButton"
import { PrintButton } from "@/app/components/PrintButton"
import { Role } from "@/app/components/EnumRole"
import { TabPanel } from "@/app/components/Tab"
import { generateNextWeekSchedule } from "@/app/server/actions/generateNextWeeksSchedule"
import { generateSchedule } from "../../../server/actions/generateSchedule"
import { useUserRole } from "@/app/hooks/useUserRole"

const ScheduleTab = ({
  rooms,
  scheduleId,
  startingWeek,
  children,
}: {
  rooms: Room[]
  scheduleId: string
  startingWeek: number
  children: React.ReactNode
}) => {
  const userRole = useUserRole()
  const isAdminOrModerator =
    userRole === Role.Admin || userRole === Role.Moderator

  return (
    <TabPanel>
      <div className="flex justify-between items-center print:hidden">
        {isAdminOrModerator && (
          <div className="flex gap-4 my-10">
            <ModalInsertScheduleRow
              weekNr={startingWeek}
              rooms={rooms}
              scheduleId={scheduleId}
            />
            <Popover className="relative">
              {({ open }) => (
                <>
                  <Popover.Button as="div">
                    <PendingButton
                      type="submit"
                      disabled={rooms.length === 0}
                      title={
                        rooms.length === 0 &&
                        "You need at least one room to generate a schedule"
                      }
                      className={`
                              ${open ? "text-gray-800" : "text-gray-600"}
                              group inline-flex rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}
                    >
                      Generate
                      <ChevronDownIcon
                        className={`${open ? "text-gray-300" : "text-white"}
                  ml-2 h-5 w-5 transition duration-150 ease-in-out group-hover:text-white`}
                        aria-hidden="true"
                      />
                    </PendingButton>
                  </Popover.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                  >
                    <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-80 -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
                      <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                        <div className="relative bg-white p-5 space-y-4">
                          <form action={generateSchedule} className="-m-3">
                            <input
                              type="hidden"
                              name="scheduleId"
                              value={scheduleId}
                            />
                            <input
                              type="hidden"
                              name="startingWeek"
                              value={startingWeek}
                            />
                            <button
                              type="submit"
                              disabled={rooms.length === 0}
                              title={
                                rooms.length === 0
                                  ? "You need at least one room to generate a schedule"
                                  : undefined
                              }
                              className="group w-full flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50"
                            >
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white bg-indigo-300 group-hover:bg-indigo-600 p-2 rounded-md sm:h-12 sm:w-12">
                                <ArrowPathIcon width={16} height={16} />
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900">
                                  Generate new Schedule
                                </p>
                              </div>
                            </button>
                          </form>
                          <form
                            action={generateNextWeekSchedule}
                            className="-m-3"
                          >
                            <input
                              type="hidden"
                              name="scheduleId"
                              value={scheduleId}
                            />
                            <input
                              type="hidden"
                              name="startingWeek"
                              value={startingWeek}
                            />
                            <button
                              type="submit"
                              disabled={rooms.length === 0}
                              title={
                                rooms.length === 0
                                  ? "You need at least one room to generate a schedule"
                                  : undefined
                              }
                              className="group w-full flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50"
                            >
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center text-white bg-indigo-300 group-hover:bg-indigo-600 p-2 rounded-md sm:h-12 sm:w-12">
                                <PlusIcon width={16} height={16} />
                              </div>
                              <div className="ml-4">
                                <p className="text-sm font-medium text-gray-900">
                                  Add next week
                                </p>
                              </div>
                            </button>
                          </form>
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          </div>
        )}
        <PrintButton />
      </div>

      {rooms.length > 0 && children}
      {rooms.length === 0 && (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <p className="text-2xl font-semibold">No Rooms</p>
          <p className="text-gray-500 max-w-sm text-center">
            Invite members to your schedule in the members tab or add rooms to
            start planning
          </p>
        </div>
      )}
    </TabPanel>
  )
}

export default ScheduleTab

// <PendingButton
//                               type="submit"
//                               disabled={rooms.length === 0}
//                               title={
//                                 rooms.length === 0 &&
//                                 "You need at least one room to generate a schedule"
//                               }
//                               className="border-2 border-blue-700 hover:bg-blue-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:border-none disabled:bg-gray-400 disabled:cursor-not-allowed"
//                             >
//                               Generate Schedule
//                             </PendingButton>

{
  /*  */
}
