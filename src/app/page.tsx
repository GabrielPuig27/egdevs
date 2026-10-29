import { Header } from "@/components/layout/Header";
import { About } from "@/components/sections/About";
import { AgentesHome } from "@/components/sections/AgentesHome";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Pricing } from "@/components/sections/Pricing";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <AgentesHome />
        <Projects />
        <Pricing />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
