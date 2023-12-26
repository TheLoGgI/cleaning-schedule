"use client"

import { createContext, useContext } from "react"

import { User } from "@supabase/supabase-js"

const UserContext = createContext<User | null>(null)

export const useUser = () => {
  return useContext(UserContext)
}

export const UserContextProvider = ({
  user,
  children,
}: {
  user: User | null
  children: JSX.Element
}) => {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}
