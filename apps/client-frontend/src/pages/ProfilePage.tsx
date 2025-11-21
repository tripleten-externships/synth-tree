import Navigation from "../components/Navigation";

export default function ProfilePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-4">Profile</h1>
        <p>Manage your profile and account settings</p>
      </main>
    </div>
  );
}
