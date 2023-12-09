"use client"

import ModalInsertScheduleRow from "../ModalInsertScheduleRow"
import { PendingButton } from "@/app/components/signInOut/pendingButton"
import { PrintButton } from "@/app/components/PrintButton"
import { Role } from "@/app/components/EnumRole"
import { ScheduleTable } from "./scheduleTable"
import { TabPanel } from "@/app/components/Tab"
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
            <form action={generateSchedule}>
              <input type="hidden" name="scheduleId" value={scheduleId} />
              <input type="hidden" name="startingWeek" value={startingWeek} />
              <PendingButton
                type="submit"
                disabled={rooms.length === 0}
                title={
                  rooms.length === 0 &&
                  "You need at least one room to generate a schedule"
                }
                className="border-2 border-blue-700 hover:bg-blue-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:border-none disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Generate Schedule
              </PendingButton>
            </form>
          </div>
        )}
        <PrintButton />
      </div>

      {rooms.length > 0 && { children }}
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
