

export async function register() {

  // Run database migrations on startup so the SQLite schema is always up to date.
  // This means users never need to run db:push manually.
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { migrate } = await import('drizzle-orm/better-sqlite3/migrator')
    const { db } = await import('@/lib/db')
    const path = await import('path')
    migrate(db, { migrationsFolder: process.env.DRIZZLE_FOLDER ?? path.join(process.cwd(), 'drizzle') })
  }
}
