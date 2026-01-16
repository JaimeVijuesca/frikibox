'use client';

import { useAuth } from '../../context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../components/ui/card';
import { useToast } from '../../hooks/use-toast';
import { User } from 'lucide-react';
import Loading from '../loading';

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
    if (user) {
        setName(user.name);
        setEmail(user.email);
    }
  }, [user, loading, router]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // En una aplicación real, aquí llamarías a tu API para actualizar los datos.
    // Con Firebase Auth, usarías updateProfile y updateEmail.
    toast({
      title: '¡Datos actualizados!',
      description: 'Tu información ha sido guardada correctamente (simulación).',
    });
  };

  if (loading || !user) {
    return <Loading />;
  }

  return (
    <section className="py-12 md:py-24">
      <div className="container px-4 md:px-6 flex justify-center">
        <Card className="w-full max-w-2xl animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl font-headline">
              <User className="h-6 w-6" />
              Mi Cuenta
            </CardTitle>
            <CardDescription>
              Aquí puedes ver y actualizar tu información personal.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleUpdate}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled // El email no debería cambiarse tan fácilmente
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="password">Cambiar Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Funcionalidad no implementada"
                  disabled
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Guardar Cambios</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </section>
  );
}
