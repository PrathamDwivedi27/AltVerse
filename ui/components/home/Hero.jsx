// app/components/Hero.jsx
import { Button } from "@/components/ui/button";

export default function Hero({ onOpenLogin }) {
  return (
    <section className="relative w-full h-[80vh] flex items-center justify-center text-center">
      {/* Background Image with Darker Overlay */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: "url('/galaxy-bg.jpg')" }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-65"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-4 space-y-6">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
          Welcome to the AltVerse
        </h1>
        <p className="max-w-[700px] mx-auto text-gray-300 md:text-xl">
          Create worlds, invite friends, and collaboratively shape history through prompts and votes. 
          Your universe awaits.
        </p>
        <Button
          size="lg"
          onClick={onOpenLogin}
          className="text-lg font-semibold cursor-pointer bg-[oklch(0.7_0.18_210)] hover:bg-[oklch(0.65_0.18_210)] text-white shadow-lg shadow-[oklch(0.7_0.18_210)_0px_0px_12px] transition duration-300"
        >
          Create Your Universe
        </Button>
      </div>
    </section>
  );
}
