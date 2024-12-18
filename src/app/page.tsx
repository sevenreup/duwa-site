import { Logo } from "@/components/logo";
import { ModeSwitcher } from "@/components/mode-switcher";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import {
  Github,
  Book,
  PlayCircle,
  Code2,
  Laptop,
  Users,
  Globe,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Native Language Programming",
    description:
      "Write code in Chichewa, making programming concepts intuitive and accessible.",
    icon: <Globe className="h-6 w-6 text-primary" />,
  },
  {
    title: "Modern Development",
    description:
      "Built with modern programming principles while preserving cultural authenticity.",
    icon: <Laptop className="h-6 w-6 text-primary" />,
  },
  {
    title: "Community Driven",
    description:
      "Join a growing community of developers bridging tradition and technology.",
    icon: <Users className="h-6 w-6 text-primary" />,
  },
  {
    title: "Educational Focus",
    description:
      "Perfect for teaching programming concepts in a familiar language.",
    icon: <Book className="h-6 w-6 text-primary" />,
  },
];

const codeExample = `ndondomeko pano() {
  lemba("Moni Dziko");
}

pano();`;

const config = {
  playground: "/playground",
  docs: "/docs",
  github: siteConfig.links.github,
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <nav className="flex flex-row flex-wrap items-center justify-between mb-16">
          <div className="flex items-center gap-2">
            <Logo className="h-12 w-12" />
            <span className="text-2xl font-bold hidden md:block">Duwa</span>
          </div>
          <div className="flex gap-4">
            <Link href={config.docs}>
              <Button variant="ghost" className="flex items-center gap-2">
                <Book size={20} />
                <span className="hidden md:block">Docs</span>
              </Button>
            </Link>
            <Link href={config.playground}>
              <Button variant="ghost" className="flex items-center gap-2">
                <PlayCircle size={20} />
                <span className="hidden md:block">Playground</span>
              </Button>
            </Link>

            <Link href={config.github}>
              <Button variant="outline" className="flex items-center gap-2">
                <Github size={20} />
                <span className="hidden md:block">GitHub</span>
              </Button>
            </Link>
            <ModeSwitcher />
          </div>
        </nav>
      </div>
      <header className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex items-center space-x-2">
            <Logo className="h-24 w-24 text-primary" />
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-foreground">
              Duwa
            </h1>
          </div>
          <p className="max-w-[700px] text-lg text-muted-foreground mb-8">
            A programming languguage based on the Nyanja langugage
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={config.playground}>
              <Button size="lg" className="gap-2">
                <PlayCircle className="h-5 w-5" />
                Try Playground
              </Button>
            </Link>
            <Link href={config.docs}>
              <Button size="lg" variant="outline" className="gap-2">
                <Book className="h-5 w-5" />
                Read Docs
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Code Preview Section */}
      <section className="container mx-auto px-4 py-12">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code2 className="h-5 w-5" />
              Hello World Example
            </CardTitle>
            <CardDescription>
              A simple example showing how natural Duwa feels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">{codeExample}</code>
            </pre>
          </CardContent>
        </Card>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          Why Choose Duwa?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {feature.icon}
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-12">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="text-center">Ready to Start?</CardTitle>
            <CardDescription className="text-center">
              Join the community and start coding in Chichewa today
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href={config.github}>
              <Button size="lg" className="gap-2">
                <Github className="h-5 w-5" />
                View on GitHub
              </Button>
            </Link>
            <Link href={config.docs}>
              <Button size="lg" variant="outline" className="gap-2">
                <Book className="h-5 w-5" />
                Documentation
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Logo className="h-6 w-6 text-primary" />
              <span className="text-foreground font-semibold">Duwa</span>
            </div>
            <div className="flex gap-4">
              <Link href={config.github}>
                <Button variant="ghost" size="sm">
                  GitHub
                </Button>
              </Link>
              <Link href={config.docs}>
                <Button variant="ghost" size="sm">
                  Documentation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
