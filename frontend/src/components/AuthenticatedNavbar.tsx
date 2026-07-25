import "./AuthenticatedNavbar.css";

interface AuthenticatedNavbarProps {
  userName: string;
  onLogout: () => void;
}

export default function AuthenticatedNavbar({
  userName,
  onLogout,
}: AuthenticatedNavbarProps) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <button
          className="navbar-brand"
          type="button"
        >
          <span className="navbar-brand-mark">
            ✦
          </span>

          <span className="navbar-brand-name">
            QHAPAQ
          </span>
        </button>

        <div className="navbar-actions">
          <span className="navbar-user">
            Hola, <strong>{userName}</strong>
          </span>

          <button
            className="navbar-logout"
            type="button"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
