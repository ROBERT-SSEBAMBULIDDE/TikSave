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
              <h2 className="font-bold text-xl text-white">TikSave</h2>
            </div>
            <p className="text-sm">The easiest way to download TikTok videos without watermarks.</p>
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
            <p className="text-sm mb-4">Have questions or feedback? We'd love to hear from you.</p>
            <a href="mailto:contact@tiksave.com" className="inline-flex items-center text-sm text-primary hover:text-blue-400 transition-colors">
              <FAIcon icon="envelope" className="mr-2" />
              contact@tiksave.com
            </a>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-8 pt-6 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} TikSave. All rights reserved. Not affiliated with TikTok.</p>
          <p className="mt-2">TikTok is a trademark of ByteDance Ltd.</p>
        </div>
      </div>
    </footer>
  );
}
