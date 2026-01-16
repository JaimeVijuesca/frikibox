import Link from 'next/link';
import { BookOpen, Clapperboard, Gamepad2, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const steps = [
  {
    icon: <div className="flex items-center gap-2"><Gamepad2 className="w-6 h-6" /><Clapperboard className="w-6 h-6" /><BookOpen className="w-6 h-6" /></div>,
    title: '1️⃣ Elige tu temática favorita',
    description: 'Navega entre una gran variedad de videojuegos, series o cómics para encontrar lo que más te apasiona.',
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-primary" />,
    title: '2️⃣ Personaliza tu caja',
    description: 'Selecciona Funko Pop, ropa y accesorios únicos para crear una caja a tu medida.',
  },
  {
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v2"/><path d="m21 16-7 4-7-4"/><path d="m3.45 10.89 7.05 4.02 7.05-4.02"/><path d="M12 22v-6.5"/><path d="M2 12h20"/></svg>,
    title: '3️⃣ Recíbela y sorprende',
    description: 'Recibe tu FrikiBox en casa, perfectamente empaquetada y lista para regalar (o para ti).',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-card">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl animate-fade-in-down">¿Cómo funciona?</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed animate-fade-in-up">
              En tres sencillos pasos, tu FrikiBox estará en camino.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-stretch gap-8 py-12 sm:grid-cols-1 md:grid-cols-3 lg:gap-12">
          {steps.map((step, index) => (
            <Card key={index} className="flex flex-col animate-fade-in-up" style={{ animationDelay: `${index * 0.2}s`}}>
              <CardHeader className="flex flex-col items-center text-center gap-4">
                <div className="flex items-center justify-center rounded-full bg-primary/10 p-4 text-primary">
                  {step.icon}
                </div>
                <CardTitle className="font-headline text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-center text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex justify-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Button asChild size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105">
                <Link href="/personalize">Personaliza tu FrikiBox</Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
