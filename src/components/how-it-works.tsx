import Link from 'next/link';
import { BookOpen, Clapperboard, Gamepad2, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const steps = [
  {
    icon: (
      <div className="flex gap-1">
        <Gamepad2 className="w-5 h-5" />
        <Clapperboard className="w-5 h-5" />
        <BookOpen className="w-5 h-5" />
      </div>
    ),
    /* SEO: "Temática" + "Anime/Videojuegos" ayuda a captar búsquedas de nicho */
    title: '1️⃣ Elige tu universo favorito',
    description:
      'Selecciona la temática de tu caja: desde Anime y Videojuegos hasta Cine, Series o Cómics. El punto de partida para tu regalo geek perfecto.',
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-primary" role="img" aria-label="Personalización de mystery box" />,
    /* SEO: Uso de "Mystery Box" y "Funko Pop", términos con altísimo volumen */
    title: '2️⃣ Configura tu Mystery Box',
    description:
      'Añade figuras Funko Pop, camisetas de tus héroes y merchandising oficial. Tú decides el contenido para que sea una caja sorpresa 100% a medida.',
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
        aria-label="Regalo original a domicilio"
      >
        <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v2" />
        <path d="m21 16-7 4-7-4" />
        <path d="m3.45 10.89 7.05 4.02 7.05-4.02" />
        <path d="M12 22v-6.5" />
        <path d="M2 12h20" />
      </svg>
    ),
    /* SEO: "Regalo original" y "fans" */
    title: '3️⃣ El regalo original perfecto',
    description:
      'Recibe tu pack personalizado en casa, empaquetado y listo para sorprender. La forma más fácil de acertar con un regalo para fans y coleccionistas.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-card py-20 flex justify-center">
      <div className="container px-4 md:px-6 flex flex-col items-center text-center">
        {/* Encabezado optimizado para SEO */}
        <div className="mb-16 max-w-3xl">
          <h2 className="text-3xl sm:text-5xl font-headline font-bold animate-fade-in-down">
            ¿Cómo conseguir tu Caja Regalo Friki?
          </h2>
          <p className="text-primary font-medium mt-2 animate-fade-in-down">
            🎁 Diseña tu propio pack de merchandising en 3 sencillos pasos
          </p>
          <p className="mt-4 text-lg text-muted-foreground animate-fade-in-up">
            Crea una experiencia única para gamers y amantes del anime. Elige los productos, personaliza el contenido y nosotros nos encargamos de que sea inolvidable.
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

        {/* CTA con texto de acción claro */}
        <div className="flex justify-center mt-12 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 ease-in-out hover:scale-105"
          >
            <Link href="/personalize">Empezar a diseñar mi caja sorpresa</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}