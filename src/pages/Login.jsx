import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Scale, Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      navigate("/cases");
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-hero-gradient py-12 px-4 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-primary/8 rounded-full blur-[100px] animate-pulse-glow" />
        <div
          className="absolute bottom-[-10%] left-[-5%] w-[35vw] h-[35vw] bg-accent/6 rounded-full blur-[90px] animate-pulse-glow"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Card */}
        <div className="glass-card rounded-3xl p-8 border border-border/60 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 btn-primary rounded-2xl flex items-center justify-center mb-5 shadow-glow-primary">
              <Scale className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-muted-foreground text-sm">
              Sign in to your CaseFlow account
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="flex items-center gap-3 bg-destructive/8 text-destructive text-sm p-4 rounded-xl border border-destructive/20 mb-6 animate-fade-in">
              <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-semibold text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@court.gov"
                  className="input-premium pl-10 pr-4 py-3 text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="block text-sm font-semibold text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-premium pl-10 pr-10 py-3 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3.5 rounded-xl text-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </button>
          </form>

          {/* Footer link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-primary hover:text-primary/80 transition-colors"
              >
                Create one free
              </Link>
            </p>
          </div>
        </div>

        {/* Subtle footnote */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Protected by judiciary-grade encryption
        </p>
      </div>
    </div>
  );
}

export default Login;
