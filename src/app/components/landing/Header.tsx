"use client"

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"

import CleaningLogo from "../CleaningLogo"
import { Dialog } from "@headlessui/react"
import Link from "next/link"
import LogoutButton from "../LogoutButton"
import { twMerge } from "tailwind-merge"
import { usePathname } from "next/navigation"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  //   { name: "Features", href: "#" },
  //   { name: "Marketplace", href: "#" },
  //   { name: "Company", href: "#" },
]

export default function Header({ user }: { user: any }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathName = usePathname()
  const isLandingPage = pathName === "/"

  return (
    <header
      className={twMerge(
        "inset-x-0 top-0 z-50 print:hidden",
        isLandingPage && "absolute"
      )}
    >
      <nav
        className="flex items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-auto">
          <Link href="/" className="flex gap-2 items-center">
            <span className="sr-only">Cleaning Schedule Logo</span>
            <CleaningLogo className="h-8 w-auto" title="Cleaning Schedule" />
            <p className="text-xl font-sans">Cleaning Schedule</p>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        {user !== null && (
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                {item.name}
              </a>
            ))}
          </div>
        )}
        {user !== null ? (
          <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center lg:gap-6">
            Hey, {user.email}! <LogoutButton />
          </div>
        ) : (
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Link
              href="/login"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Log in <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        )}
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-50" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex gap-2 items-center">
              <span className="sr-only">Cleaning Schedule Logo</span>
              <CleaningLogo className="h-8 w-auto" title="Cleaning Schedule" />
              <p className="text-xl font-sans">Cleaning Schedule</p>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {user !== null &&
                  navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
              </div>
              {user !== null ? (
                <div className="flex items-center gap-4">
                  Hey, {user.email}! <LogoutButton />
                </div>
              ) : (
                <div className="py-6">
                  <Link
                    href="/login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}
