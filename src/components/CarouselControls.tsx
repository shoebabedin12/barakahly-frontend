import { IconChevronDown } from "./icons";

const arrowClass =
  "absolute z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white text-dark shadow-md transition hover:scale-105 hover:bg-background sm:flex dark:border-white/10 dark:bg-elevated";

/** Previous/next buttons for a scrolling row; each shows only when there's more in that direction. */
export function CarouselArrows({
  label,
  canPrev,
  canNext,
  onPrev,
  onNext,
  top = "top-1/2",
}: {
  label: string;
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  /** Vertical position (Tailwind class), e.g. centred on images rather than the whole card. */
  top?: string;
}) {
  return (
    <>
      {canPrev && (
        <button type="button" onClick={onPrev} aria-label={`Scroll ${label} left`} className={`${arrowClass} ${top} -left-1`}>
          <IconChevronDown className="h-4 w-4 rotate-90" />
        </button>
      )}
      {canNext && (
        <button type="button" onClick={onNext} aria-label={`Scroll ${label} right`} className={`${arrowClass} ${top} -right-1`}>
          <IconChevronDown className="h-4 w-4 -rotate-90" />
        </button>
      )}
    </>
  );
}

/** One dot per visible page; the current one is a wider gold bar. */
export function CarouselDots({ label, page, pageCount, onSelect }: { label: string; page: number; pageCount: number; onSelect: (page: number) => void }) {
  if (pageCount < 2) return null;
  return (
    <div className="mt-4 flex items-center justify-center gap-1.5">
      {Array.from({ length: pageCount }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`${label}: page ${i + 1} of ${pageCount}`}
          aria-current={i === page}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === page ? "w-6 bg-secondary" : "w-1.5 bg-black/20 hover:bg-black/40 dark:bg-white/25 dark:hover:bg-white/50"
          }`}
        />
      ))}
    </div>
  );
}
