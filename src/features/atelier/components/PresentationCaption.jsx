export default function PresentationCaption({ step, index }) {
  return (
    <article
      data-presentation-step={index + 1}
      className={`presentation-step ${index % 2 ? 'presentation-step-left' : 'presentation-step-right'}`}
    >
      <div className="relative px-4 py-5 sm:px-5 sm:py-7">
        <span data-caption-corner aria-hidden="true" className="pointer-events-none absolute top-0 left-0 h-3 w-3 border-0 border-t border-l border-solid border-line" />
        <span data-caption-corner aria-hidden="true" className="pointer-events-none absolute right-0 bottom-0 h-3 w-3 border-0 border-r border-b border-solid border-line" />
        <p data-caption-label className="presentation-label">{step.label}</p>
        <h2 lang="tr" aria-label={step.title}>
          {step.titleLines.map(line => (
            <span key={line} aria-hidden="true" className="block overflow-hidden pb-[.08em] -mb-[.08em]">
              <span data-caption-line className="block">{line.toLocaleUpperCase('tr-TR')}</span>
            </span>
          ))}
        </h2>
        <div data-caption-rule aria-hidden="true" className="mt-5 h-px w-16 origin-left bg-line/60 max-[700px]:mt-3" />
        <p data-caption-description className="presentation-description">{step.description}</p>
      </div>
    </article>
  )
}
