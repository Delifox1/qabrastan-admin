import { Link, Outlet, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useAuth } from "../context/AuthContext";

function Layout() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <h2>Qabrastan Admin</h2>

        <div className="nav-links">

          <Link to="/">
            Dashboard
          </Link>

          {user?.role ===
            "super_admin" && (
            <>
              <Link to="/cemeteries">
                Cemeteries
              </Link>

              <Link to="/admins">
                Manage Admins
              </Link>
            </>
          )}

          <Link to="/add-grave">
            Add Grave
          </Link>

          <Link to="/view-graves">
            View Graves
          </Link>

          <Link to="/new-announcement">
            New Announcement
          </Link>

          <Link to="/view-announcements">
            View Announcements
          </Link>


          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>
      </nav>

      <div className="page-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;