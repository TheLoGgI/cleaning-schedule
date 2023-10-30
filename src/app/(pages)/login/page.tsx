import Link from 'next/link'
import Messages from './messages'

export default function Login() {
  return (
    <div className="flex items-center justify-center">
      <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mt-[20%]">
        <h1 className="text-2xl font-medium">Sign in with your account</h1>
        <form
          className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
          action="/auth/sign-in"
          method="post"
        >
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="email"
            placeholder="you@example.com"
            required
          />
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <button type="submit" className="bg-green-700 rounded px-4 py-2 text-white mb-2">
            Sign In
          </button>
          <Link
            href="/signup"
            className="border text-center border-gray-700 rounded px-4 py-2 text-black mb-2"
          >
            Sign Up
          </Link>
          <Messages />
        </form>
      </div>
    </div>
  )
}
