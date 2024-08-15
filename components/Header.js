import Link from "next/link";
import { useState, useEffect } from "react";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/check-auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          setIsAuthenticated(true);
          const data = await response.json();
          setIsAdmin(data.isAdmin);
        }
      } catch (error) {
        console.error("Failed to check authentication:", error);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      setIsAuthenticated(false);
    });
  };

  return (
    <nav className="navbar bg-primary">
      <div className="container">
        <Link href="/" className="navbar-brand text-white">
          TDList
        </Link>
        {isAuthenticated ? (
          <Link href="/tasks" className="text-white text-decoration-none p-2">
            Tasks
          </Link>
        ) : null}
        {isAdmin ? (
          <Link
            href="/admin/users"
            className="text-white text-decoration-none p-2"
          >
            Users
          </Link>
        ) : null}
        <div className="ms-auto d-flex align-items-center">
          {isAuthenticated ? (
            <a
              href="/"
              className="text-white text-decoration-none p-2 pointer"
              onClick={handleLogout}
            >
              Logout
            </a>
          ) : (
            <>
              <Link
                href="/login"
                className="text-white text-decoration-none p-2"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-white text-decoration-none p-2"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
