interface MapEmbedProps {
  lat: number
  lng: number
  title: string
  zoom?: number
  height?: string
}

export default function MapEmbed({
  lat,
  lng,
  title,
  zoom = 15,
  height = 'h-56',
}: MapEmbedProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY

  if (!apiKey) {
    return (
      <div className={`${height} flex items-center justify-center
                       rounded-xl border border-dashed border-gray-200 bg-gray-50`}>
        <p className="text-xs text-gray-400">Map unavailable</p>
      </div>
    )
  }

  const src = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=${zoom}`

  return (
    <div className={`${height} w-full overflow-hidden rounded-xl border border-gray-200`}>
      <iframe
        src={src}
        title={`Map showing location of ${title}`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}