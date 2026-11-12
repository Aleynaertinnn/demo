import type { Service } from '@/constants/services';
import ServiceDrawing from './ServiceDrawing';

export default function ServiceCard({ service, index }: { service: Service; index: number }) {
  const blue = index % 2 === 1;
  return (
    <article className={`group relative flex h-full w-[82vw] shrink-0 flex-col border border-solid border-ink px-6 py-5 sm:w-[clamp(340px,44vw,680px)] sm:px-8 sm:py-7 ${blue ? 'bg-ink text-paper' : 'bg-paper text-ink'}`}>
      <span aria-hidden="true" className="pointer-events-none absolute inset-2 border border-solid border-current opacity-[.1] transition-opacity duration-500 group-hover:opacity-40 motion-reduce:transition-none" />
      <span aria-hidden="true" className="pointer-events-none absolute top-3 left-3 h-3 w-3 border-0 border-t border-l border-solid border-current opacity-30 transition-opacity group-hover:opacity-100" />
      <span aria-hidden="true" className="pointer-events-none absolute right-3 bottom-3 h-3 w-3 border-0 border-r border-b border-solid border-current opacity-30 transition-opacity group-hover:opacity-100" />
      <p className="m-0 border-0 border-b border-solid border-current/20 pb-4 text-[10px] leading-relaxed font-medium tracking-[.1em] uppercase" lang="tr">{String(index + 1).padStart(2, '0')} / {service.title.toLocaleUpperCase('tr-TR')}</p>
      <div className="flex min-h-0 flex-1 items-center justify-center py-3"><ServiceDrawing index={index} /></div>
      <div>
        <h3 className="m-0 max-w-[13ch] font-display text-[clamp(25px,2.5vw,38px)] leading-[1.05] font-medium tracking-[-.05em]">{service.title}</h3>
        <p className="mt-4 mb-5 max-w-[38ch] text-xs leading-5 opacity-80 sm:text-[13px]">{service.description}</p>
        <div className="flex justify-end border-0 border-t border-solid border-current/25 pt-3">
          <p className="m-0 border border-solid border-current/40 px-3 py-2 text-[8px] leading-none tracking-[.14em]">ULUK / HİZMETLER</p>
        </div>
      </div>
    </article>
  );
}
