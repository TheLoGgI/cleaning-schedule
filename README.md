This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Supabase setup



## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Local Development

- Install Docker on your system, run the deamon.
- Set Env variables, look at .env.local file for need props.
- Run `Supabase start` to install supabase database in docker
- Run `supabase db reset` to reset local database with the migration file and seed.sql.


### To Stop running Docker Supabase
You can use the `supabase stop` command at any time to stop all services (without resetting your local database). Use `supabase stop --no-backup` to stop all services and reset your local database.
