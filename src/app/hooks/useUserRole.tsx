import { createContext, useContext } from "react"

import { Role } from "../components/EnumRole"

const UserRoleContext = createContext<Role>(Role.User)

export const useUserRole = () => {
  return useContext(UserRoleContext)
}

export const UserRoleProvider = ({
  role,
  children,
}: {
  role: Role
  children: JSX.Element
}) => {
  return (
    <UserRoleContext.Provider value={role}>{children}</UserRoleContext.Provider>
  )
}
