import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { DownloaderCard } from "@/components/DownloaderCard";
import { UniversalDownloaderCard } from "@/components/UniversalDownloaderCard";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { DownloadHistorySection } from "@/components/DownloadHistorySection";
import { ShareAppCTA } from "@/components/ShareAppCTA";
import { AdUnit } from "@/components/AdUnit";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        <UniversalDownloaderCard />
        <div className="container max-w-6xl px-4 py-8">
          {/* First Ad Unit - Fluid format for article-style ads */}
          <AdUnit format="fluid" className="md:px-4" />
          <DownloadHistorySection />
          {/* Second Ad Unit - Horizontal format for banner-style ads */}
          <AdUnit format="horizontal" className="md:px-4" />
        </div>
        <FAQSection />
        
        {/* Share App CTA */}
        <div className="container max-w-6xl px-4 my-8">
          <ShareAppCTA />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
