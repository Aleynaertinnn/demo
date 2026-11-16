import Link from 'next/link';
import PageBanner from '@/components/ui/PageBanner';
import PageLayout from '@/components/layout/PageLayout';
import { legalDocuments } from '@/constants/legal';

export const metadata = { title: 'Yasal Bilgilendirmeler | Uluk Mimarlık', description: 'Gizlilik, kişisel veriler, çerezler ve site kullanımına ilişkin bilgilendirmeler.' };

export default function LegalPage() {
  return (
    <PageLayout>
      <PageBanner currentPage="Yasal Bilgilendirmeler" eyebrow="Açık ve anlaşılır." title="Yasal bilgilendirmeler." description="Gizlilik, kişisel veriler ve içerik kullanımına ilişkin metinlere buradan ulaşabilirsiniz." />
      <section aria-label="Yasal metinler" className="mx-auto max-w-5xl py-10 md:py-16">
        <p className="mt-0 mb-8 border-0 border-l-2 border-solid border-brand pl-4 text-sm leading-relaxed text-ink-muted">Bu metinler taslaktır. Şirket bilgileri ve canlı ortamın veri işleyişi doğrulandıktan sonra tamamlanacaktır.</p>
        <div className="grid border-0 border-t border-solid border-line/40 md:grid-cols-2">
          {legalDocuments.map((document, index) => <Link key={document.slug} href={`/yasal/${document.slug}`} className="group flex min-w-0 flex-col border-0 border-b border-solid border-line/40 px-5 py-8 text-ink no-underline transition-colors hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-ink motion-reduce:transition-none md:px-8 md:py-10 md:[&:nth-child(even)]:border-l">
            <span className="mb-7 text-[10px] font-semibold text-brand">0{index + 1} / TASLAK</span>
            <h2 className="mt-0 mb-4 font-display text-2xl leading-tight font-semibold tracking-[-.04em]">{document.title}</h2>
            <p className="mt-0 mb-8 max-w-[43ch] text-sm leading-[1.9] text-ink-muted">{document.description}</p>
            <span className="mt-auto flex items-center justify-between text-xs font-medium">Metni incele<span aria-hidden="true" className="text-2xl transition-transform group-hover:translate-x-1 motion-reduce:transition-none">↗</span></span>
          </Link>)}
        </div>
      </section>
    </PageLayout>
  );
}
