import { useAuth } from "@/app/contexts/AuthContext";
import { MountainIcon } from "lucide-react";

export default function Header() {
    const {login}=useAuth();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-10 h-16 flex items-center bg-background/40 backdrop-blur-sm border-b border-white/10">
      {/* Logo - Left */}
      <a
        className="flex items-center justify-center group transition duration-300"
        href="#"
      >
        <MountainIcon className="h-6 w-6 text-black group-hover:text-[oklch(0.7_0.18_210)] group-hover:drop-shadow-[0_0_6px_oklch(0.7_0.18_210)] transition duration-300" />
        <span className="ml-2 text-xl font-bold tracking-wide text-black group-hover:text-[oklch(0.7_0.18_210)] group-hover:drop-shadow-[0_0_8px_oklch(0.7_0.18_210)] transition duration-300">
          AltVerse
        </span>
      </a>

      {/* Nav - Center */}
      <nav className="absolute left-1/2 transform -translate-x-1/2 flex gap-8">
        <a
          href="#"
          className="text-base font-semibold text-black/80 hover:text-[oklch(0.7_0.18_210)] hover:drop-shadow-[0_0_10px_oklch(0.7_0.18_210)] transition duration-300"
        >
          Home
        </a>
        <a
          href="#contact"
          className="text-base font-semibold text-black/80 hover:text-[oklch(0.7_0.18_210)] hover:drop-shadow-[0_0_10px_oklch(0.7_0.18_210)] transition duration-300"
        >
          Contact
        </a>
        <a
          href="#architecture"
          className="text-base font-semibold text-black/80 hover:text-[oklch(0.7_0.18_210)] hover:drop-shadow-[0_0_10px_oklch(0.7_0.18_210)] transition duration-300"
        >
          Architecture
        </a>
      </nav>

      {/* Right CTA */}
      <div className="ml-auto">
        <a
        onClick={e => {
            e.preventDefault();
            login();
        }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[oklch(0.7_0.18_210)] to-[oklch(0.12_0.02_250)] text-sm font-semibold text-white shadow-lg hover:scale-105 hover:shadow-[0_0_18px_oklch(0.7_0.18_210)] transition duration-300"
        >
          Let&apos;s Go 🚀
        </a>
      </div>
    </header>
  );
}
