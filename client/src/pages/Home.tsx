import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { DownloaderCard } from "@/components/DownloaderCard";
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
        <DownloaderCard />
        <div className="container max-w-6xl px-4 py-8">
          {/* First Ad Unit - optimized format based on context */}
          <AdUnit 
            placementId="home_top" 
            className="md:px-4" 
            fallbackContent={
              <div className="text-center py-4 text-sm text-gray-500">
                Consider supporting TikSave by disabling your ad blocker
              </div>
            }
          />
          <DownloadHistorySection />
          <ShareAppCTA />
          {/* Second Ad Unit - optimized format based on context */}
          <AdUnit 
            placementId="home_bottom" 
            className="md:px-4" 
          />
        </div>
        <FAQSection />
      </main>
      
      <Footer />
    </div>
  );
}
