type ContinueCardProps = {
  courseTitle: string;
  lessonTitle: string;
  onResume: () => void;
};

export default function ContinueCard({
  courseTitle,
  lessonTitle,
  onResume,
}: ContinueCardProps) {
  return (
    <div className="flex w-full items-center gap-6 rounded-3xl border border-border bg-card px-6 py-5 text-left text-card-foreground shadow-sm">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center bg-primary/10 [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]">
        <div className="flex h-16 w-16 items-center justify-center bg-primary text-2xl text-primary-foreground [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]">
          ⬡
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Continue · {courseTitle}
        </p>

        <h2 className="mt-1 text-2xl font-semibold text-card-foreground">
          {lessonTitle}
        </h2>
      </div>

      <button
        type="button"
        onClick={onResume}
        className="shrink-0 rounded-2xl px-6 py-3 text-base font-medium shadow-sm transition bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Resume <span className="ml-2">›</span>
      </button>
    </div>
  );
}
