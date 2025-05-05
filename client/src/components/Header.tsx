import { FAIcon } from "@/components/ui/fa-icon";
import { Link } from "wouter";

export function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link href="/">
          <a className="flex items-center space-x-2">
            <FAIcon icon="cloud-download-alt" className="text-white text-2xl" />
            <h1 className="font-bold text-xl sm:text-2xl text-white">SamaBrains Downloader</h1>
          </a>
        </Link>
        <nav>
          <ul className="flex space-x-4 sm:space-x-6">
            <li>
              <a href="#how-it-works" className="text-white hover:text-blue-200 text-sm sm:text-base font-medium transition-colors">
                How it works
              </a>
            </li>
            <li>
              <Link href="/terms">
                <a className="text-white hover:text-blue-200 text-sm sm:text-base font-medium transition-colors">
                  Terms
                </a>
              </Link>
            </li>
            <li>
              <Link href="/privacy">
                <a className="text-white hover:text-blue-200 text-sm sm:text-base font-medium transition-colors">
                  Privacy
                </a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
