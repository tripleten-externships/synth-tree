import Navigation from "../components/Navigation";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-4">Home Page</h1>
        <p>Welcome to SynthTree - Your Skill Learning Platform</p>
      </main>
    </div>
  );
}
