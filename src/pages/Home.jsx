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
} from "lucide-react";

function Home() {
  const features = [
    {
      icon: Clock,
      title: "Faster Processing",
      description:
        "Reduce case processing time by categorizing cases based on complexity and urgency.",
    },
    {
      icon: Users,
      title: "Resource Optimization",
      description:
        "Allocate judicial resources efficiently based on case requirements.",
    },
    {
      icon: FileText,
      title: "Streamlined Workflow",
      description:
        "Standardized procedures for different case categories ensure consistency.",
    },
    {
      icon: BarChart3,
      title: "Data-Driven Insights",
      description:
        "Track case progress and identify bottlenecks with comprehensive analytics.",
    },
  ];

  const caseTypes = [
    {
      type: "Fast Track",
      color: "bg-success",
      description: "Simple cases resolved within 30 days",
      examples: "Minor disputes, documentation cases",
    },
    {
      type: "Standard Track",
      color: "bg-info",
      description: "Regular cases with 90-day timeline",
      examples: "Civil matters, contract disputes",
    },
    {
      type: "Complex Track",
      color: "bg-warning",
      description: "Multi-party cases requiring extensive review",
      examples: "Corporate litigation, class actions",
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

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Scale className="h-4 w-4" />
              <span className="text-sm font-medium">
                Modernizing Case Management
              </span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Differentiated Case Flow{" "}
              <span className="text-primary">Management</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Streamline the listing of cases through an intelligent
              differentiated approach. Categorize, prioritize, and manage cases
              efficiently for faster resolution and optimal resource utilization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/cases"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                View Cases
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 bg-card text-foreground border border-border px-8 py-3 rounded-lg font-medium hover:bg-muted transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Key Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our differentiated case flow management system brings efficiency
              and transparency to the judicial process.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-background p-6 rounded-xl border border-border hover:shadow-lg transition-shadow"
              >
                <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Tracks Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Case Track Categories
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Cases are categorized into different tracks based on complexity,
              ensuring appropriate handling and timely resolution.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {caseTypes.map((track, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-xl border border-border overflow-hidden relative"
              >
                <div
                  className={`${track.color} h-1 absolute top-0 left-0 right-0`}
                />
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2 mt-2">
                  {track.type}
                </h3>
                <p className="text-muted-foreground mb-4">{track.description}</p>
                <p className="text-sm text-foreground">
                  <span className="font-medium">Examples:</span> {track.examples}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Differentiated Case Flow Management?
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Traditional case management treats all cases equally, leading to
                inefficiencies. Our differentiated approach ensures that simple
                cases move quickly while complex cases receive the attention they
                deserve.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card p-8 rounded-2xl border border-border">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-primary p-3 rounded-xl">
                  <Shield className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-foreground">
                    Justice Made Efficient
                  </h3>
                  <p className="text-muted-foreground">
                    Serving the community better
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Case Resolution Rate
                  </span>
                  <span className="font-semibold text-foreground">+45%</span>
                </div>
                <div className="bg-muted rounded-full h-2 overflow-hidden">
                  <div className="bg-primary h-full w-3/4 rounded-full" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Processing Time</span>
                  <span className="font-semibold text-foreground">-35%</span>
                </div>
                <div className="bg-muted rounded-full h-2 overflow-hidden">
                  <div className="bg-accent h-full w-2/3 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Streamline Your Cases?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Explore our case management system and see how differentiated case
            flow can transform judicial efficiency.
          </p>
          <Link
            to="/cases"
            className="inline-flex items-center gap-2 bg-card text-foreground px-8 py-3 rounded-lg font-medium hover:bg-muted transition-colors"
          >
            Explore Cases
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
