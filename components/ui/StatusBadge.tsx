import { Clock, CheckCircle, XCircle, Ban } from 'lucide-react'

type Status = 'pending' | 'approved' | 'rejected' | 'cancelled'

interface StatusBadgeProps {
  status: Status
  showIcon?: boolean
  size?: 'sm' | 'md'
}

const STATUS_CONFIG: Record<Status, {
  label: string
  icon: React.ReactNode
  className: string
}> = {
  pending: {
    label: 'Pending',
    icon: <Clock className="h-3 w-3" />,
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  },
  approved: {
    label: 'Approved',
    icon: <CheckCircle className="h-3 w-3" />,
    className: 'bg-green-50 text-green-700 border-green-200',
  },
  rejected: {
    label: 'Rejected',
    icon: <XCircle className="h-3 w-3" />,
    className: 'bg-red-50 text-red-700 border-red-200',
  },
  cancelled: {
    label: 'Cancelled',
    icon: <Ban className="h-3 w-3" />,
    className: 'bg-gray-100 text-gray-500 border-gray-200',
  },
}

export default function StatusBadge({
  status,
  showIcon = true,
  size = 'md',
}: StatusBadgeProps) {
  const config = STATUS_CONFIG[status]

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border font-semibold
      ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'}
      ${config.className}`}
    >
      {showIcon && config.icon}
      {config.label}
    </span>
  )
}