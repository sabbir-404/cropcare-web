import { Link, useLocation } from "react-router-dom";
import { clsx } from "../../lib/utils";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/scan", label: "New Scan" },
  { to: "/map", label: "Map" },
  { to: "/history", label: "History" },
  { to: "/settings", label: "Settings" },
];

export default function Nav() {
  const { pathname } = useLocation();
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto max-w-5xl px-6 py-3 flex gap-4 items-center">
        <div className="font-bold text-lg">Smart CropCare</div>
        <div className="flex gap-3 text-sm text-gray-700">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={clsx(
                "px-3 py-1.5 rounded-md hover:bg-gray-100",
                pathname === l.to && "bg-gray-900 text-white hover:bg-gray-900"
              )}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
