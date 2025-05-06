import { FAIcon } from "@/components/ui/fa-icon";
import { Link } from "wouter";
import { AdContainer } from "@/components/AdContainer";

export function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300 py-8 px-4">
      {/* Bottom ad banner */}
      <div className="w-full bg-gray-100 border-t border-gray-200 mb-6">
        <div className="max-w-5xl mx-auto">
          <AdContainer position="bottom" />
        </div>
      </div>
      
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FAIcon icon="cloud-download-alt" className="text-white text-xl" />
              <h2 className="font-bold text-xl text-white">TikSave</h2>
            </div>
            <p className="text-sm">The fastest way to download TikTok videos without watermarks.</p>
          </div>
          
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/"><div className="hover:text-white transition-colors cursor-pointer">Home</div></Link></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><Link href="/terms"><div className="hover:text-white transition-colors cursor-pointer">Terms of Service</div></Link></li>
              <li><Link href="/privacy"><div className="hover:text-white transition-colors cursor-pointer">Privacy Policy</div></Link></li>
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
