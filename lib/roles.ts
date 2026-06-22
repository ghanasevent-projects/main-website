/** True for roles allowed to create and manage events. */
export function canCreateEvents(role: string | null | undefined): boolean {
  return role === 'organiser' || role === 'admin'
}

/** Show create-event links in nav/marketing: always when logged out, only organisers/admins when logged in. */
export function showCreateEventsNav(role: string | null | undefined, isLoggedIn: boolean): boolean {
  if (!isLoggedIn) return true
  return canCreateEvents(role)
}
