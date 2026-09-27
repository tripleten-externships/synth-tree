// SYN-66: TEMPORARY placeholder node visual.
//
// This is a deliberately minimal stand-in so the drag-to-reposition feature
// (SYN-66) can render and persist positions on its own. The real skill-node
// component — with icon, XP, boss state, add-child affordance — is owned by
// SYN-65 ("Admin: tree canvas — add child node"). When SYN-65 lands, replace
// this chip inside SkillNodeCanvas with that component; the drag wrapper and
// useNodeDrag hook stay as-is.

interface SkillNodeChipProps {
  title: string;
  dragging?: boolean;
}

export function SkillNodeChip({ title, dragging = false }: SkillNodeChipProps) {
  return (
    <div
      className={`flex h-16 w-16 select-none items-center justify-center rounded-full border-2 bg-card p-1 text-center text-[10px] font-medium leading-tight text-foreground shadow-sm transition-shadow ${
        dragging ? "border-primary shadow-md" : "border-border"
      }`}
      title={title}
    >
      <span className="line-clamp-3 break-words">{title}</span>
    </div>
  );
}

export default SkillNodeChip;
