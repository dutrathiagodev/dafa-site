import SmoothScroll from "@/components/motion/SmoothScroll";
import Reveals from "@/components/motion/Reveals";
import Header from "@/components/layout/Header";
import Hero from "@/components/sections/Hero";
import Showreel from "@/components/sections/Showreel";
import Portfolio from "@/components/sections/Portfolio";
import ProcessSequence from "@/components/sections/ProcessSequence";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Workflow from "@/components/sections/Workflow";
import GrowthChart from "@/components/sections/GrowthChart";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import { MediaModalProvider } from "@/components/media/VideoModal";

export default function Home() {
  return (
    <MediaModalProvider>
      <SmoothScroll />
      <Reveals />
      <a
        href="#projetos"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-electric focus:px-4 focus:py-2"
      >
        Pular para os projetos
      </a>
      <Header />
      <main>
        <Hero />
        <Showreel />
        <Portfolio />
        <ProcessSequence />
        <About />
        <Services />
        <Workflow />
        <GrowthChart />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </MediaModalProvider>
  );
}
