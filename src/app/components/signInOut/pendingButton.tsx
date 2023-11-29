"use client"

import { Spinner } from "../spinner"
import { useFormStatus } from "react-dom"

type PendingProps = {
  loading?: React.ReactElement | string
  children: React.ReactNode
  [string: string]: any
}

export const PendingButton = (props: PendingProps) => {
  const { children, ...rest } = props
  const { pending } = useFormStatus()

  const pendingMotion = props.loading || <Spinner width="20" height="20" />

  return (
    <button disabled={pending} aria-disabled={pending} {...rest}>
      {pending ? pendingMotion : children}
    </button>
  )
}
