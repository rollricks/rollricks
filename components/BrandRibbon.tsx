// Gold ribbon under the hero: what we serve, on a slow loop.
const WORDS = ["Rolls", "Tandoor", "Chinese", "Snacks", "Mojitos", "Sealed with Taste", "Katanga · Jabalpur"];

export default function BrandRibbon() {
  const row = [...WORDS, ...WORDS];
  return (
    <div className="relative z-[3] bg-accent text-on-accent overflow-hidden border-y border-black/10" aria-hidden="true">
      <div className="flex w-max marquee py-2.5">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0">
            {row.map((w, i) => (
              <span key={`${k}-${i}`} className="flex items-center font-display font-black uppercase tracking-wide text-sm sm:text-base px-4">
                {w}
                <span className="ml-8 text-base opacity-60">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
