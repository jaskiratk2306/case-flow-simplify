import {
  Scale,
  Target,
  Lightbulb,
  Users,
  BookOpen,
  Award,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

function About() {
  const objectives = [
    {
      icon: Target,
      title: "Efficient Case Categorization",
      description:
        "Automatically categorize cases based on complexity, urgency, and type to ensure appropriate handling.",
    },
    {
      icon: Clock,
      title: "Reduced Processing Time",
      description:
        "Minimize delays by routing simple cases through expedited tracks while complex cases receive thorough attention.",
    },
    {
      icon: Users,
      title: "Optimal Resource Allocation",
      description:
        "Match judicial resources with case requirements for maximum efficiency and better outcomes.",
    },
    {
      icon: Lightbulb,
      title: "Transparency & Accountability",
      description:
        "Provide clear visibility into case status, timelines, and procedures for all stakeholders.",
    },
  ];

  const principles = [
    {
      title: "Proportionality",
      description:
        "The level of case management should be proportionate to the complexity and value of the case.",
    },
    {
      title: "Early Intervention",
      description:
        "Cases are assessed and categorized early to determine the appropriate track and resources.",
    },
    {
      title: "Flexibility",
      description:
        "Cases can be moved between tracks if circumstances change during proceedings.",
    },
    {
      title: "Continuous Monitoring",
      description:
        "Regular tracking ensures cases stay on schedule and bottlenecks are identified early.",
    },
  ];

  const flowSteps = [
    {
      step: "1",
      title: "Case Filing",
      description: "Case is submitted with all relevant documentation",
    },
    {
      step: "2",
      title: "Assessment",
      description: "Case complexity and requirements are evaluated",
    },
    {
      step: "3",
      title: "Track Assignment",
      description: "Case is assigned to Fast, Standard, or Complex track",
    },
    {
      step: "4",
      title: "Processing",
      description: "Case proceeds according to track-specific timelines",
    },
    {
      step: "5",
      title: "Resolution",
      description: "Case is resolved and documented",
    },
  ];

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6">
              About Differentiated Case Flow Management
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Understanding the principles and methodology behind efficient case
              management in the modern judicial system.
            </p>
          </div>
        </div>
      </section>

      {/* What is DCFM */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                <BookOpen className="h-4 w-4" />
                <span className="text-sm font-medium">Definition</span>
              </div>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-6">
                What is Differentiated Case Flow Management?
              </h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Differentiated Case Flow Management (DCFM) is a judicial
                administration approach that recognizes that not all cases are
                alike and should not be managed identically.
              </p>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Instead of a one-size-fits-all approach, DCFM categorizes cases
                into different "tracks" based on their complexity, the number of
                parties involved, the nature of issues, and the expected time
                required for resolution.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This approach ensures that simple cases move quickly through the
                system while complex cases receive the time and attention they
                require, optimizing the use of judicial resources and improving
                overall efficiency.
              </p>
            </div>
            <div className="bg-background p-8 rounded-2xl border border-border">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-primary p-3 rounded-xl">
                  <Scale className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-foreground">
                    Core Philosophy
                  </h3>
                  <p className="text-muted-foreground">
                    Right resources for the right case
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                {principles.map((principle, index) => (
                  <div
                    key={index}
                    className="p-4 bg-muted/50 rounded-lg border border-border"
                  >
                    <h4 className="font-semibold text-foreground mb-1">
                      {principle.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {principle.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Key Objectives
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The primary goals of implementing differentiated case flow
              management in the judicial system.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {objectives.map((objective, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-xl border border-border flex gap-4"
              >
                <div className="bg-primary/10 p-3 rounded-lg h-fit">
                  <objective.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                    {objective.title}
                  </h3>
                  <p className="text-muted-foreground">{objective.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flow Process */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              The Case Flow Process
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              How cases move through the differentiated case flow management
              system.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-start">
            {flowSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="bg-card p-6 rounded-xl border border-border text-center min-w-[180px]">
                  <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center font-bold mx-auto mb-3">
                    {step.step}
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                {index < flowSteps.length - 1 && (
                  <ArrowRight className="h-6 w-6 text-primary hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-4">
              <Award className="h-4 w-4" />
              <span className="text-sm font-medium">Benefits</span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              Why DCFM Matters
            </h2>
            <div className="text-muted-foreground space-y-4 text-left">
              <p>
                <strong className="text-foreground">
                  For the Judiciary:
                </strong>{" "}
                Better resource allocation, reduced backlog, improved efficiency,
                and enhanced performance metrics.
              </p>
              <p>
                <strong className="text-foreground">For Litigants:</strong>{" "}
                Faster resolution for simple cases, appropriate attention for
                complex matters, and greater predictability in timelines.
              </p>
              <p>
                <strong className="text-foreground">
                  For Legal Practitioners:
                </strong>{" "}
                Clear expectations, better case preparation, and more efficient
                court time utilization.
              </p>
              <p>
                <strong className="text-foreground">For Society:</strong>{" "}
                Improved access to justice, enhanced public confidence in the
                judicial system, and cost-effective dispute resolution.
              </p>
            </div>
            <Link
              to="/cases"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity mt-8"
            >
              Explore Case Registry
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Add missing import
import { Clock } from "lucide-react";

export default About;
