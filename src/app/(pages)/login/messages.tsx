"use client"

export default function Messages({
  state,
}: {
  state: { error?: string; message?: string }
}) {
  return (
    <>
      {state.error && (
        <p className="mt-4 p-4 bg-neutral-900 text-neutral-300 text-center">
          {state.error}
        </p>
      )}
      {state.message && (
        <p className="font-semibold mt-4 p-4 bg-neutral-900 text-neutral-300 text-center">
          {state.message}
        </p>
      )}
    </>
  )
}
