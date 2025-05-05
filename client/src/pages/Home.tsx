import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { DownloaderCard } from "@/components/DownloaderCard";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        <DownloaderCard />
        <HowItWorksSection />
        <FAQSection />
      </main>
      
      <Footer />
    </div>
  );
}
