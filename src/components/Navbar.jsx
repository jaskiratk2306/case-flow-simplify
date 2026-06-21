import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Scale, Menu, X, LogOut, User as UserIcon, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/cases", label: "Cases" },
    { path: "/about", label: "About" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "glass border-b border-border/50 shadow-lg shadow-black/5"
          : "bg-background/70 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" id="nav-logo" className="flex items-center gap-3 group">
            <div className="btn-primary p-2.5 rounded-xl shadow-glow-primary group-hover:scale-105 transition-transform duration-200">
              <Scale className="h-5 w-5" style={{ color: "hsl(36 40% 96%)" }} />
            </div>
            <div>
              <p className="text-lg font-extrabold text-gradient leading-none tracking-tight">
                CaseFlow
              </p>
              <p className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground font-bold leading-none mt-0.5">
                Judiciary OS
              </p>
            </div>
          </Link>

          {/* ── Desktop Navigation ── */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  id={`nav-link-${link.label.toLowerCase()}`}
                  className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive(link.path)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gradient-to-r from-primary to-accent" />
                  )}
                </Link>
              ))}
            </div>

            {/* Auth + Theme area */}
            <div className="flex items-center gap-3 pl-5 border-l border-border/70">
              {/* Theme toggle */}
              <button
                id="theme-toggle-btn"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-amber-400" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>

              {user ? (
                <>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-muted/60 border border-border/50">
                    <div className="btn-primary p-1.5 rounded-lg">
                      <UserIcon className="h-3.5 w-3.5" style={{ color: "hsl(36 40% 96%)" }} />
                    </div>
                    <div className="leading-none">
                      <p className="text-xs font-bold text-foreground">{user.name}</p>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-primary/80">
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <button
                    id="nav-logout-btn"
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive px-3 py-2 rounded-lg hover:bg-destructive/10 transition-all duration-200"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    id="nav-signin-link"
                    className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-muted/60"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    id="nav-register-btn"
                    className="btn-primary px-5 py-2.5 text-sm rounded-xl"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* ── Mobile right side ── */}
          <div className="md:hidden flex items-center gap-2">
            {/* Theme toggle (mobile) */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-lg transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-amber-400" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            <button
              id="nav-mobile-toggle"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation"
              className="p-2 text-foreground hover:bg-muted/70 rounded-lg transition-colors"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Navigation Drawer ── */}
        {isOpen && (
          <div className="md:hidden border-t border-border/40 pt-4 pb-5 mt-1 animate-fade-in">
            <div className="flex flex-col gap-1 mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                    isActive(link.path)
                      ? "text-primary bg-primary/10 border border-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-border/40 pt-4">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-muted/50 border border-border/50">
                    <div className="btn-primary p-2 rounded-lg">
                      <UserIcon className="h-4 w-4" style={{ color: "hsl(36 40% 96%)" }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{user.name}</p>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-primary/80">
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-destructive py-2.5 px-4 rounded-xl hover:bg-destructive/10 transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <Link
                    to="/login"
                    className="text-sm font-semibold text-muted-foreground text-center py-2.5 px-4 hover:bg-muted/60 rounded-xl transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="btn-primary py-3 px-4 text-sm text-center rounded-xl"
                  >
                    Get Started — It's Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
