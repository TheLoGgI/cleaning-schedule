import {
  InviteLink,
  InviteMembersButton,
} from "@/app/components/InviteMembersButton"
import {
  InviteModalButton,
  ModalInviteUserContextProvider,
} from "../ModalInviteUser"

import { TabPanel } from "@/app/components/Tab"

const MembersTab = ({
  users,
  scheduleId,
}: {
  users: User[]
  scheduleId: string
}) => {
  return (
    <TabPanel>
      <div className="my-10">
        <div className="flex justify-between items-center">
          <InviteMembersButton scheduleId={scheduleId} />
          <p>{users.length} Members</p>
        </div>
        <InviteLink />
      </div>

      {users.length > 0 && (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <ModalInviteUserContextProvider>
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-2 lg:px-6 py-3">
                    Member Name
                  </th>
                  <th scope="col" className="px-2 lg:px-6 py-3 max-w-[150px]">
                    Email
                  </th>
                  <th scope="col" className="px-2 lg:px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {users?.map((user: any, index) => {
                  return (
                    <tr
                      key={index}
                      className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                    >
                      <td className="px-2 lg:px-6 py-4 text-black">
                        {user === null
                          ? "Empty"
                          : `${user.firstName} ${user.lastName}`}
                      </td>
                      <td className="px-2 lg:px-6 py-4 truncate max-w-[150px] text-black">
                        {user?.email ?? "No Email"}
                      </td>
                      <td className="px-2 lg:px-6 py-4">
                        <InviteModalButton
                          user={user}
                          scheduleId={scheduleId}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </ModalInviteUserContextProvider>
        </div>
      )}

      {users.length === 0 && (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <p className="text-2xl font-semibold">No Members</p>
          <p className="text-gray-500">
            Invite members to your schedule or create rooms to start planning
          </p>
        </div>
      )}
    </TabPanel>
  )
}

export default MembersTab
