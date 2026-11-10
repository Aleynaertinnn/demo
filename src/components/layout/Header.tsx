
import gridIcon from '@iconify-icons/lucide/grid-2x2'
import Icon from '@/components/ui/Icon'

export default function Header() {
  return <header className="flex min-h-16 items-center justify-between gap-4 border-0 border-b border-solid border-line/27 font-sans text-[0.72rem] font-semibold text-ink">
    <span className="inline-flex items-center gap-2">
      <Icon icon={gridIcon} width={16} height={16} />
      KÂĞIT ATÖLYESİ
    </span>
    <span>HAREKET ÇALIŞMASI / 01</span>
  </header>
}
