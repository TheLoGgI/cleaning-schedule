"use client"

import { createContext, use, useEffect, useState } from "react"

import { Tab } from "@headlessui/react"
import { twMerge } from "tailwind-merge"

type TabType = "Members" | "Rooms" | "Schedule"
type Props = {
  children: React.ReactNode
}

const DEFAULT_SELECTED_TAB = 1

export const ScheduleIdContext = createContext<string | null>(null)

const TabsList = ["Members", "Rooms", "Schedule"]
const TabNav = ({ children }: Props) => {
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
  }, [])

  return (
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
  )
}

export default TabNav
