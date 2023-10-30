// import CleaningLogo from './CleaningLogo'

import CleaningLogo from "./CleaningLogo"
import Link from "next/link"
import LogoutButton from "./LogoutButton"

const Header = async ({ user }: { user: any }) => {
  return (
    <header className="relative z-50 shadow-sm">
      <div className="flex justify-center border-b border-b-foreground/10 h-16">
        <div className="container max-w-screen-lg flex justify-between items-center p-4 text-sm text-foreground">
          <Link href="/">
            <CleaningLogo className="p-2" title="Cleaning Schedule" />
          </Link>
          <div>
            {user !== null ? (
              <div className="flex items-center gap-4">
                Hey, {user.email}! <LogoutButton />
              </div>
            ) : (
              <Link
                href="/login"
                className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
      {user !== null && (
        <nav className="container max-w-screen-lg mx-auto py-2">
          <a
            href="/dashboard"
            className="inline-block py-2 px-4 rounded-md no-underline border  border-btn-background hover:bg-btn-background-hover"
          >
            Dashboard
          </a>
        </nav>
      )}

      {/* <div className="w-full flex justify-center">
        <div className="w-full max-w-4xl">
          <Link
            href="/"
            className="py-2 px-4 mt-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover inline-flex items-center group text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back
          </Link>
        </div>
      </div> */}
    </header>
  )
}

export default Header
