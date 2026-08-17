import { createFileRoute, Outlet, redirect, Link, useNavigate } from "@tanstack/react-router";
import { isAuthenticated, logout } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    if (!isAuthenticated() && location.pathname !== "/admin/login") {
      throw redirect({
        to: "/admin/login",
      });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/admin/login" });
  };

  // Skip layout for login page
  if (window.location.pathname === "/admin/login") {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-[#0f2266] text-white flex flex-col">
        <div className="p-6">
          <Link to="/">
            <h1 className="text-xl font-['Montserrat'] font-black tracking-wider hover:text-gray-300">
              NNA VITTALO
            </h1>
          </Link>
          <div className="text-xs text-white/50 mt-1 uppercase tracking-widest">Admin Panel</div>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link
            to="/admin/packages"
            className="block px-4 py-3 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors [&.active]:bg-white/20"
          >
            📦 Packages
          </Link>
          <Link
            to="/admin/bookings"
            className="block px-4 py-3 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors [&.active]:bg-white/20"
          >
            📝 Bookings
          </Link>
        </nav>
        <div className="p-4 mt-auto border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>🚪 Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden h-screen">
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
