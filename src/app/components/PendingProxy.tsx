import { useEffect } from "react"
import { useFormStatus } from "react-dom"

export const PendingProxy = ({
  setPendingState,
}: {
  setPendingState: (state: boolean) => void
}) => {
  const status = useFormStatus()

  useEffect(() => {
    setPendingState(status.pending)
    return () => setPendingState(false)
  }, [setPendingState, status.pending])
  return null
}
