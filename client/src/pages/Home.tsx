import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { DownloaderCard } from "@/components/DownloaderCard";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { DownloadHistorySection } from "@/components/DownloadHistorySection";
import { ShareAppCTA } from "@/components/ShareAppCTA";
import { FirstTimeWelcome } from "@/components/FirstTimeWelcome";
import { AdPlacement } from "@/components/AdPlacement";
import { InArticleAd } from "@/components/InArticleAd";

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
          {/* In-article ad placement with the exact user-provided code */}
          <InArticleAd />
          
          <DownloadHistorySection />
          
          {/* Ad placement before CTA */}
          <AdPlacement location="inline" />
          
          <ShareAppCTA />
          
          {/* Second in-article ad for better visibility */}
          <InArticleAd className="mt-12" />
        </div>
        
        <FAQSection />
        
        {/* Ad placement after FAQ */}
        <div className="container max-w-5xl mx-auto px-4 mb-8">
          <AdPlacement location="content-bottom" />
        </div>
      </main>
      
      <Footer />
      
      {/* First-time user welcome/tooltip guide */}
      <FirstTimeWelcome />
    </div>
  );
}
