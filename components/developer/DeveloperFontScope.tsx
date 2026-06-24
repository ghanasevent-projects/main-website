import { GeistSans } from 'geist/font/sans'

export default function DeveloperFontScope({ children }: { children: React.ReactNode }) {
  return <div className={`${GeistSans.variable} font-docs`}>{children}</div>
}
