import {
  InviteModalButton,
  ModalInviteUserContextProvider,
} from "../ModalInviteUser"

import { InviteMembersButton } from "@/app/components/InviteMembersButton"
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
      <div className="flex justify-between items-center my-10">
        <InviteMembersButton scheduleId={scheduleId} />
        <p>{users.length} Members</p>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <ModalInviteUserContextProvider>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Member Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
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
                    <td className="px-6 py-4">
                      {user === null
                        ? "Empty"
                        : `${user.firstName} ${user.lastName}`}
                    </td>
                    <td className="px-6 py-4">{user?.email ?? "No Email"}</td>
                    <td className="px-6 py-4">
                      <InviteModalButton user={user} scheduleId={scheduleId} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </ModalInviteUserContextProvider>
      </div>
    </TabPanel>
  )
}

export default MembersTab
