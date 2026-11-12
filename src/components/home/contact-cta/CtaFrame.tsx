import plus from '@iconify-icons/lucide/plus';
import Icon from '@/components/ui/Icon';

const corners = [
  'top-0 left-0 -translate-x-1/2 -translate-y-1/2',
  'top-0 right-0 translate-x-1/2 -translate-y-1/2',
  'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
  'bottom-0 right-0 translate-x-1/2 translate-y-1/2',
];

export default function CtaFrame({ divider = false }: { divider?: boolean }) {
  if (divider) {
    return <div aria-hidden="true" className="pointer-events-none absolute -bottom-3 left-1/2 w-[calc(100vw-24px)] -translate-x-1/2 border-0 border-b border-dashed border-ink/25 sm:w-[calc(100vw-40px)]" />;
  }

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 border border-solid border-ink/35">
      {corners.map(position => <Icon key={position} icon={plus} width={14} height={14} className={`absolute text-ink/80 ${position}`} />)}
      <span className="absolute inset-y-0 left-[20%] border-0 border-l border-dashed border-ink/25" />
      <span className="absolute inset-y-0 right-[20%] border-0 border-r border-dashed border-ink/25" />
    </div>
  );
}
