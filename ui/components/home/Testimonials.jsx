// app/components/Testimonials.jsx
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  { name: "Sharad Prakash", feedback: "AltVerse is revolutionary! My friends and I created an epic sci-fi saga." },
  { name: "Ayushman Singh", feedback: "The perfect tool for world-builders and storytellers. Incredibly engaging." },
  { name: "Rahul Ranjan", feedback: "I love how our votes genuinely impact the story. It feels so dynamic." },
  { name: "Vashu Suman", feedback: "Finally, a game that lets our collective creativity run wild. A++!" },
  { name: "Devansh Varshney", feedback: "Setting up a universe was a breeze. We were playing within minutes." },
  { name: "Sajal Namdeo", feedback: "A fantastic way to spend an evening with friends, building our own history." },
  { name: "Amol Jha", feedback: "The prompting system keeps things exciting and unpredictable. Highly recommend." },
];

const allTestimonials = [...testimonials, ...testimonials];

export default function Testimonials() {
  return (
    <section className="py-20 w-full overflow-hidden">
        <h2 className="text-3xl font-bold text-center mb-12">What Creators Are Saying</h2>
        <div className="relative w-full marquee-container">
            <div className="flex animate-marquee">
                {allTestimonials.map((item, index) => (
                    <Card key={index} className="flex-shrink-0 w-80 mx-4">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-muted mb-4 flex items-center justify-center font-bold text-xl text-muted-foreground">
                                {item.name.charAt(0)}
                            </div>
                            <p className="text-foreground italic">"{item.feedback}"</p>
                            <h4 className="font-semibold mt-4 text-primary">- {item.name}</h4>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    </section>
  );
}