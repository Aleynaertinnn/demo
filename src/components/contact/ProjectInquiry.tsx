'use client';

import { useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { projectTypes, serviceTypes, steps, validateInquiry, submitInquiry } from './project-inquiry';
import type { Errors, Inquiry } from './project-inquiry';

const initial: Inquiry = { projectType: '', services: [], location: '', area: '', note: '', name: '', email: '', phone: '' };

export default function ProjectInquiry() {
  const [data, setData] = useState<Inquiry>(initial);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState('');
  const [success, setSuccess] = useState(false);
  const [direction, setDirection] = useState(1);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const animation = panel.current?.animate(
      [{ opacity: 0, transform: `translateX(${direction * 8}px)` }, { opacity: 1, transform: 'translateX(0)' }],
      { duration: 240, easing: 'ease-out' },
    );
    return () => animation?.cancel();
  }, [step, direction]);
  const heading = useRef<HTMLHeadingElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const lock = useRef(false);
  const update = (key: keyof Inquiry, value: string | string[]) => {
    setData(current => ({ ...current, [key]: value }));
    setErrors(current => ({ ...current, [key]: undefined }));
    setResult('');
  };
  function move(next: number, nextErrors: Errors = {}) {
    setDirection(next >= step ? 1 : -1);
    setStep(next); setErrors(nextErrors); setResult('');
    requestAnimationFrame(() => {
      heading.current?.focus({ preventScroll: true });
      const top = heading.current?.getBoundingClientRect().top ?? 0;
      if (top < 110 || top > window.innerHeight - 120) heading.current?.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    });
  }
  function focusError(nextErrors: Errors) {
    requestAnimationFrame(() => form.current?.querySelector<HTMLElement>(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus());
  }
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (lock.current) return;
    const currentErrors = validateInquiry(data, step);
    setErrors(currentErrors);
    if (Object.keys(currentErrors).length) { focusError(currentErrors); return; }
    if (step < 3) { move(step + 1); return; }
    for (let index = 0; index < 4; index++) {
      const allErrors = validateInquiry(data, index);
      if (Object.keys(allErrors).length) { move(index, allErrors); focusError(allErrors); return; }
    }
    lock.current = true; setSending(true); setResult('');
    try { await submitInquiry(data); setSuccess(true); }
    catch (error) { setResult(error instanceof Error ? error.message : 'Gönderim tamamlanamadı. Lütfen tekrar deneyin.'); }
    finally { lock.current = false; setSending(false); }
  }
  function preventEarlySubmit(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key === 'Enter' && event.target instanceof HTMLInputElement && event.target.type !== 'radio' && event.target.type !== 'checkbox') event.preventDefault();
  }
  const errorMessage = (key: keyof Inquiry) => errors[key] ? <p id={`error-${key}`} className="my-2.5 border-0 border-l-2 border-solid border-brand pl-2.5 text-[13px] leading-relaxed text-ink">{errors[key]}</p> : null;
  const field = (key: 'location' | 'area' | 'note' | 'name' | 'email' | 'phone', label: string, placeholder = '', type = 'text', autoComplete?: string) => (
    <div className="mb-[22px] min-w-0 [&>label]:mb-2.5 [&>label]:block [&>label]:text-[13px] [&>label>span]:text-[11px] [&>label>span]:text-ink-muted">
      <label htmlFor={`inquiry-${key}`}>{label}{['name', 'email'].includes(key) ? ' *' : <span> — isteğe bağlı</span>}</label>
      <div className="relative">
        {key === 'note' ? <textarea className="block min-h-[50px] w-full rounded-none border border-solid border-line/60 bg-paper p-3.5 font-sans text-sm leading-relaxed text-ink placeholder:text-ink-muted placeholder:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand resize-y" id={`inquiry-${key}`} name={key} value={data[key]} maxLength={1500} rows={5} placeholder={placeholder} onChange={e => update(key, e.target.value)} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `error-${key}` : undefined} /> :
          <input className="block min-h-[50px] w-full rounded-none border border-solid border-line/60 bg-paper p-3.5 font-sans text-sm leading-relaxed text-ink placeholder:text-ink-muted placeholder:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand [&[type=number]]:pr-12" id={`inquiry-${key}`} name={key} type={type} autoComplete={autoComplete} value={data[key]} placeholder={placeholder} required={key === 'name' || key === 'email'} min={key === 'area' ? '0' : undefined} step={key === 'area' ? 'any' : undefined} onChange={e => update(key, e.target.value)} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `error-${key}` : undefined} />}
        {key === 'area' && <span className="absolute top-4 right-[15px] text-[13px]">m²</span>}
      </div>
      {key === 'note' && <p className="mt-[7px] mb-0 text-right text-[10px] text-ink-muted">{data.note.length} / 1500</p>}
      {errorMessage(key)}
    </div>
  );
  return (
    <section className="grid grid-cols-1 border border-solid border-line text-ink md:grid-cols-[minmax(0,.35fr)_minmax(0,.65fr)]" aria-labelledby="inquiry-title">
      <aside className="border-0 border-b border-solid border-line p-[clamp(24px,4vw,64px)] md:border-r md:border-b-0">
        <p className="mt-0 mb-7 text-[10px] font-semibold">PROJENİZİ KONUŞALIM</p>
        <h2 id="inquiry-title" className="mt-0 mb-6 max-w-[15ch] font-heading-face text-[clamp(32px,3.5vw,54px)] leading-[1.08] font-medium tracking-[-.045em]">Önce fikrinizi tanıyalım.</h2>
        <p className="text-sm leading-[1.9] text-ink-muted">Birkaç kısa soruyla sizi ve projenizi tanıyalım. Henüz tüm detayları bilmeniz gerekmiyor.</p>
        <p className="mt-4 mb-0 font-handwritten text-base leading-relaxed md:mt-7">Her şey bir fikirle başlar.</p>
        <ol className="mt-7 mb-0 grid list-none grid-cols-4 gap-2.5 p-0 md:mt-18 md:block [&>li]:flex [&>li]:flex-col [&>li]:gap-[7px] [&>li]:border-0 [&>li]:border-t [&>li]:border-solid [&>li]:border-line/30 [&>li]:pt-3 [&>li]:text-[11px] [&>li]:text-ink-muted md:[&>li]:flex-row md:[&>li]:gap-5 md:[&>li]:py-4 md:[&>li]:text-sm [&>li[aria-current]]:border-brand [&>li[aria-current]]:font-semibold [&>li[aria-current]]:text-brand [&>li>span]:text-[10px] [&>li>span]:tabular-nums">
          {steps.map((item, index) => <li key={item.name} aria-current={index === step ? 'step' : undefined}><span>0{index + 1}</span>{item.name}</li>)}
        </ol>
      </aside>
      <div className="min-w-0 bg-surface/65 p-[clamp(24px,4vw,64px)]">
        {success ? <div role="status"><h3 className="mt-0 mb-3.5 font-heading-face text-[clamp(26px,2.5vw,38px)] leading-[1.15] font-medium tracking-[-.045em] outline-offset-6">İlk adımı attık.</h3><p>Projeniz bize ulaştı. Paylaştığınız iletişim bilgileri üzerinden sizinle iletişime geçeceğiz.</p></div> : <form ref={form} noValidate onSubmit={handleSubmit} onKeyDown={preventEarlySubmit} aria-busy={sending}>
          <p className="mt-0 mb-4 flex justify-between text-xs tabular-nums [&>span]:text-ink-muted" aria-live="polite" aria-atomic="true">0{step + 1} / 04 <span>{steps[step].name}</span></p>
          <div className="h-0.5 bg-line/25 [&>span]:block [&>span]:h-full [&>span]:bg-brand [&>span]:transition-[width] [&>span]:duration-[240ms] motion-reduce:[&>span]:transition-none" aria-hidden="true"><span style={{ width: `${(step + 1) * 25}%` }} /></div>
          <div key={step} className="pt-7 md:min-h-[430px] md:pt-10" ref={panel}>
            <h3 className="mt-0 mb-3.5 font-heading-face text-[clamp(26px,2.5vw,38px)] leading-[1.15] font-medium tracking-[-.045em] outline-offset-6" ref={heading} tabIndex={-1}>{steps[step].title}</h3>
            <p className="mt-0 mb-[30px] text-sm leading-[1.7] text-ink-muted">{steps[step].help}</p>
            {step < 2 && <fieldset className="m-0 min-w-0 border-0 p-0 [&>legend]:mb-3.5 [&>legend]:text-[11px] [&>legend]:text-ink-muted" aria-describedby={errors[step === 0 ? 'projectType' : 'services'] ? `error-${step === 0 ? 'projectType' : 'services'}` : undefined}>
              <legend>{step === 0 ? 'Proje türü (zorunlu)' : 'İhtiyaç duyduğunuz hizmetler (en az bir seçim)'}</legend>
              <div className="grid grid-cols-2 gap-3 max-[359px]:grid-cols-1">{(step === 0 ? projectTypes : serviceTypes).map((option, index) => {
                const selected = step === 0 ? data.projectType === option : data.services.includes(option);
                return <label key={option} className="relative flex min-h-[100px] cursor-pointer items-center gap-2 border border-solid border-line/50 px-3 py-4 text-[13px] transition-[background,border-color] duration-180 hover:bg-ink/5 has-checked:border-ink has-checked:bg-ink has-checked:text-paper [&:has(:checked)>span]:text-paper has-focus-visible:outline-2 has-focus-visible:outline-offset-3 has-focus-visible:outline-brand motion-reduce:transition-none md:min-h-28 md:gap-3 md:px-[18px] md:py-[22px] md:text-sm [&>input]:sr-only">
                  <input type={step === 0 ? 'radio' : 'checkbox'} name={step === 0 ? 'projectType' : 'services'} value={option} checked={selected} aria-invalid={!!errors[step === 0 ? 'projectType' : 'services']} onChange={() => {
                    if (step === 0) update('projectType', option);
                    else update('services', option === 'Henüz emin değilim' ? (selected ? [] : [option]) : selected ? data.services.filter(item => item !== option) : [...data.services.filter(item => item !== 'Henüz emin değilim'), option]);
                  }} />
                  <span className="self-start text-[9px] text-ink-muted">0{index + 1}</span><span>{option}</span><span className="ml-auto text-brand" aria-hidden="true">{selected ? '✓' : '+'}</span>
                </label>;
              })}</div>
              {errorMessage(step === 0 ? 'projectType' : 'services')}
            </fieldset>}
            {step === 2 && <><div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">{field('location', 'Projenin konumu', 'İl / ilçe', 'text', 'address-level2')}{field('area', 'Yaklaşık alan', 'Örn. 120', 'number')}</div>{field('note', 'Aklınızdaki proje', 'Nasıl bir mekân hayal ediyorsunuz? İhtiyaçlarınızı veya paylaşmak istediğiniz detayları yazabilirsiniz.')}</>}
            {step === 3 && <>{field('name', 'Ad soyad', '', 'text', 'name')}<div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">{field('email', 'E-posta', '', 'email', 'email')}{field('phone', 'Telefon', '', 'tel', 'tel')}</div>
              <div className="mt-[30px] border-0 border-t border-solid border-line [&>h4]:mt-[22px] [&>h4]:mb-3 [&>h4]:font-heading-face [&>h4]:text-base [&>h4]:font-medium [&>div]:flex [&>div]:items-start [&>div]:justify-between [&>div]:gap-5 [&>div]:border-0 [&>div]:border-b [&>div]:border-solid [&>div]:border-line/25 [&_p]:my-3 [&_p]:min-w-0 [&_p]:text-xs [&_p]:leading-[1.8] [&_p]:wrap-anywhere [&_strong]:block [&_strong]:text-[10px] [&_strong]:font-medium [&_strong]:text-ink-muted [&_button]:min-h-11 [&_button]:cursor-pointer [&_button]:border-0 [&_button]:bg-transparent [&_button]:px-0 [&_button]:py-3 [&_button]:text-[11px] [&_button]:text-brand [&_button]:underline [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-3 [&_button:focus-visible]:outline-brand"><h4>Projenizin özeti</h4>
                <div><p><strong>Proje türü</strong>{data.projectType}</p><button type="button" onClick={() => move(0)}>Düzenle<span className="sr-only">: proje türü</span></button></div>
                <div><p><strong>Hizmetler</strong>{data.services.join(', ')}</p><button type="button" onClick={() => move(1)}>Düzenle<span className="sr-only">: hizmetler</span></button></div>
                {(data.location || data.area || data.note) && <div><p><strong>Detaylar</strong>{[data.location, data.area ? `${data.area} m²` : ''].filter(Boolean).join(' · ')}{data.note && <span className="block whitespace-pre-wrap">{data.note}</span>}</p><button type="button" onClick={() => move(2)}>Düzenle<span className="sr-only">: detaylar</span></button></div>}
              </div>
            </>}
          </div>
          {result && <p className="my-2.5 border-0 border-l-2 border-solid border-brand pl-2.5 text-[13px] leading-relaxed text-ink" role="alert">{result}</p>}
          <div className="mt-8 flex justify-between gap-4 border-0 border-t border-solid border-line/40 pt-6 [&>button]:min-h-14 [&>button]:cursor-pointer [&>button]:rounded-none [&>button]:border-0 [&>button]:text-xs [&>button:focus-visible]:outline-2 [&>button:focus-visible]:outline-offset-3 [&>button:focus-visible]:outline-brand [&>button:disabled]:cursor-wait [&>button:disabled]:opacity-60">
            {step > 0 && <button type="button" disabled={sending} className="bg-transparent px-2 py-4 text-ink" onClick={() => move(step - 1)}>← Geri</button>}
            <button type="submit" disabled={sending} className="ml-auto flex items-center justify-between gap-[35px] bg-brand px-[22px] py-4 text-on-brand hover:bg-ink">{sending ? 'Gönderiliyor…' : step === 3 ? 'Projemi gönder' : 'Devam'}<span aria-hidden="true">→</span></button>
          </div>
        </form>}
      </div>
    </section>
  );
}
