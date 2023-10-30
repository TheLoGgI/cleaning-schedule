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
        className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
      >
        Logout
      </button>
    </form>
  )
}
