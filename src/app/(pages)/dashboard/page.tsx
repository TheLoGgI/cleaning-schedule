import {
  ModalDeleteScheduleButton,
  ModalDeleteScheduleContextProvider,
} from "./ModalDeleteDashboard"

import Link from "next/link"
import ModalCreateDashboard from "./ModalCreateDashboard"
import { db } from "@/lib/db"
import { schedule, user } from "@/lib/schema"
import { eq } from "drizzle-orm"

// Use a stable local-user ID — on first load we create the default user if not present
const LOCAL_USER_ID = "local-user"

async function getOrCreateLocalUser() {
  const existing = await db.query.user.findFirst({
    where: (u, { eq }) => eq(u.id, LOCAL_USER_ID),
  })
  if (existing) return existing

  const [created] = await db
    .insert(user)
    .values({ id: LOCAL_USER_ID, firstName: "Local", lastName: "User" })
    .returning()
  return created
}

export default async function Dashboard() {
  const localUser = await getOrCreateLocalUser()

  const schedules = await db
    .select()
    .from(schedule)
    .where(eq(schedule.createdBy, localUser.id))

  return (
    <section className="container max-w-screen-lg mx-auto">
      <div className="flex align-center justify-between p-4">
        <h1 className="text-2xl">Dashboard</h1>
        <ModalCreateDashboard createdBy={localUser.id} />
      </div>

      {Array.isArray(schedules) && schedules.length !== 0 ? (
        <div className="px-4 text-lg">
          <div className="flex justify-between border-b-2 border-gray-200">
            <div className="lg:grid gap-10 lg:grid-cols-4 p-4 pr-0 flex-grow">
              <p className="font-semibold col-span-2">Schedule Name</p>
              <p className="font-semibold hidden lg:block">Starting Week</p>
              <p className="font-semibold hidden lg:block">isActive</p>
            </div>
            <div className="invisible px-4">delete</div>
          </div>
          <ModalDeleteScheduleContextProvider>
            {schedules.map((s) => (
              <div
                key={s.name + s.id}
                className="flex justify-between items-center border-b-2 border-gray-200 hover:bg-gray-200"
              >
                <Link
                  href={`/schedule/${s.id}`}
                  className="lg:grid gap-10 lg:grid-cols-4 p-4 pr-0 flex-grow"
                >
                  <p className="col-span-2 capitalize">{s.name}</p>
                  <p className="hidden lg:block">{s.startingWeek}</p>
                  <p className="hidden lg:block">{String(s.isActive)}</p>
                </Link>
                <div className="p-4">
                  <ModalDeleteScheduleButton schedule={s as DashboardSchedule} />
                </div>
              </div>
            ))}
          </ModalDeleteScheduleContextProvider>
        </div>
      ) : (
        <div className="px-4 text-lg">
          <p className="text-center mt-10">
            You don&apos;t have any schedules yet. Create one to get started.
          </p>
        </div>
      )}
    </section>
  )
}
