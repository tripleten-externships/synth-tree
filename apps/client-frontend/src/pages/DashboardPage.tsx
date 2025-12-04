import Navigation from "../components/Navigation";

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p>Your learning dashboard and progress overview</p>
      </main>
    </div>
  );
}
