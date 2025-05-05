import { FAIcon } from "@/components/ui/fa-icon";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 px-4 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
              <FAIcon icon="link" className="text-xl" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Paste TikTok URL</h3>
            <p className="text-slate-600">
              Copy the link from TikTok <br />and paste it above.
            </p>
          </div>
          
          {/* Step 2 */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
              <FAIcon icon="sliders-h" className="text-xl" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Select Format</h3>
            <p className="text-slate-600">
              Choose your preferred format <br />and quality settings.
            </p>
          </div>
          
          {/* Step 3 */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
              <FAIcon icon="download" className="text-xl" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Download Video</h3>
            <p className="text-slate-600">
              Save the watermark-free video <br />directly to your device.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
