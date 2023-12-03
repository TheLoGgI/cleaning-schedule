export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      InviteKey: {
        Row: {
          created_at: string
          id: number
          key: string
          scheduleId: string
        }
        Insert: {
          created_at?: string
          id?: number
          key: string
          scheduleId: string
        }
        Update: {
          created_at?: string
          id?: number
          key?: string
          scheduleId?: string
        }
        Relationships: [
          {
            foreignKeyName: "InviteKey_scheduleId_fkey"
            columns: ["scheduleId"]
            isOneToOne: false
            referencedRelation: "Schedule"
            referencedColumns: ["id"]
          }
        ]
      }
      Role: {
        Row: {
          id: number
          role: string
        }
        Insert: {
          id?: number
          role?: string
        }
        Update: {
          id?: number
          role?: string
        }
        Relationships: []
      }
      Room: {
        Row: {
          activeInSchedule: boolean
          createdAt: string
          id: string
          roomNr: number
          scheduleID: string
          userId: string
        }
        Insert: {
          activeInSchedule?: boolean
          createdAt?: string
          id?: string
          roomNr: number
          scheduleID: string
          userId: string
        }
        Update: {
          activeInSchedule?: boolean
          createdAt?: string
          id?: string
          roomNr?: number
          scheduleID?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Room_scheduleID_fkey"
            columns: ["scheduleID"]
            isOneToOne: false
            referencedRelation: "Schedule"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Room_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      Schedule: {
        Row: {
          createdAt: string
          createdBy: string
          id: string
          isActive: boolean
          name: string
          startingWeek: number
        }
        Insert: {
          createdAt?: string
          createdBy: string
          id?: string
          isActive?: boolean
          name: string
          startingWeek: number
        }
        Update: {
          createdAt?: string
          createdBy?: string
          id?: string
          isActive?: boolean
          name?: string
          startingWeek?: number
        }
        Relationships: []
      }
      ScheduleRole: {
        Row: {
          authId: string
          id: string
          role: number
          scheduleId: string
          userId: string
        }
        Insert: {
          authId: string
          id?: string
          role: number
          scheduleId: string
          userId: string
        }
        Update: {
          authId?: string
          id?: string
          role?: number
          scheduleId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "ScheduleRole_role_fkey"
            columns: ["role"]
            isOneToOne: false
            referencedRelation: "Role"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ScheduleRole_scheduleId_fkey"
            columns: ["scheduleId"]
            isOneToOne: false
            referencedRelation: "Schedule"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ScheduleRole_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          }
        ]
      }
      ScheduleRow: {
        Row: {
          id: number
          room: string | null
          scheduleId: string
          weekNr: number
        }
        Insert: {
          id?: number
          room?: string | null
          scheduleId: string
          weekNr?: number
        }
        Update: {
          id?: number
          room?: string | null
          scheduleId?: string
          weekNr?: number
        }
        Relationships: [
          {
            foreignKeyName: "ScheduleRow_room_fkey"
            columns: ["room"]
            isOneToOne: false
            referencedRelation: "Room"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ScheduleRow_scheduleId_fkey"
            columns: ["scheduleId"]
            isOneToOne: false
            referencedRelation: "Schedule"
            referencedColumns: ["id"]
          }
        ]
      }
      User: {
        Row: {
          authId: string | null
          email: string | null
          firstName: string
          id: string
          lastName: string | null
          premium: boolean
        }
        Insert: {
          authId?: string | null
          email?: string | null
          firstName: string
          id: string
          lastName?: string | null
          premium?: boolean
        }
        Update: {
          authId?: string | null
          email?: string | null
          firstName?: string
          id?: string
          lastName?: string | null
          premium?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "User_authId_fkey"
            columns: ["authId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
