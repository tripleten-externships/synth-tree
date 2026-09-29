import { Link } from "react-router-dom";

export default function Navigation() {
  return (
    <nav aria-label="Primary navigation">
      <div className="flex flex-col gap-2 text-sm font-medium md:flex-row md:gap-6">
        {/* Dashboard, Lessons and Skill Trees are still stub pages; link them once they're built. */}
        <Link to="/">Home</Link>
        <Link to="/catalog">Catalog</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        <Link to="/profile">Profile</Link>
      </div>
    </nav>
  );
}
