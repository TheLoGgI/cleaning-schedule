"use client"

import { useEffect, useMemo, useState } from "react"

import { Role } from "@/app/components/EnumRole"
import { Tab } from "@headlessui/react"
import { UserRoleProvider } from "@/app/hooks/useUserRole"
import { twMerge } from "tailwind-merge"

type TabType = "Members" | "Rooms" | "Schedule" /*  | "Economy" */
type Props = {
  userRole: Role
  children: React.ReactNode
}

const DEFAULT_SELECTED_TAB = 1

// export const ScheduleIdContext = createContext<string | null>(null)

const TabNav = ({ children, userRole }: Props) => {
  const isAdminOrModerator =
    userRole === Role.Admin || userRole === Role.Moderator
  const TabsList = useMemo(
    () =>
      isAdminOrModerator
        ? ["Members", "Rooms", "Schedule" /* , "Economy" */]
        : ["Rooms", "Schedule"],
    [isAdminOrModerator]
  )
  const [indexOfHash, setIndexHash] = useState<number>(DEFAULT_SELECTED_TAB)

  useEffect(() => {
    if (location.hash === "") {
      location.hash = TabsList[DEFAULT_SELECTED_TAB]
    }

    const lastSelectedTab = TabsList.indexOf(
      window.location.hash.replace("#", "") as TabType
    )

    setIndexHash(
      lastSelectedTab === -1 ? DEFAULT_SELECTED_TAB : lastSelectedTab
    )
  }, [TabsList])

  return (
    <UserRoleProvider role={userRole}>
      <Tab.Group
        selectedIndex={indexOfHash}
        onChange={(index) => setIndexHash(index)}
      >
        <div className="flex justify-end items-center print:hidden">
          <Tab.List
            as="ul"
            className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400"
          >
            {TabsList.map((tab) => (
              <li className="mr-2" key={tab}>
                <Tab
                  as="a"
                  href={`#${tab}`}
                  aria-current="page"
                  className={({ selected }) => {
                    return twMerge(
                      "inline-block p-4 bg-gray-100 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500",
                      selected && "text-blue-600"
                    )
                  }}
                >
                  {tab}
                </Tab>
              </li>
            ))}
          </Tab.List>
        </div>
        {children}
      </Tab.Group>
    </UserRoleProvider>
  )
}

export default TabNav
