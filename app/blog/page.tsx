import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react'
import SiteShell from '@/components/layout/SiteShell'

export const metadata = {
  title: 'Blog',
  description: 'News, insights, and organiser tips from GhanasEvent.',
}

const POSTS = [
  {
    title: 'How to sell more event tickets in Ghana',
    excerpt: 'Simple tactics to improve your event listing and conversion.',
  },
  {
    title: 'Choosing the right venue for your event',
    excerpt: 'A practical checklist for organisers planning successful experiences.',
  },
]

export default function BlogPage() {
  return (
    <SiteShell>
      <main className="min-h-screen bg-[#f9f8f5] px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl">
          <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gold-dark">
                <Sparkles className="h-3.5 w-3.5" />
                Insights and updates
              </p>
              <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-5xl" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
                Stories, tips, and organiser ideas from the GhanasEvent team
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600">
                Learn practical ways to sell more tickets, build better event pages, and create stronger experiences for your audience.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-100 shadow-lg">
              <Image
                src="/hero/music-festival.webp"
                alt="Editorial event content"
                width={960}
                height={640}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/55 to-transparent" />
              <div className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-xs font-semibold text-white/90 backdrop-blur-sm">
                Organiser playbook
              </div>
            </div>
          </section>

          <section className="mt-10 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-gold">Featured articles</p>
              <div className="mt-5 space-y-4">
                {POSTS.map((post) => (
                  <article key={post.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-gold/10 p-2 text-gold">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">{post.title}</h2>
                        <p className="mt-2 text-sm text-gray-600">{post.excerpt}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-gold/20 bg-linear-to-br from-gold/10 to-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-syne, sans-serif)' }}>
                What you can expect
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-gray-700">
                <li>Practical organiser growth tips</li>
                <li>Launch ideas for churches, schools, concerts, and community events</li>
                <li>Ticketing and promotion best practices</li>
                <li>Platform updates and feature releases</li>
              </ul>
              <Link href="/contact" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold hover:underline">
                Pitch a story <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </main>
    </SiteShell>
  )
}
