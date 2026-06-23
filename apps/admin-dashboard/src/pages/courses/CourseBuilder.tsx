function CourseBuilder() {
  return (
        <div className="grid min-h-[calc(100vh-6rem)] grid-cols-1 gap-4 py-4 lg:grid-cols-[300px_1fr_320px]">
      <aside className="rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold">Course Meta</h2>
        <p className="text-sm text-muted-foreground">
          Course meta editor will go here.
        </p>
      </aside>

      <section className="rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold">Tree Canvas</h2>
        <p className="text-sm text-muted-foreground">
          Empty tree canvas.
        </p>
      </section>

      <aside className="rounded-lg border bg-card p-4">
        <h2 className="text-lg font-semibold">Inspector</h2>
        <p className="text-sm text-muted-foreground">
          Inspector pane.
        </p>
      </aside>
    </div>
  );
}

export default CourseBuilder;
