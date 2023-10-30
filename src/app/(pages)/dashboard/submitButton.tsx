"use client"

// import { experimental_useFormStatus as useFormStatus } from 'react-dom'

const SubmitButton = () => {
  // const { pending, ...status } = useFormStatus()

  return (
    <button
      type="submit"
      className="border border-gray-700 dark:border-gray-300 bg-blue-400 hover:bg-blue-500 dark:text-white rounded px-4 py-2 text-black disabled:opacity-70"
      // aria-disabled={pending}
      // disabled={pending}
    >
      Create Schedule
      {/* {pending ? 'Pending..' : 'Create Schedule'} */}
    </button>
  )
}

export default SubmitButton
