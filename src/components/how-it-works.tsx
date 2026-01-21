import Link from 'next/link';
import { BookOpen, Clapperboard, Gamepad2, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const steps = [
  {
    icon: (
      <span role="img" aria-label="Videojuegos, cine, libros">
        <Gamepad2 className="w-6 h-6" />
        <Clapperboard className="w-6 h-6" />
        <BookOpen className="w-6 h-6" />
      </span>
    ),
    title: '1️⃣ Elige tu temática favorita',
    description:
      'Navega entre videojuegos, series, películas o cómics y encuentra lo que más te apasiona para tu FrikiBox personalizada.',
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-primary" role="img" aria-label="Personalización de caja" />,
    title: '2️⃣ Personaliza tu FrikiBox',
    description:
      'Selecciona Funko Pop, camisetas y accesorios únicos. Crea una caja a tu medida para ti o para regalar a un fan de la cultura geek.',
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
        role="img"
        aria-label="Entrega a domicilio"
      >
        <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v2" />
        <path d="m21 16-7 4-7-4" />
        <path d="m3.45 10.89 7.05 4.02 7.05-4.02" />
        <path d="M12 22v-6.5" />
        <path d="M2 12h20" />
      </svg>
    ),
    title: '3️⃣ Recíbela y sorprende',
    description:
      'Tu FrikiBox llegará a tu casa, perfectamente empaquetada y lista para regalar o disfrutar por ti mismo.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-card py-16 flex justify-center">
      <div className="container px-4 md:px-6 flex flex-col items-center text-center">
        {/* Encabezado */}
        <div className="mb-12">
          <h2 className="text-3xl font-headline font-bold sm:text-5xl animate-fade-in-down">
            ¿Cómo funciona FrikiBox?
          </h2>
          <p className="max-w-2xl text-muted-foreground mt-4 text-lg animate-fade-in-up">
            En solo tres pasos, crea tu caja friki personalizada con tus productos favoritos de anime, cine, videojuegos y cómics.
          </p>
        </div>

        {/* Pasos */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3 lg:gap-12 justify-items-center">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="flex flex-col animate-fade-in-up shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-xs"
              style={{ animationDelay: `${index * 0.3}s` }}
            >
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

        {/* CTA */}
        <div className="flex justify-center mt-8 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105"
          >
            <Link href="/personalize">¡Personaliza tu FrikiBox ahora!</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
