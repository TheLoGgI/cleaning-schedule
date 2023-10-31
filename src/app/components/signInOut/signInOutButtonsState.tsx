"use client"

import { Spinner } from "../spinner"
import { useFormStatus } from "react-dom"

export const PendingButton = (props: any) => {
  const { children, ...rest } = props
  const { pending } = useFormStatus()
  console.log("pending: ", pending)

  return (
    <button disabled={pending} aria-disabled={pending} {...rest}>
      {pending ? <Spinner /> : children}
    </button>
  )
}
