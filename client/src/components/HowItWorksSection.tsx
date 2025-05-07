import { FAIcon } from "@/components/ui/fa-icon";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-12 px-4 bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center">How It Works</h2>
        
        <div className="flex items-center justify-center">
          {/* Simple one-step instruction */}
          <div className="flex items-center p-4 bg-blue-50 rounded-lg shadow-sm">
            <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mr-4">
              <FAIcon icon="magic" className="text-xl" />
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold mb-1">Paste, Select & Download</h3>
              <p className="text-slate-600">
                Simply paste your TikTok URL, select your format preferences, and download your watermark-free video.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
