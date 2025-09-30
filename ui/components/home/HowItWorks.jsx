// app/components/HowItWorks.jsx
import { Rocket, Users, FileText, Vote } from 'lucide-react';

const steps = [
  {
    icon: <Rocket className="h-10 w-10 text-chart-3" />,
    title: "1. Create Universe",
    description: "Start by bringing your own unique world to life with a single click.",
  },
  {
    icon: <Users className="h-10 w-10 text-chart-2" />,
    title: "2. Invite Players",
    description: "Gather your friends or fellow creators to join your narrative adventure.",
  },
  {
    icon: <FileText className="h-10 w-10 text-chart-3" />,
    title: "3. Give Prompts",
    description: "Introduce events, characters, and challenges to drive the story forward.",
  },
  {
    icon: <Vote className="h-10 w-10 text-chart-1" />,
    title: "4. Vote & Shape History",
    description: "Players vote on outcomes, collectively deciding the fate of the universe.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2"></div>
          <div className="grid md:grid-cols-4 gap-10 relative">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-md border transition-transform duration-300 ease-out hover:scale-105 hover:-translate-y-3 hover:shadow-xl hover:shadow-blue-500/50"
              >
                <div className="mb-4 bg-muted p-4 rounded-full">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
