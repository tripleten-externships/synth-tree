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
    <div className="flex w-full items-center gap-6 rounded-3xl border border-gray-200 bg-white px-6 py-5 text-left shadow-sm">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center bg-blue-50 [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]">
        <div className="flex h-16 w-16 items-center justify-center bg-blue-500 text-2xl text-white [clip-path:polygon(25%_6.7%,75%_6.7%,100%_50%,75%_93.3%,25%_93.3%,0%_50%)]">
          ⬡
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
          Continue · {courseTitle}
        </p>

        <h2 className="mt-1 text-2xl font-semibold text-gray-900">
          {lessonTitle}
        </h2>
      </div>

      <button
        type="button"
        onClick={onResume}
        className="shrink-0 rounded-2xl bg-blue-500 px-6 py-3 text-base font-medium text-white shadow-sm transition hover:bg-blue-600"
      >
        Resume <span className="ml-2">›</span>
      </button>
    </div>
  );
}
