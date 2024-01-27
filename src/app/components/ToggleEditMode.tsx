"use client"

import { twMerge } from "tailwind-merge"
import { useStore } from "../hooks/useStore"


export const ToggleEditModeButton = () => {

  const {editMode, toggleEditMode} = useStore()
 
  return <button
  className={twMerge("inline-flex items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800")}
  type="button"
  onClick={toggleEditMode}
>
  {editMode ? "Toggle OFF Swap" : "Toggle ON Swap" }
</button>
}
