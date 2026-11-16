import arrowUpRight from '@iconify-icons/lucide/arrow-up-right';
import Icon from '@/components/ui/Icon';
import { contact } from '@/constants/contact';
import { footerSocials } from '@/constants/footer';

export default function DirectContact() {
  const instagram = footerSocials.find(social => social.platform === 'instagram');
  const channels = [
    { label: 'E-posta', value: contact.email, href: contact.email ? `mailto:${contact.email}` : null },
    { label: 'Telefon', value: contact.phone, href: contact.phone ? `tel:${contact.phone.replace(/[^+\d]/g, '')}` : null },
    ...(instagram?.href ? [{ label: 'Instagram', value: 'Atölyeden paylaşımlar', href: instagram.href }] : []),
  ];

  return (
    <section aria-labelledby="direct-contact-heading" className="mt-12 grid gap-8  px-5 py-10 text-ink sm:px-8 md:mt-20 md:grid-cols-[minmax(0,.45fr)_minmax(0,.55fr)] md:gap-16 md:px-12 md:py-14">
      <div>
        <p className="mt-0 mb-5 text-[13px] font-bold font-handwritten text-ink-muted">DOĞRUDAN İLETİŞİM</p>
        <h2 id="direct-contact-heading" className="mt-0 mb-5 max-w-[19ch] font-heading-face text-[clamp(28px,3vw,44px)] leading-[1.12] font-medium tracking-[-.045em]">Her şey bir konuşmayla başlar.</h2>
        <p className="m-0 max-w-[43ch] text-sm leading-[1.9] text-ink-muted">Form yerine doğrudan iletişime geçmek isterseniz bize yazabilir veya arayabilirsiniz.</p>
        <div className="mt-7 flex items-center gap-4 text-ink-muted md:mt-9">
          <p className="m-0 -rotate-3 font-handwritten text-sm leading-relaxed sm:text-base">Bir merhaba yeter.</p>
          <svg aria-hidden="true" viewBox="0 0 110 44" fill="none" className="h-10 w-24 rotate-45 md:rotate-0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 29C23 8 44 5 55 15c12 12-8 22-14 12-7-12 24-18 59-9" />
            <path d="m91 10 10 8-12 5" />
          </svg>
        </div>
      </div>
      <ul className="m-0 list-none self-center border-0 border-t border-solid border-line/40 p-0">
        {channels.map((channel, index) => {
          const content = <>
            <span aria-hidden="true" className="text-[9px] text-ink-muted tabular-nums">0{index + 1}</span>
            <span className="min-w-0 flex-1"><span className="block text-[10px] text-ink-muted">{channel.label}</span><span className="mt-2 block text-base leading-relaxed wrap-anywhere sm:text-xl">{channel.value ?? 'Yakında paylaşılacak'}</span></span>
            {channel.href && <Icon icon={arrowUpRight} width={22} height={22} className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" />}
          </>;
          const rowClass = 'group flex min-h-24 items-center gap-5 py-6 text-ink no-underline sm:gap-7';
          return <li key={channel.label} className="border-0 border-b border-solid border-line/40">
            {channel.href ? <a href={channel.href} target={channel.label === 'Instagram' ? '_blank' : undefined} rel={channel.label === 'Instagram' ? 'noopener noreferrer' : undefined} className={`${rowClass} transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink`}>{content}</a> : <div className={rowClass}>{content}</div>}
          </li>;
        })}
      </ul>
    </section>
  );
}
