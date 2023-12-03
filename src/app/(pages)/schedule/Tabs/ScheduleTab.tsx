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
                className="border-2 border-blue-700 hover:bg-blue-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Generate Schedule
              </PendingButton>
            </form>
          </div>
        )}
        <PrintButton />
      </div>

      {children}
    </TabPanel>
  )
}

export default ScheduleTab
