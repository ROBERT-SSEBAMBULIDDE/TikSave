import { FAIcon } from "@/components/ui/fa-icon";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-12 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FAIcon icon="link" className="text-primary text-xl" />
            </div>
            <h3 className="font-semibold text-lg mb-2">1. Paste URL</h3>
            <p className="text-slate-600">Copy the link from TikTok and paste it into the input field above.</p>
          </div>
          
          {/* Step 2 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FAIcon icon="cogs" className="text-primary text-xl" />
            </div>
            <h3 className="font-semibold text-lg mb-2">2. Process Video</h3>
            <p className="text-slate-600">Our system removes the watermark while preserving the original quality.</p>
          </div>
          
          {/* Step 3 */}
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FAIcon icon="download" className="text-primary text-xl" />
            </div>
            <h3 className="font-semibold text-lg mb-2">3. Download</h3>
            <p className="text-slate-600">Select your preferred format and download the video to your device.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
