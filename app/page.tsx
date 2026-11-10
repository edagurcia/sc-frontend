import { Hero } from "@/components/landing/Hero";
import { Brand } from "@/components/landing/Brand";
import { Features } from "@/components/landing/Features";
import { Preview } from "@/components/landing/Preview";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background font-sans text-foreground transition-colors duration-300 selection:bg-primary selection:text-primary-foreground">
      <Hero />
      <Brand />
      <Features />
      <Preview />
    </main>
  );
}
