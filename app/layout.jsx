import './style.css'

export const metadata = { title: 'Kâğıt Atölyesi', description: 'Bir eskizden 3D sahneye.' }

export default function Layout({ children }) {
  return <html lang="tr"><body>{children}</body></html>
}
