import { FAIcon } from "@/components/ui/fa-icon";
import { Link } from "wouter";

export function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link href="/">
          <a className="flex items-center space-x-2">
            <FAIcon icon="cloud-download-alt" className="text-primary text-2xl" />
            <h1 className="font-bold text-xl sm:text-2xl text-slate-800">TikSave</h1>
          </a>
        </Link>
        <div>
          <a href="#how-it-works" className="text-slate-600 hover:text-primary text-sm sm:text-base transition-colors">
            How it works
          </a>
        </div>
      </div>
    </header>
  );
}
