import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import HorizontalScrollRow from '@/components/ui/HorizontalScrollRow'
import DestinationCard from '@/components/home/DestinationCard'
import HotelCard, { type HotelListing } from '@/components/hotels/HotelCard'
import {
  TOP_CITY_DESTINATIONS,
  cityEventsHref,
  touristAreaBrowseHref,
} from '@/lib/home-destinations'
import type { TouristAreaListing } from '@/lib/tourist-area-meta'
import { touristAreaLocation, buildAreaSlug } from '@/lib/tourist-area-meta'

interface HomeDestinationsProps {
  touristAreas: TouristAreaListing[]
  hotels: HotelListing[]
}

export default function HomeDestinations({ touristAreas, hotels }: HomeDestinationsProps) {
  return (
    <>
      {/* Top destinations in Ghana */}
      <section className="border-b border-gray-100 bg-white px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between sm:mb-10">
            <div>
              <p className="mb-1.5 text-xs font-bold uppercase tracking-widest text-gold">
                Explore Ghana
              </p>
              <h2
                className="text-2xl font-extrabold text-gray-900 sm:text-3xl"
                style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
              >
                Top destinations
              </h2>
              <p className="mt-1.5 text-sm text-gray-500">
                Find events happening in Ghana's most vibrant cities
              </p>
            </div>
            <Link
              href="/events"
              className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-gold
                         hover:underline underline-offset-2 sm:flex"
            >
              Browse all events <ChevronRight size={14} />
            </Link>
          </div>

          <HorizontalScrollRow
            hideArrowsFrom="md"
            wrapperClassName="-mx-2 px-2 md:mx-0 md:px-0"
            className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible lg:grid-cols-4"
          >
            {TOP_CITY_DESTINATIONS.map(dest => (
              <div key={`${dest.city}-${dest.region}`} className="w-[48vw] shrink-0 md:w-auto">
                <DestinationCard
                  href={cityEventsHref(dest.city, dest.region)}
                  label={dest.city}
                  imageUrl={dest.imageUrl}
                  subtitle={dest.region}
                />
              </div>
            ))}
          </HorizontalScrollRow>
        </div>
      </section>

      {/* Nearby hotels in active event locations */}
      <section className="border-b border-gray-100 bg-[#fdfbf7] px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-end justify-between sm:mb-8">
            <div>
              <h2
                className="text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl"
                style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
              >
                Hotels in event locations
              </h2>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Stay close to where events are happening now
              </p>
            </div>
            <Link
              href="/hotels"
              className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-gold
                         hover:underline underline-offset-2 sm:flex"
            >
              View all hotels <ChevronRight size={14} />
            </Link>
          </div>

          {hotels.length > 0 ? (
            <HorizontalScrollRow
              hideArrowsFrom="md"
              edgeFadeClass="from-[#fdfbf7]"
              wrapperClassName="-mx-2 px-2 md:mx-0 md:px-0"
              className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible
                         lg:grid-cols-3 xl:grid-cols-4 lg:gap-5"
            >
              {hotels.map(hotel => (
                <div key={hotel.id} className="w-[70vw] shrink-0 md:w-auto">
                  <HotelCard hotel={hotel} variant="home" />
                </div>
              ))}
            </HorizontalScrollRow>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-500 sm:p-6">
              No hotels found in current event locations.
              {' '}
              <Link href="/hotels" className="font-semibold text-gold hover:underline">
                Explore all hotels
              </Link>
            </div>
          )}

          <div className="mt-6 flex justify-center sm:hidden">
            <Link
              href="/hotels"
              className="flex items-center gap-1 text-sm font-semibold text-gold hover:underline"
            >
              View all hotels <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Popular tourist destinations */}
      <section className="border-b border-gray-100 bg-white px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex items-end justify-between sm:mb-8">
            <div>
              <h2
                className="text-xl font-bold text-gray-900 sm:text-2xl md:text-3xl"
                style={{ fontFamily: 'var(--font-syne, sans-serif)' }}
              >
                Popular tourist destinations
              </h2>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                Attractions from places where people are attending events
              </p>
            </div>
            <Link
              href="/tourist-areas"
              className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-gold
                         hover:underline underline-offset-2 sm:flex"
            >
              See all attractions <ChevronRight size={14} />
            </Link>
          </div>

          {touristAreas.length > 0 ? (
            <HorizontalScrollRow
              hideArrowsFrom="md"
              wrapperClassName="-mx-2 px-2 md:mx-0 md:px-0"
              className="flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible
                         lg:grid-cols-3 xl:grid-cols-4 lg:gap-5"
            >
              {touristAreas.map(area => (
                <div key={area.id} className="w-[70vw] shrink-0 md:w-auto">
                  <DestinationCard
                    href={`/tourist-areas/${buildAreaSlug(area.id, area.name)}`}
                    label={area.name}
                    imageUrl={area.image_url}
                    subtitle={touristAreaLocation(area)}
                    aspect="landscape"
                  />
                </div>
              ))}
            </HorizontalScrollRow>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: 'Beaches & coast', region: 'Central', category: 'beach' },
                { label: 'National parks', region: 'Central', category: 'nature' },
                { label: 'Heritage sites', region: 'Ashanti', category: 'historical' },
                { label: 'Markets & culture', region: 'Greater Accra', category: 'market' },
              ].map(item => (
                <DestinationCard
                  key={item.label}
                  href={touristAreaBrowseHref(item.region, item.category)}
                  label={item.label}
                  subtitle={item.region}
                  aspect="landscape"
                />
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-center sm:hidden">
            <Link
              href="/tourist-areas"
              className="flex items-center gap-1 text-sm font-semibold text-gold hover:underline"
            >
              See all attractions <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
