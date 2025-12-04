export default function Footer() {
  return (
    <footer className="border-t bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} SkillTree</span>
        <span>More courses coming soon</span>
      </div>
    </footer>
  );
}
