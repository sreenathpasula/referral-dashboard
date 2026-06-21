import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function Navbar() {
  const navigate = useNavigate();

  function handleLogout() {
    Cookies.remove("jwt_token");
    navigate("/login");
  }

  return (
    <nav className="bg-white-900 text-white px-8 py-4 flex items-center shadow rounded-2xl justify-between">
      <Link
        to="/"
        aria-label="Go to dashboard home"
        className="text-xl font-bold text-indigo-400 no-underline"
      >
        Go Business
      </Link>
      <div className="flex items-center gap-6">
        <nav aria-label="Primary">
          <Link
            to="/"
            className="text-indigo-200 font-semibold bg-indigo-500 rounded-3xl p-2 hover:text-white text-sm"
          >
            Try For Free
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          className="border border-indigo-300 font-bold text-red-800 hover:text-white hover:border-white text-sm px-4 py-1 rounded-lg transition"
        >
          Log out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
