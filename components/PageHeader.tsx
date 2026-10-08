export default function PageHeader({
  meta,
  title,
  lede,
}: {
  meta: string;
  title: string;
  lede: string;
}) {
  return (
    <header className="relative overflow-hidden bg-[var(--color-theme-light)]">
      <div className="hero-gradient" aria-hidden="true" />
      <div className="container-site py-14 md:py-20">
        <p className="meta">{meta}</p>
        <h1 className="mt-3 max-w-[24ch]">{title}</h1>
        <p className="mt-4 max-w-[62ch] text-[17px] leading-relaxed text-[var(--color-text)]">{lede}</p>
      </div>
    </header>
  );
}
