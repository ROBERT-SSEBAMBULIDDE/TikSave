import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { DownloaderCard } from "@/components/DownloaderCard";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { DownloadHistorySection } from "@/components/DownloadHistorySection";
import { ShareAppCTA } from "@/components/ShareAppCTA";
import { AdPlacement } from "@/components/AdPlacement";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        
        {/* Ad placement before downloader card */}
        <div className="container max-w-5xl mx-auto px-4">
          <AdPlacement location="content-top" />
        </div>
        
        <DownloaderCard />
        
        <div className="container max-w-6xl px-4 py-8">
          {/* Ad placement between components */}
          <AdPlacement location="inline" />
          
          <DownloadHistorySection />
          
          {/* Ad placement before CTA */}
          <AdPlacement location="inline" />
          
          <ShareAppCTA />
        </div>
        
        <FAQSection />
        
        {/* Ad placement after FAQ */}
        <div className="container max-w-5xl mx-auto px-4 mb-8">
          <AdPlacement location="content-bottom" />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
