import { NavLink, useNavigate } from "react-router-dom";
import { Logo } from "../components/common";
import { useAuth } from "../auth/AuthContext";

const navigation = [
  ["/admin/dashboard", "Dashboard"],
  ["/admin/books", "Books"],
  ["/admin/books/new", "Add Book"],
  ["/admin/submissions", "Submissions"],
  ["/admin/published", "Published Books"],
  ["/admin/settings", "Settings"],
];

export default function AdminLayout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Logo light />
        <nav className="admin-nav">
          {navigation.map(([path, label]) => (
            <NavLink key={path} to={path}>{label}</NavLink>
          ))}
        </nav>
        <button className="admin-logout" onClick={handleLogout}>
          ↪ Logout
        </button>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <span>Admin Panel</span>
          <span className="admin-user">● Administrator</span>
        </header>
        {children}
      </div>
    </div>
  );
}
