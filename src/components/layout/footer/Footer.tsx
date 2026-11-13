import Image from 'next/image';
import Link from 'next/link';
import arrowUpRight from '@iconify-icons/lucide/arrow-up-right';
import arrowUp from '@iconify-icons/lucide/arrow-up';
import plus from '@iconify-icons/lucide/plus';
import Icon from '@/components/ui/Icon';
import { footer } from '@/constants/footer';
import { navigation } from '@/constants/navigation';
import FooterSocials from './FooterSocials';

const year = new Date().getFullYear();
const focus = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper';

export default function Footer() {
  return (
    <footer aria-label="Site alt bilgisi" className="relative mx-3 mt-10 mb-3 bg-ink [body:has([data-contact-cta])_&]:mt-0 px-6 pt-10 pb-5 text-paper sm:mx-5 sm:mb-5 sm:px-10 sm:pt-12">
      <div className="relative grid gap-9 border-0 border-b border-solid border-paper/25 pb-8 md:grid-cols-[1.4fr_1fr] md:gap-12 md:pb-10">
        <div>
          <Link href="/" aria-label="Uluk Mimarlık — Anasayfa" className={`inline-flex items-center gap-3 text-paper no-underline ${focus}`}>
            <Image src={footer.logo} alt="" width={40} height={40} className="h-9 w-9 brightness-0 invert" />
            <span className="font-logo-face text-xl leading-tight font-semibold tracking-[-.035em] sm:text-2xl">{footer.brand}</span>
          </Link>
          <p className="mt-5 mb-0 max-w-[29ch] text-sm leading-relaxed text-paper/75">{footer.description}</p>
          <p className="mt-4 mb-0 font-handwritten text-sm leading-relaxed text-paper/65">{footer.note}</p>
        </div>

        <nav aria-label="Alt menü" className="border-0 border-t border-solid border-paper/20 pt-5 md:border-t-0 md:border-l md:pl-8 md:pt-0">
          <p className="mt-0 mb-4 text-[9px] leading-relaxed tracking-[.15em] text-paper/60">{footer.navigationLabel}</p>
          <ul className="m-0 grid list-none grid-cols-2 gap-x-6 gap-y-3 p-0 md:grid-cols-2">
            {navigation.map((item, index) => (
              <li key={item.href}>
                <Link href={item.href} prefetch={false} className={`group inline-flex min-h-7 items-center gap-3 text-sm text-paper no-underline ${focus}`}>
                  <span className="mr-1 font-sans text-[9px] text-paper/45 tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                  {item.label}
                  <Icon icon={arrowUpRight} width={13} height={13} className="opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

      </div>

      <FooterSocials />

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pt-4 text-[9px] leading-relaxed tracking-[.04em] text-paper/65">
        <p className="m-0">© {year} Uluk Mimarlık. Tüm hakları saklıdır.</p>
        <p className="m-0 hidden tracking-[.15em] lg:block">{footer.signature}</p>
        <a href={footer.credit.href} target="_blank" rel="noopener noreferrer" className={`group inline-flex min-h-11 items-center gap-2 text-paper/65 no-underline transition-colors hover:text-paper ${focus}`}>
          {footer.credit.label} <span className="text-paper">{footer.credit.name}</span>
          <Icon icon={arrowUpRight} width={12} height={12} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none" />
        </a>
        <a href="#sayfa-basi" className={`group inline-flex min-h-11 items-center gap-3 text-paper no-underline ${focus}`}>
          BAŞA DÖN
          <Icon icon={arrowUp} width={14} height={14} className="transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transition-none" />
        </a>
      </div>
    </footer>
  );
}
