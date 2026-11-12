import instagram from '@iconify-icons/lucide/instagram';
import youtube from '@iconify-icons/lucide/youtube';
import twitter from '@iconify-icons/lucide/twitter';
import linkedin from '@iconify-icons/lucide/linkedin';
import plus from '@iconify-icons/lucide/plus';
import arrowUpRight from '@iconify-icons/lucide/arrow-up-right';
import Icon from '@/components/ui/Icon';
import { footer, footerSocials } from '@/constants/footer';

const icons = { instagram, youtube, twitter, linkedin };
const tileClass = 'group relative isolate flex min-h-20 items-center gap-3 overflow-hidden border-0 border-solid border-paper/25 px-4 py-5 text-paper no-underline sm:min-h-24 sm:px-5';

export default function FooterSocials() {
  return (
    <div className="border-0 border-b border-solid border-paper/25 pb-6">
      <p className="mt-5 mb-3 text-[9px] leading-relaxed tracking-[.15em] text-paper/60">{footer.socialLabel}</p>
      <ul aria-label="Sosyal medya" className="m-0 grid list-none grid-cols-2 border border-solid border-paper/25 p-0 lg:grid-cols-4">
        {footerSocials.map((social) => {
          const content = (
            <>
              <span aria-hidden="true" className="absolute inset-0 -translate-x-full bg-paper transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-0 group-focus-visible:translate-x-0 motion-reduce:transition-none" />
              <Icon icon={icons[social.platform]} width={22} height={22} className="relative z-10 shrink-0 transition-[color,transform] duration-500 group-hover:-translate-y-0.5 group-hover:text-ink group-focus-visible:text-ink motion-reduce:transition-none" />
              <span className="relative z-10 text-[11px] font-medium tracking-[.02em] transition-colors duration-500 group-hover:text-ink group-focus-visible:text-ink motion-reduce:transition-none">{social.label}</span>
              <Icon icon={social.href ? arrowUpRight : plus} width={11} height={11} className="absolute right-2 bottom-2 z-10 text-paper/50 transition-colors duration-500 group-hover:text-ink/65 group-focus-visible:text-ink/65 motion-reduce:transition-none" />
            </>
          );
          return (
            <li key={social.platform} className="min-w-0 border-0 border-solid border-paper/25 [&:nth-child(even)]:border-l [&:nth-child(n+3)]:border-t lg:[&:nth-child(n+2)]:border-l lg:[&:nth-child(n+3)]:border-t-0">
              {social.href ? (
                <a href={social.href} target="_blank" rel="noopener noreferrer" aria-label={`${social.label} (yeni sekmede açılır)`} className={`${tileClass} focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-paper`}>{content}</a>
              ) : (
                <span className={tileClass}>{content}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
