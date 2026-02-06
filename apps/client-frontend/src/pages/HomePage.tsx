import { useNavigate } from "react-router-dom";
import { Button } from "@skilltree/ui";
import Navigation from "../components/Navigation";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to SynthTree
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your Skill Learning Platform
          </p>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 border rounded-lg">
              <h2 className="text-2xl font-semibold mb-2">Browse Courses</h2>
              <p className="text-muted-foreground mb-4">
                Discover and enroll in courses to enhance your skills
              </p>
              <Button onClick={() => navigate("/courses")}>
                View Course Catalog
              </Button>
            </div>

            <div className="p-6 border rounded-lg">
              <h2 className="text-2xl font-semibold mb-2">Your Dashboard</h2>
              <p className="text-muted-foreground mb-4">
                Track your progress and manage your learning journey
              </p>
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </Button>
            </div>

            <div className="p-6 border rounded-lg">
              <h2 className="text-2xl font-semibold mb-2">Skill Trees</h2>
              <p className="text-muted-foreground mb-4">
                Explore interactive learning paths and skill progressions
              </p>
              <Button variant="outline" onClick={() => navigate("/skill-trees")}>
                View Skill Trees
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
