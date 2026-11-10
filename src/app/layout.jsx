import localFont from 'next/font/local'
import Header from '@/components/layout/Header'
import './globals.css'
import '@/features/atelier/atelier.css'

export const metadata = { title: 'Kâğıt Atölyesi', description: 'Bir eskizden 3D sahneye.' }

const headings = localFont({ src: './fonts/SpaceGrotesk-Variable.ttf', variable: '--font-heading', weight: '300 700', display: 'swap' })
const body = localFont({ src: './fonts/DMSans-Variable.ttf', variable: '--font-body', weight: '100 1000', display: 'swap' })
const notes = localFont({ src: './fonts/ArchitectsDaughter-Regular.ttf', variable: '--font-notes', weight: '400', display: 'swap' })

export default function Layout({ children }) {
  return <html lang="tr" className={`${headings.variable} ${body.variable} ${notes.variable}`}><body><Header />{children}</body></html>
}
