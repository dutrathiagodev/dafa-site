import SmoothScroll from "@/components/SmoothScroll";
import Reveals from "@/components/Reveals";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Showreel from "@/components/Showreel";
import Portfolio from "@/components/Portfolio";
import ProcessSequence from "@/components/ProcessSequence";
import About from "@/components/About";
import Services from "@/components/Services";
import Workflow from "@/components/Workflow";
import GrowthChart from "@/components/GrowthChart";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { MediaModalProvider } from "@/components/VideoModal";

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
