"use client"

export const PrintButton = () => {
  return (
    <button
      type="button"
      title="Print"
      className="flex justify-center items-center w-[52px] h-[52px] text-blue-600 hover:text-blue-800 bg-white rounded-lg border border-gray-200 shadow-sm focus:ring-4 focus:ring-gray-300 focus:outline-none hover:ring-2 hover:ring-blue-700"
      onClick={() => window.print()}
    >
      <svg
        className="w-5 h-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M5 20h10a1 1 0 0 0 1-1v-5H4v5a1 1 0 0 0 1 1Z" />
        <path d="M18 7H2a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2v-3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Zm-1-2V2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3h14Z" />
      </svg>
      <span className="sr-only">Print</span>
    </button>
  )
}
