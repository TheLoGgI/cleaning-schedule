"use client"

import { Spinner } from "../spinner"
import { useEffect } from "react"
import { useFormStatus } from "react-dom"

type PendingProps = {
  loading?: React.ReactElement | string
  children: React.ReactNode
  // onSubmit?: () => void
  [string: string]: any
}

export const PendingButton = (props: PendingProps) => {
  const { children, ...rest } = props
  const { pending, ...status } = useFormStatus()

  const pendingMotion = props.loading || <Spinner width="20" height="20" />

  return (
    <button
      disabled={props.disabled || pending}
      aria-disabled={props.disabled || pending}
      {...rest}
    >
      {pending ? pendingMotion : children}
    </button>
  )
}
