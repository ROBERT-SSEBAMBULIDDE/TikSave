import { FAIcon } from "@/components/ui/fa-icon";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-700 to-blue-900 text-white py-16 px-4 sm:py-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-white/20 p-4 rounded-full">
            <FAIcon icon="tiktok" className="text-white text-4xl" />
          </div>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
          Download TikTok Videos Without Watermark
        </h2>
        <p className="text-base sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
          Save high-quality TikTok videos directly to your device in seconds. 
          <span className="block mt-2">Fast downloads. No watermark. Premium quality.</span>
        </p>
        <div className="flex justify-center space-x-3">
          <div className="flex items-center bg-white/10 rounded-lg px-4 py-2">
            <FAIcon icon="bolt" className="text-yellow-300 mr-2" />
            <span>Lightning Fast</span>
          </div>
          <div className="flex items-center bg-white/10 rounded-lg px-4 py-2">
            <FAIcon icon="check-circle" className="text-green-400 mr-2" />
            <span>No Watermark</span>
          </div>
          <div className="flex items-center bg-white/10 rounded-lg px-4 py-2">
            <FAIcon icon="shield-alt" className="text-blue-300 mr-2" />
            <span>100% Safe</span>
          </div>
        </div>
      </div>
    </section>
  );
}
