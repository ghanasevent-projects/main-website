/**
 * Dev launcher: clears a corrupted .next route cache, then starts Next.js.
 * Turbopack on slow Windows filesystems can partially write routes.d.ts,
 * which makes most app routes 404. Webpack dev is the default here.
 */
import { existsSync, readFileSync, rmSync } from 'fs'
import { spawn } from 'child_process'
import { join } from 'path'

const routesFile = join('.next', 'dev', 'types', 'routes.d.ts')

/** Routes that must appear once the dev server has generated types. */
const REQUIRED_IN_CACHE = [
  '"/attendee/tickets"',
  '"/organiser/dashboard"',
  '"/events/[slug]"',
  '"/account"',
]

function cacheLooksCorrupt() {
  if (!existsSync(routesFile)) return false

  const content = readFileSync(routesFile, 'utf8')

  // Known partial-write garbage from corrupted merges
  if (/^g\/\[slug\]/m.test(content)) return true
  if (content.split('declare global').length > 2) return true

  const missing = REQUIRED_IN_CACHE.filter((token) => !content.includes(token))
  if (missing.length > 0) return true

  return false
}

if (cacheLooksCorrupt()) {
  console.log('\n⚠ Corrupted Next.js route cache detected — removing .next …\n')
  rmSync('.next', { recursive: true, force: true })
}

const userArgs = process.argv.slice(2)
const useTurbo = userArgs.includes('--turbo') || userArgs.includes('--turbopack')
const filtered = userArgs.filter((a) => a !== '--turbo' && a !== '--turbopack')

const nextArgs = ['dev', ...(useTurbo ? ['--turbo'] : ['--webpack']), ...filtered]

const child = spawn('next', nextArgs, { stdio: 'inherit', shell: true })
child.on('exit', (code) => process.exit(code ?? 0))
