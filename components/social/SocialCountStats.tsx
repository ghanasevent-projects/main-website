export default function SocialCountStats({
  followers,
  following,
  className = '',
}: {
  followers: number
  following: number
  className?: string
}) {
  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-gray-600 ${className}`}>
      <span>
        <span className="font-bold text-gray-900">{followers}</span> Followers
      </span>
      <span>
        <span className="font-bold text-gray-900">{following}</span> Following
      </span>
    </div>
  )
}
