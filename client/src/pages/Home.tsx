import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { DownloaderCard } from "@/components/DownloaderCard";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { DownloadHistorySection } from "@/components/DownloadHistorySection";
import { ShareAppCTA } from "@/components/ShareAppCTA";
import { ShareIncentiveCard } from "@/components/ShareIncentiveCard";
import { FloatingShareButton } from "@/components/FloatingShareButton";
import { SharePromptBanner } from "@/components/SharePromptBanner";
import { AdUnit } from "@/components/AdUnit";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HeroSection />
        <DownloaderCard />
        <div className="container max-w-6xl px-4 py-8">
          {/* First Ad Unit - Fluid format for article-style ads */}
          <AdUnit format="fluid" className="md:px-4" />
          
          {/* Share Incentive Card - Will be displayed prominently */}
          <div className="my-8">
            <ShareIncentiveCard />
          </div>
          
          <DownloadHistorySection />
          <ShareAppCTA />
          
          {/* Second Ad Unit - Horizontal format for banner-style ads */}
          <AdUnit format="horizontal" className="md:px-4" />
        </div>
        <FAQSection />
      </main>
      
      <Footer />
      
      {/* Floating Share Button */}
      <FloatingShareButton />
      
      {/* Share Prompt Banner (appears automatically after delay) */}
      <SharePromptBanner />
    </div>
  );
}
