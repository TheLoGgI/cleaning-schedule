export default function LogoutButton() {
  return (
    <form action="/auth/sign-out" method="post">
      <button className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
        Logout
      </button>
    </form>
  )
}
