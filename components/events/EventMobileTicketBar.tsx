'use client'

interface Props {
  label: string
  onClick: () => void
}

export default function EventMobileTicketBar({ label, onClick }: Props) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white p-4
                 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] lg:hidden"
    >
      <button
        type="button"
        onClick={onClick}
        className="w-full rounded-lg bg-[#C9973A] py-3.5 text-base font-bold text-white
                   transition active:scale-[0.99] hover:bg-[#b8852e]"
      >
        {label}
      </button>
    </div>
  )
}
