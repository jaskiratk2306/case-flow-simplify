import { Link } from "react-router-dom";
import {
  Scale,
  Clock,
  Users,
  FileText,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Shield,
  Activity,
  Zap,
  TrendingUp,
  Sparkles,
  ChevronRight,
} from "lucide-react";

function Home() {
  const features = [
    {
      icon: Clock,
      title: "Faster Processing",
      description:
        "Reduce case processing time by categorizing cases based on complexity and urgency.",
      gradient: "from-blue-500/10 to-cyan-500/10",
      iconGradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Users,
      title: "Resource Optimization",
      description:
        "Allocate judicial resources efficiently based on case requirements and court capacity.",
      gradient: "from-violet-500/10 to-purple-500/10",
      iconGradient: "from-violet-500 to-purple-500",
    },
    {
      icon: FileText,
      title: "Streamlined Workflow",
      description:
        "Standardized procedures for different case categories ensure consistency and fairness.",
      gradient: "from-emerald-500/10 to-teal-500/10",
      iconGradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: BarChart3,
      title: "Data-Driven Insights",
      description:
        "Track case progress and identify bottlenecks with comprehensive analytics dashboards.",
      gradient: "from-amber-500/10 to-orange-500/10",
      iconGradient: "from-amber-500 to-orange-500",
    },
  ];

  const caseTypes = [
    {
      type: "Fast Track",
      badge: "≤ 30 days",
      color: "from-emerald-500 to-teal-400",
      glowColor: "shadow-emerald-500/15",
      textColor: "text-emerald-500",
      borderColor: "border-emerald-500/20",
      bgColor: "bg-emerald-500/5",
      description: "Expedited resolution for simple matters",
      examples: "Minor disputes, documentation cases",
      icon: "⚡",
    },
    {
      type: "Standard Track",
      badge: "≤ 90 days",
      color: "from-blue-500 to-indigo-500",
      glowColor: "shadow-blue-500/15",
      textColor: "text-blue-500",
      borderColor: "border-blue-500/20",
      bgColor: "bg-blue-500/5",
      description: "Regular cases with defined timelines",
      examples: "Civil matters, contract disputes",
      icon: "📋",
      featured: true,
    },
    {
      type: "Complex Track",
      badge: "90+ days",
      color: "from-amber-500 to-orange-500",
      glowColor: "shadow-amber-500/15",
      textColor: "text-amber-500",
      borderColor: "border-amber-500/20",
      bgColor: "bg-amber-500/5",
      description: "Multi-party cases requiring extensive review",
      examples: "Corporate litigation, class actions",
      icon: "⚖️",
    },
  ];

  const benefits = [
    "Reduced case backlog",
    "Improved judicial efficiency",
    "Better resource allocation",
    "Enhanced transparency",
    "Faster dispute resolution",
    "Improved public satisfaction",
  ];

  const stats = [
    { label: "Cases Processed", value: "12,400+", sub: "across all tracks" },
    { label: "Avg. Resolution", value: "28 days", sub: "faster than average" },
    { label: "Court Efficiency", value: "94%", sub: "satisfaction rate" },
    { label: "Active Judges", value: "380+", sub: "on the platform" },
  ];

  return (
    <div className="relative overflow-x-hidden">
      {/* Ambient background orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-15%] left-[-10%] w-[50vw] h-[50vw] bg-primary/8 rounded-full blur-[120px] animate-pulse-glow" />
        <div
          className="absolute top-[35%] right-[-15%] w-[45vw] h-[45vw] bg-accent/6 rounded-full blur-[140px] animate-pulse-glow"
          style={{ animationDelay: "2.5s" }}
        />
        <div
          className="absolute bottom-[10%] left-[20%] w-[35vw] h-[35vw] bg-blue-500/5 rounded-full blur-[100px] animate-pulse-glow"
          style={{ animationDelay: "1.2s" }}
        />
      </div>

      {/* ── HERO ── */}
      <section className="relative py-28 md:py-36 border-b border-border/30 bg-hero-gradient overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in">
              <Sparkles className="h-3.5 w-3.5" />
              Modernizing Judiciary Management
              <Sparkles className="h-3.5 w-3.5" />
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-foreground mb-6 leading-[1.05] tracking-tight animate-fade-in delay-100">
              Differentiated
              <br />
              <span className="text-gradient">Case Flow</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-medium animate-fade-in delay-200">
              Streamline court operations with intelligent case categorization. Prioritize, track, and resolve legal matters efficiently.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in delay-300">
              <Link
                id="hero-cta-primary"
                to="/cases"
                className="btn-primary w-full sm:w-auto px-8 py-4 text-base rounded-2xl"
              >
                Launch Dashboard
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>
              <Link
                id="hero-cta-secondary"
                to="/about"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 glass text-foreground border border-border/60 px-8 py-4 rounded-2xl font-bold text-base hover:bg-muted/60 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300"
              >
                Read the Framework
                <ChevronRight className="h-4.5 w-4.5 text-muted-foreground" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="border-b border-border/30 bg-card/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border/50 divide-y lg:divide-y-0">
            {stats.map((stat, i) => (
              <div key={i} className="px-8 py-8 text-center">
                <p className="text-3xl md:text-4xl font-extrabold text-gradient mb-1">
                  {stat.value}
                </p>
                <p className="text-sm font-bold text-foreground">{stat.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
              Core Capabilities
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
              Built for Modern Justice
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-medium">
              Precision tools for every stage of the legal process — from filing to resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`glow-card glass-card p-7 rounded-2xl hover:-translate-y-2 transition-all duration-300 group bg-gradient-to-br ${feature.gradient}`}
              >
                <div
                  className={`bg-gradient-to-tr ${feature.iconGradient} text-white p-3.5 rounded-xl w-fit mb-5 shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  <feature.icon className="h-5.5 w-5.5" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2.5">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CASE TRACKS ── */}
      <section className="py-28 bg-muted/20 border-y border-border/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
              Routing Tracks
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
              Smart Case Scheduling
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-medium">
              Intelligent routing categories match each case to the ideal judicial timeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {caseTypes.map((track, index) => (
              <div
                key={index}
                className={`relative glass-card rounded-3xl overflow-hidden border ${track.borderColor} hover:scale-[1.02] hover:shadow-xl ${track.glowColor} transition-all duration-300 ${
                  track.featured ? "ring-1 ring-blue-500/30 shadow-lg shadow-blue-500/10" : ""
                }`}
              >
                {track.featured && (
                  <div className="absolute top-4 right-4 text-[10px] font-extrabold uppercase tracking-wider bg-blue-500 text-white px-2.5 py-1 rounded-full">
                    Popular
                  </div>
                )}
                {/* Top bar */}
                <div className={`h-1.5 bg-gradient-to-r ${track.color}`} />
                <div className="p-7">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-3xl mb-3 block">{track.icon}</span>
                      <h3 className={`text-2xl font-extrabold ${track.textColor}`}>
                        {track.type}
                      </h3>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border ${track.borderColor} ${track.bgColor} ${track.textColor}`}>
                      {track.badge}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm font-medium mb-5 leading-relaxed">
                    {track.description}
                  </p>
                  <div className={`${track.bgColor} border ${track.borderColor} p-4 rounded-2xl`}>
                    <span className="text-xs font-bold text-foreground block mb-1">
                      Typical cases:
                    </span>
                    <span className="text-xs text-muted-foreground">{track.examples}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS + STATS ── */}
      <section className="py-28 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
                Why CaseFlow
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-6 leading-tight">
                End Docket Backlogs for Good
              </h2>
              <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
                Treating all cases identically creates bottlenecks. Our differentiated routing ensures minor matters close quickly, preserving judicial bandwidth for complex litigation.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                    </div>
                    <span className="text-foreground text-sm font-semibold">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics card */}
            <div className="glass-card p-8 rounded-3xl border border-border/60 shadow-2xl relative overflow-hidden">
              <div className="absolute -right-20 -top-20 w-48 h-48 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -left-10 -bottom-10 w-36 h-36 bg-accent/8 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-4 mb-8">
                <div className="btn-primary p-3.5 rounded-2xl">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-foreground">Judicial Integrity</h3>
                  <p className="text-xs text-muted-foreground font-bold tracking-wider uppercase mt-0.5">
                    Data-Verified Performance
                  </p>
                </div>
              </div>

              <div className="space-y-7">
                {[
                  { label: "Case Resolution Rate", value: "+45%", icon: TrendingUp, color: "text-emerald-500", barColor: "from-emerald-400 to-teal-500", width: "75%" },
                  { label: "Processing Time", value: "-35%", icon: Zap, color: "text-primary", barColor: "from-primary to-indigo-500", width: "65%" },
                  { label: "Courtroom Performance", value: "+60%", icon: Activity, color: "text-accent", barColor: "from-accent to-pink-500", width: "80%" },
                ].map((metric, i) => (
                  <div key={i} className="space-y-2.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground font-semibold flex items-center gap-2">
                        <metric.icon className={`h-4 w-4 ${metric.color}`} />
                        {metric.label}
                      </span>
                      <span className={`font-extrabold text-base ${metric.color}`}>{metric.value}</span>
                    </div>
                    <div className="bg-muted/70 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`bg-gradient-to-r ${metric.barColor} h-full rounded-full transition-all duration-700`}
                        style={{ width: metric.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-5xl mx-auto text-center">
            <div className="btn-primary absolute inset-0 rounded-3xl opacity-100 -z-10 blur-none" style={{ background: "linear-gradient(135deg, hsl(234 89% 55%), hsl(262 83% 55%), hsl(310 80% 55%))" }} />
            <div className="relative bg-gradient-to-br from-primary via-indigo-700 to-accent rounded-3xl p-12 md:p-20 border border-white/10 shadow-2xl overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -left-16 -bottom-16 w-56 h-56 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -right-16 -top-16 w-56 h-56 bg-white/8 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/20 rounded-full blur-[80px] pointer-events-none" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 text-xs font-bold uppercase tracking-wider mb-6">
                  <Scale className="h-3.5 w-3.5" />
                  Ready to modernize your court?
                </div>
                <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-5 tracking-tight leading-tight">
                  Streamline Court
                  <br />
                  Operations Today
                </h2>
                <p className="text-white/75 mb-10 max-w-2xl mx-auto text-base md:text-lg font-medium leading-relaxed">
                  Experience differentiated case scheduling from the perspective of a Lawyer or Judge. No setup required.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    id="cta-dashboard-link"
                    to="/cases"
                    className="inline-flex items-center justify-center gap-2 bg-white text-foreground hover:bg-slate-50 px-8 py-4 rounded-2xl font-bold shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.99]"
                  >
                    Access Cases Dashboard
                    <ArrowRight className="h-4.5 w-4.5 text-primary" />
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white hover:bg-white/15 px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-[1.02]"
                  >
                    Create Free Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
