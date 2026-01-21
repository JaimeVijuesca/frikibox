import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '../../lib/placeholder-images';
import { Button } from '../../components/ui/button';
import { InstagramIcon, TiktokIcon } from '../../components/icons';
import { Mail } from 'lucide-react';

export const metadata = {
  title: "Sobre Frikibox | Proyecto Friki y Cajas Geek",
  description:
    "Conoce Frikibox, un proyecto dedicado a crear cajas frikis personalizadas para amantes del anime, gaming y la cultura geek.",
};


export default function AboutPage() {
  const founderImage = PlaceHolderImages.find((img) => img.id === 'founder-photo');

  return (
    <section id="about-us" className="bg-background py-16 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center max-w-5xl mx-auto">
          <div className="relative aspect-square rounded-lg overflow-hidden shadow-2xl animate-fade-in">
            {founderImage && (
              <Image
                src={founderImage.imageUrl}
                alt={founderImage.name}
                fill
                className="object-cover"
                data-ai-hint={founderImage.imageHint}
              />
            )}
          </div>
          <div className="flex flex-col items-start space-y-6">
            <div className="space-y-4">
               <h1 className="text-4xl sm:text-5xl md:text-6xl font-headline font-bold tracking-tighter animate-fade-in-down">
                Mi Historia
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl/relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                ¡Hola! Soy un chaval de 22 años al que le flipa el universo friki desde que tiene uso de razón. Los Funko Pops, los cómics, las series que nos quitan el sueño... todo eso es mi pasión.
              </p>
              <p className="text-muted-foreground text-lg md:text-xl/relaxed animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                FrikiBox nació de la idea de compartir esa pasión, creando cajas personalizadas llenas de sorpresas que le alegrarían el día a cualquier fan. Cada artículo lo elijo como si fuera para mí, buscando siempre esa chispa de emoción.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                <h3 className='font-headline text-2xl'>¡Sígueme la pista!</h3>
                <div className="flex items-center gap-3">
                    {/* <Link href="https://instagram.com/" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="icon">
                            <InstagramIcon className="h-5 w-5" />
                            <span className="sr-only">Instagram</span>
                        </Button>
                    </Link> */}
                     <Link href="https://tiktok.com/" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="icon">
                            <TiktokIcon className="h-5 w-5" />
                            <span className="sr-only">TikTok</span>
                        </Button>
                    </Link>
                    <Link href="frikisboxs@gmail.com">
                        <Button variant="outline" size="icon">
                            <Mail className="h-5 w-5" />
                            <span className="sr-only">Email</span>
                        </Button>
                    </Link>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
