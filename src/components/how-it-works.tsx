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
      'Selecciona entre videojuegos, series, películas o cómics para tu caja friki personalizada y empieza a crear tu FrikiBox única.',
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-primary" role="img" aria-label="Personalización de caja" />,
    title: '2️⃣ Personaliza tu FrikiBox',
    description:
      'Agrega Funko Pop, camisetas y accesorios geek a tu caja. Personaliza cada detalle y crea un regalo perfecto o tu propio tesoro geek.',
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
      'Tu FrikiBox llegará a tu puerta, empaquetada y lista para regalar o disfrutar. La manera más fácil de sorprender a cualquier fan geek.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-card py-20 flex justify-center">
      <div className="container px-4 md:px-6 flex flex-col items-center text-center">
        {/* Encabezado */}
        <div className="mb-16 max-w-3xl">
          <h2 className="text-3xl sm:text-5xl font-headline font-bold animate-fade-in-down">
            ¿Cómo crear tu FrikiBox?
          </h2>
          <p className="text-primary font-medium mt-2 animate-fade-in-down">
            🎁 Tres pasos sencillos para obtener tu caja friki personalizada
          </p>
          <p className="mt-4 text-lg text-muted-foreground animate-fade-in-up">
            Elige tus productos favoritos, personaliza cada detalle y recibe tu FrikiBox lista para regalar o disfrutar por ti mismo.
          </p>
        </div>

        {/* Pasos */}
        <div className="grid gap-10 sm:grid-cols-1 md:grid-cols-3 lg:gap-14 justify-items-center">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="flex flex-col animate-fade-in-up shadow-lg hover:shadow-2xl transition-shadow duration-500 w-full max-w-xs"
              style={{ animationDelay: `${index * 0.25}s` }}
            >
              <CardHeader className="flex flex-col items-center text-center gap-4">
                <div className="flex items-center justify-center rounded-full bg-primary/10 p-5 text-primary">
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
        <div className="flex justify-center mt-12 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
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
