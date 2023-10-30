export default function LogoutButton() {
  // const supabase = useSupabaseClient()

  // const handleLogout = async () => {
  //   console.log('handleLogout: ')

  //   const { error } = await supabase?.auth.signOut()
  //   console.log('error: ', error)
  //   // redirect('/login', RedirectType.replace)
  // }

  return (
    <form action="/auth/sign-out" method="post">
      <button
        // onClick={handleLogout}
        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
      >
        Logout
      </button>
    </form>
  )
}
