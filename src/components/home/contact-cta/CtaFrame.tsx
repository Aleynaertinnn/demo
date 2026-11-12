import plus from '@iconify-icons/lucide/plus';
import Icon from '@/components/ui/Icon';

function Mark({ className }: { className: string }) {
  return <Icon icon={plus} width={14} height={14} className={`absolute text-ink/80 ${className}`} />;
}

export default function CtaFrame({ area = 'copy' }: { area?: 'copy' | 'artwork' }) {
  if (area === 'artwork') {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-[4%] top-[25%] bottom-[20%]">
        <span className="absolute top-0 bottom-0 left-0 border-0 border-l border-dashed border-ink/45" />
        <span className="absolute top-0 right-0 bottom-0 border-0 border-r border-dashed border-ink/45" />
        <Mark className="top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
        <Mark className="right-0 bottom-0 translate-x-1/2 translate-y-1/2" />
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-5 -bottom-3 h-px border-0 border-b border-dashed border-ink/45">
      <Mark className="top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
      <Mark className="top-0 right-0 translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}
