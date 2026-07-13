import { Link, Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col p-6">
        <h1 className="text-3xl font-bold mb-10">
          📄 DocuMind
        </h1>

        <nav className="flex flex-col gap-4 text-lg">
          <Link to="/dashboard">🏠 Dashboard</Link>

          <Link to="/upload">⬆ Upload</Link>

          <Link to="/documents">📁 My Documents</Link>

          <Link to="/chat">💬 AI Chat</Link>
        </nav>

        <button
          onClick={logout}
          className="mt-auto bg-red-500 rounded-lg py-3 hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
