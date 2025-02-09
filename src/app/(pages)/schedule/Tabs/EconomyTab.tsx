import {
  InviteLink,
  InviteMembersButton,
} from "@/app/components/InviteMembersButton"
import {
  InviteModalButton,
  ModalInviteUserContextProvider,
} from "../ModalInviteUser"

import { TabPanel } from "@/app/components/Tab"

const EconomyTab = ({
  users,
  scheduleId,
}: {
  users: User[]
  scheduleId: string
}) => {

  const revenue = users.length * 40

  return (
    <TabPanel>
      <div className="my-10">
        <div className="flex justify-between items-center">
          <p>Total Revenue: {revenue} DKK</p>
        </div>
        <InviteLink />
      </div>

      <table>
        <thead>
          <tr>
            <th>Revenue</th>
            <th>Balance</th>
          </tr>
        </thead>

        <tbody>
          <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700 text-gray">
            <td className="px-6 py-4">{revenue} DKK</td>
          </tr>
        </tbody>
      </table>
    </TabPanel>
  )
}

export default EconomyTab
