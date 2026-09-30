type StatPillProps = {
  icon: string;
  value: number;
  variant: "streak" | "xp";
};

export default function StatPill({
  icon,
  value,
  variant,
}: StatPillProps) {
  const isZero = value === 0;

  const variantStyles = {
    streak: "bg-orange-50 text-orange-600",
    xp: "bg-blue-50 text-blue-600",
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${
        isZero
          ? "bg-muted text-muted-foreground"
          : variantStyles[variant]
      }`}
    >
      <span aria-hidden="true">{icon}</span>
      <span>{value.toLocaleString()}</span>
    </div>
  );
}
