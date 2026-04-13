import {
  sqliteTable,
  text,
  integer,
} from "drizzle-orm/sqlite-core"
import { sql, relations } from "drizzle-orm"

// ---------------------------------------------------------------------------
// Role lookup table (static seed: 1=user, 2=moderator, 3=admin, 4=superadmin)
// ---------------------------------------------------------------------------
export const role = sqliteTable("Role", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  role: text("role").notNull().default("user"),
})

// ---------------------------------------------------------------------------
// Users – application user profiles (no auth, purely named entities)
// ---------------------------------------------------------------------------
export const user = sqliteTable("User", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  firstName: text("firstName").notNull(),
  lastName:  text("lastName"),
  email:     text("email"),
})

// ---------------------------------------------------------------------------
// Schedules
// ---------------------------------------------------------------------------
export const schedule = sqliteTable("Schedule", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  createdAt:    text("createdAt").notNull().default(sql`(datetime('now'))`),
  startingWeek: integer("startingWeek").notNull(),
  name:         text("name").notNull(),
  isActive:     integer("isActive", { mode: "boolean" }).notNull().default(false),
  createdBy:    text("createdBy").notNull(), // FK → User.id (no cascade on local app)
})

// ---------------------------------------------------------------------------
// Rooms – one row per person/room inside a schedule
// ---------------------------------------------------------------------------
export const room = sqliteTable("Room", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  createdAt:        text("createdAt").notNull().default(sql`(datetime('now'))`),
  scheduleID:       text("scheduleID").notNull().references(() => schedule.id, { onDelete: "cascade" }),
  activeInSchedule: integer("activeInSchedule", { mode: "boolean" }).notNull().default(false),
  roomNr:           integer("roomNr").notNull(),
  userId:           text("userId").references(() => user.id, { onDelete: "set null" }),
})

// ---------------------------------------------------------------------------
// ScheduleRows – weekly assignments (two rows per week)
// NOTE: SQLite does not support ON DELETE SET DEFAULT.
//       We use SET NULL here; app code must handle null rooms gracefully.
// ---------------------------------------------------------------------------
export const scheduleRow = sqliteTable("ScheduleRow", {
  id:         integer("id").primaryKey({ autoIncrement: true }),
  room:       text("room").references(() => room.id, { onDelete: "set null" }),
  scheduleId: text("scheduleId").notNull().references(() => schedule.id, { onDelete: "cascade" }),
  weekNr:     integer("weekNr").notNull().default(0),
  show:       integer("show", { mode: "boolean" }).default(true),
})


// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------
export type User        = typeof user.$inferSelect
export type NewUser     = typeof user.$inferInsert
export type Schedule    = typeof schedule.$inferSelect
export type NewSchedule = typeof schedule.$inferInsert
export type Room        = typeof room.$inferSelect
export type NewRoom     = typeof room.$inferInsert
export type ScheduleRow    = typeof scheduleRow.$inferSelect
export type NewScheduleRow = typeof scheduleRow.$inferInsert

// ---------------------------------------------------------------------------
// Relations (required for db.query relational API)
// ---------------------------------------------------------------------------
export const userRelations = relations(user, ({ many }) => ({
  rooms: many(room),
}))

export const scheduleRelations = relations(schedule, ({ many }) => ({
  rooms: many(room),
  scheduleRows: many(scheduleRow),
}))

export const roomRelations = relations(room, ({ one, many }) => ({
  user: one(user, { fields: [room.userId], references: [user.id] }),
  schedule: one(schedule, { fields: [room.scheduleID], references: [schedule.id] }),
  scheduleRows: many(scheduleRow),
}))

export const scheduleRowRelations = relations(scheduleRow, ({ one }) => ({
  scheduleRef: one(schedule, { fields: [scheduleRow.scheduleId], references: [schedule.id] }),
  roomRef: one(room, { fields: [scheduleRow.room], references: [room.id] }),
}))

