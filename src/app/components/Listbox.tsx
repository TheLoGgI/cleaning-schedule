"use client"

import { Fragment, forwardRef, useState } from "react"

import { Listbox } from "@headlessui/react"
import { LockClosedIcon } from "@heroicons/react/24/outline"
import { twMerge } from "tailwind-merge"

type ListSelectProps = {
  options: {
    id: string
    name: string
    activeInSchedule: boolean
    value: string
  }[]
  label: string
  name: string
  defaultValue?: string | number
  className?: string
  isDisabled?: boolean
  // validationOptions: RegisterOptions<FieldValues, string>,
  // renderOptionContent: (data) => ReactNode;
}

export const ListBox = forwardRef<HTMLButtonElement, ListSelectProps>(
  function ListBox(
    {
      options,
      label,
      name,
      //   defaultValue,
      isDisabled = false,
      // validationOptions,
      className,
    }: ListSelectProps,
    ref
  ) {
    const [selected, setSelected] = useState(options[0])
    console.log("options: ", options)

    return (
      <Listbox
        className={className ? className : "flex flex-col"}
        value={selected?.id}
        // defaultValue={startValue?.id}
        disabled={isDisabled}
        onChange={(value) => {
          console.log("value: ", value)
          setSelected(value as unknown as typeof selected)
        }}
        name={name}
        id={name}
        as="div"
      >
        <label className="text-md">
          {label}
          {isDisabled && (
            <span className="mx-4 inline-block">
              <LockClosedIcon width="20" />
            </span>
          )}
        </label>
        <Listbox.Button
          //   disabled={isDisabled}
          type="button"
          ref={ref}
          className={twMerge(
            "w-full rounded-lg border-2 border-solid border-gray-200 bg-white p-2 text-left",
            isDisabled && "bg-gray-200"
          )}
        >
          {selected?.name}
        </Listbox.Button>

        <Listbox.Options className="mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {options.map((option) => (
            <Listbox.Option
              key={option.id}
              value={option}
              as={Fragment}
              disabled={!option.activeInSchedule}
            >
              {({ active, disabled }) => (
                <li
                  className={`cursor-pointer p-2  ${
                    disabled
                      ? "bg-white text-gray-400"
                      : active
                      ? "bg-blue-400 text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {option.name}
                </li>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    )
  }
)
