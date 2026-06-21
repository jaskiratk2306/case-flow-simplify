import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Scale,
  Mail,
  Lock,
  User,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("LAWYER");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const result = await register(email, password, name, role);
    setSubmitting(false);

    if (result.success) {
      navigate("/cases");
    } else {
      setError(result.error);
    }
  };

  const roles = [
    {
      value: "LAWYER",
      label: "Lawyer / Litigant",
      description: "File and manage cases",
      icon: "⚖️",
    },
    {
      value: "JUDGE",
      label: "Judge / Judicial Admin",
      description: "Adjudicate and assign cases",
      icon: "🏛️",
    },
  ];

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-hero-gradient py-12 px-4 relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-15%] left-[-8%] w-[40vw] h-[40vw] bg-accent/10 rounded-full blur-[100px] animate-pulse-glow" />
        <div
          className="absolute bottom-[-10%] right-[-5%] w-[35vw] h-[35vw] bg-primary/10 rounded-full blur-[90px] animate-pulse-glow"
          style={{ animationDelay: "1.5s" }}
        />
      </div>

      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Card */}
        <div className="glass-card rounded-3xl p-8 border border-border/60 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 btn-primary rounded-2xl flex items-center justify-center mb-5 shadow-glow-primary">
              <Scale className="h-7 w-7" style={{ color: "hsl(36 40% 96%)" }} />
            </div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-2">
              Create Account
            </h1>
            <p className="text-muted-foreground text-sm">
              Join CaseFlow and modernize your practice
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="flex items-center gap-3 bg-destructive/10 text-destructive text-sm p-4 rounded-xl border border-destructive/20 mb-6 animate-fade-in">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label htmlFor="reg-name" className="block text-sm font-semibold text-foreground mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Atty. Sarah Miller"
                  className="input-premium pl-10 pr-4 py-3 text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="block text-sm font-semibold text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <input
                  id="reg-email"
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
              <label htmlFor="reg-password" className="block text-sm font-semibold text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="input-premium pl-10 pr-11 py-3 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Role Selector */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    id={`role-${r.value.toLowerCase()}`}
                    onClick={() => setRole(r.value)}
                    className={`relative p-4 rounded-xl border text-left transition-all duration-200 ${
                      role === r.value
                        ? "border-primary/50 bg-primary/10 ring-2 ring-primary/20"
                        : "border-border bg-background hover:bg-muted/50 hover:border-primary/30"
                    }`}
                  >
                    {role === r.value && (
                      <span className="absolute top-2.5 right-2.5">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </span>
                    )}
                    <span className="text-xl mb-2 block">{r.icon}</span>
                    <p className="text-xs font-bold text-foreground leading-tight">{r.label}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{r.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              id="register-submit-btn"
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3.5 rounded-xl text-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-primary hover:opacity-80 transition-opacity"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Protected by judiciary-grade encryption
        </p>
      </div>
    </div>
  );
}

export default Register;
