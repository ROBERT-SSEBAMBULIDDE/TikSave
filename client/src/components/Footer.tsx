import { FAIcon } from "@/components/ui/fa-icon";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FAIcon icon="cloud-download-alt" className="text-white text-xl" />
              <h2 className="font-bold text-xl text-white">SamaBrains TikTok Downloader</h2>
            </div>
            <p className="text-sm">The fastest way to download TikTok videos without watermarks.</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/"><a className="hover:text-white transition-colors">Home</a></Link></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><Link href="/terms"><a className="hover:text-white transition-colors">Terms of Service</a></Link></li>
              <li><Link href="/privacy"><a className="hover:text-white transition-colors">Privacy Policy</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <p className="text-sm mb-3">Have questions or feedback? We'd love to hear from you.</p>
            <div className="flex items-center text-sm mb-2">
              <FAIcon icon="envelope" className="mr-2 text-primary" />
              <a href="mailto:info@samabrains.com" className="text-primary hover:text-blue-400 transition-colors">
                info@samabrains.com
              </a>
            </div>
            <div className="flex items-center text-sm mb-2">
              <FAIcon icon="phone" className="mr-2 text-primary" />
              <a href="tel:+256759910596" className="text-primary hover:text-blue-400 transition-colors">
                +256 759 910 596
              </a>
            </div>
            <div className="flex items-center text-sm">
              <FAIcon icon="map-marker-alt" className="mr-2 text-primary" />
              <span>Kampala, Uganda</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-8 pt-6 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} SamaBrains. All rights reserved. Not affiliated with TikTok.</p>
          <p className="mt-2">TikTok is a trademark of ByteDance Ltd.</p>
        </div>
      </div>
    </footer>
  );
}
