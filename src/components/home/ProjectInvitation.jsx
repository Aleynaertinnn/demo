import Link from 'next/link'

export default function ProjectInvitation() {
  return (
    <section className="flex min-h-[45svh] flex-col items-start justify-center gap-6 px-[clamp(24px,6vw,96px)] py-16 text-ink">
      <p className="m-0 font-handwritten text-brand">BİRLİKTE BAŞLAYALIM</p>
      <h2 className="m-0 max-w-[16ch] font-display text-[clamp(2.5rem,5vw,5rem)] leading-[1.05] font-semibold tracking-[-.05em]">Sizin fikrinizle devam edelim.</h2>
      <Link href="/iletisim" className="font-sans text-base font-medium text-brand underline underline-offset-4">Projenizi konuşalım ↗</Link>
    </section>
  )
}
