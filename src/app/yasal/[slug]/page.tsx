import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageBanner from '@/components/ui/PageBanner';
import PageLayout from '@/components/layout/PageLayout';
import { legalDocuments } from '@/constants/legal';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return legalDocuments.map(document => ({ slug: document.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const document = legalDocuments.find(item => item.slug === slug);
  if (!document) notFound();
  return { title: `${document.title} | Uluk Mimarlık`, description: document.description, robots: { index: false, follow: true } };
}
export default async function LegalDetailPage({ params }: Props) {
  const { slug } = await params;
  const document = legalDocuments.find(item => item.slug === slug);
  if (!document) notFound();
  return (
    <PageLayout>
      <PageBanner breadcrumbs={[{ label: 'Anasayfa', href: '/' }, { label: 'Yasal Bilgilendirmeler', href: '/yasal' }]} currentPage={document.title} eyebrow="Yasal bilgilendirmeler / Taslak" title={document.title} description={document.description} />
      <div className="mx-auto grid max-w-6xl gap-10 py-10 md:grid-cols-[220px_minmax(0,1fr)] md:gap-16 md:py-16">
        <aside>
          <p className="mt-0 mb-5 text-[10px] font-bold text-brand">BU METİNDE</p>
          <nav aria-label="Metin içindekiler"><ol className="m-0 list-none p-0">{document.sections.map((section, index) => <li key={section.id} className="border-0 border-t border-solid border-line/30"><a href={`#${section.id}`} className="flex min-h-11 items-start gap-3 py-3 text-xs leading-relaxed text-ink no-underline hover:text-brand focus-visible:outline-2 focus-visible:outline-brand"><span className="text-[10px] text-ink-muted">0{index + 1}</span>{section.title}</a></li>)}</ol></nav>
        </aside>
        <article className="min-w-0 max-w-3xl">
          <div className="mb-10 border border-solid border-line/40 bg-surface/60 p-5"><p className="mt-0 mb-2 text-xs font-bold text-brand">TASLAK METİN</p><p className="m-0 text-sm leading-[1.8] text-ink-muted">Şirketin doğrulanmış bilgileri ve kullanılan altyapının veri akışları tamamlanmadan bu içerik nihai hukuki metin olarak kullanılmamalıdır.</p></div>
          {document.sections.map((section, index) => <section id={section.id} key={section.id} aria-labelledby={`${section.id}-heading`} className="mb-10 scroll-mt-28 border-0 border-t border-solid border-line/30 pt-6 md:mb-12"><p className="mt-0 mb-3 text-[10px] text-brand">0{index + 1}</p><h2 id={`${section.id}-heading`} className="mt-0 mb-5 font-display text-2xl leading-tight font-semibold tracking-[-.035em]">{section.title}</h2>{section.paragraphs.map(paragraph => <p key={paragraph} className="mt-0 mb-4 text-sm leading-[1.95] text-ink-muted sm:text-base">{paragraph}</p>)}</section>)}
          <Link href="/yasal" className="inline-flex min-h-11 items-center text-sm text-ink underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-brand">← Tüm yasal metinler</Link>
        </article>
      </div>
    </PageLayout>
  );
}
