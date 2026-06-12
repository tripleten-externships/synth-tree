import { NavLink } from "react-router-dom";

const tabs = [
  { label: "Home", to: "/" },
  { label: "Catalog", to: "/skill-trees" },
  { label: "Profile", to: "/profile" },
];

export default function BottomTabBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white shadow-lg md:hidden">
      <div className="mx-auto grid h-16 max-w-md grid-cols-3">
        {tabs.map(({ label, to }) => (
          <NavLink
            key={label}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              [
                "flex items-center justify-center text-sm font-medium transition-colors",
                isActive ? "text-[#212121]" : "text-gray-500",
              ].join(" ")
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
