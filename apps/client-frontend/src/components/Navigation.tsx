import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav aria-label="Primary navigation">
      <div className="flex flex-col gap-2 text-sm font-medium md:flex-row md:gap-6">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/lessons">Lessons</Link>
        <Link to="/skill-trees">Skill Trees</Link>
        <Link to="/profile">Profile</Link>
      </div>
    </nav>
  );
}
