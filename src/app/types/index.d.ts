type User = {
  id: string
  firstName: string
  lastName: string
  email: string
}

// type AuthUser = {
//   id: string
//   aud: 'authenticated' | unknown
//   role: 'authenticated' | unknown
//   email: string
//   email_confirmed_at: string
//   phone: string
//   confirmation_sent_at: string
//   confirmed_at: string
//   recovery_sent_at: string
//   last_sign_in_at: string
//   app_metadata: unknown
//   user_metadata: unknown
//   identities: [Array]
//   created_at: string
//   updated_at: string
// }

// type CustomUser = {
//   id: string
//   firstName: string
//   lastName: string
//   email: string
// }

type Schedule = {
  id: string
  createdAt: string
  startingWeek: number
  name: string
  isActive: boolean
  createdBy: string
}

// type Room = {
//   activeInSchedule: boolean
//   roomNr: number
//   userId: string
//   User: CustomUser
// }

type Room = {
  id: string
  activeInSchedule: boolean
  roomNr: number
  userId: string
  User: CustomUser
}
