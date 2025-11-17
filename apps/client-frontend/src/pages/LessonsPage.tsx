import Navigation from "../components/Navigation";

export default function LessonsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-4">Lessons</h1>
        <p>Browse and access your lessons</p>
      </main>
    </div>
  );
}
