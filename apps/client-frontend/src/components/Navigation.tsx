import { Link } from "react-router-dom";


export default function Navigation() {
  return (
    <nav className="p-4 border-b">
      <div className="flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/lessons">Lessons</Link>
        <Link to="/skill-trees">Skill Trees</Link>
        <Link to="/profile">Profile</Link>
      </div>
    </nav>
  );
}