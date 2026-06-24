import {
  Music2, Briefcase, Globe2, Theater, Heart, Cpu, UtensilsCrossed, Trophy,
  GraduationCap, Film, Shirt, Home, Star, Users, Gift, Gamepad2,
  Car, HeartHandshake, Landmark, Activity, Church, Tag, Martini,
} from 'lucide-react'
import type { ReactNode } from 'react'

const SLUG_ICONS: Record<string, ReactNode> = {
  music: <Music2 size={18} strokeWidth={1.5} />,
  nightlife: <Martini size={18} strokeWidth={1.5} className="text-gray-900" />,
  'film-media': <Film size={18} strokeWidth={1.5} />,
  film_media: <Film size={18} strokeWidth={1.5} />,
  'film-&-media': <Film size={18} strokeWidth={1.5} />,
  'performing-visual-arts': <Theater size={18} strokeWidth={1.5} />,
  performing_visual_arts: <Theater size={18} strokeWidth={1.5} />,
  'arts-culture': <Theater size={18} strokeWidth={1.5} className="text-gray-900" />,
  business: <Briefcase size={18} strokeWidth={1.5} />,
  'science-tech': <Cpu size={18} strokeWidth={1.5} />,
  science_tech: <Cpu size={18} strokeWidth={1.5} />,
  'science-&-tech': <Cpu size={18} strokeWidth={1.5} />,
  government: <Landmark size={18} strokeWidth={1.5} />,
  'food-drink': <UtensilsCrossed size={18} strokeWidth={1.5} />,
  food_drink: <UtensilsCrossed size={18} strokeWidth={1.5} />,
  'food-&-drink': <UtensilsCrossed size={18} strokeWidth={1.5} />,
  health: <Activity size={18} strokeWidth={1.5} />,
  'sports-fitness': <Trophy size={18} strokeWidth={1.5} />,
  sports_fitness: <Trophy size={18} strokeWidth={1.5} />,
  'home-lifestyle': <Home size={18} strokeWidth={1.5} />,
  home_lifestyle: <Home size={18} strokeWidth={1.5} />,
  'home-&-lifestyle': <Home size={18} strokeWidth={1.5} />,
  fashion: <Shirt size={18} strokeWidth={1.5} />,
  community: <Users size={18} strokeWidth={1.5} />,
  'charity-causes': <HeartHandshake size={18} strokeWidth={1.5} />,
  charity_causes: <HeartHandshake size={18} strokeWidth={1.5} />,
  'charity-&-causes': <HeartHandshake size={18} strokeWidth={1.5} />,
  spirituality: <Church size={18} strokeWidth={1.5} className="text-gray-900" />,
  religion: <Church size={18} strokeWidth={1.5} className="text-gray-900" />,
  'family-education': <GraduationCap size={18} strokeWidth={1.5} />,
  family_education: <GraduationCap size={18} strokeWidth={1.5} />,
  'family-&-education': <GraduationCap size={18} strokeWidth={1.5} />,
  dating: <Heart size={18} strokeWidth={1.5} />,
  hobbies: <Gamepad2 size={18} strokeWidth={1.5} />,
  holidays: <Gift size={18} strokeWidth={1.5} />,
  'travel-outdoor': <Globe2 size={18} strokeWidth={1.5} />,
  travel_outdoor: <Globe2 size={18} strokeWidth={1.5} />,
  'auto-boat-air': <Car size={18} strokeWidth={1.5} />,
  auto_boat_air: <Car size={18} strokeWidth={1.5} />,
  'auto-boat-&-air': <Car size={18} strokeWidth={1.5} />,
}

function isEmojiIcon(value: string): boolean {
  return /\p{Extended_Pictographic}/u.test(value.trim())
}

/** Category circle icon: emoji from DB, slug-mapped Lucide, or fallback. */
export function getCategoryDisplayIcon(slug: string, dbIcon?: string | null): ReactNode {
  if (dbIcon && isEmojiIcon(dbIcon)) {
    return <span className="text-lg leading-none">{dbIcon.trim()}</span>
  }

  const key = slug.toLowerCase().trim()
  return SLUG_ICONS[key] ?? SLUG_ICONS[key.replace(/-/g, '_')] ?? (
    <Tag size={18} strokeWidth={1.5} className="text-[#C9973A]" />
  )
}
