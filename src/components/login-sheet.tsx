"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  User,
  LogOut,
  ShoppingBag,
  UserCircle,
  UploadCloud,
} from "lucide-react";
import { useAuth } from "../context/auth-context";
import { useToast } from "../hooks/use-toast";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Eye, EyeOff } from "lucide-react";

export default function LoginSheet() {
  // Common state for both forms
  const [sheetOpen, setSheetOpen] = useState(false);
  const { user, login, register, logout, loading } = useAuth();
  const { toast } = useToast();

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form state
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  // Para login
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  // Para register
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(loginEmail, loginPassword);
    if (success) {
      toast({
        title: "¡Bienvenido de vuelta!",
        description: "Has iniciado sesión correctamente.",
      });
      setSheetOpen(false);
    } else {
      toast({
        variant: "destructive",
        title: "Error de inicio de sesión",
        description: "El email o la contraseña son incorrectos.",
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register(
      registerName,
      registerEmail,
      registerPassword
    );
    if (success) {
      toast({
        title: `¡Bienvenido, ${registerName}!`,
        description: "Tu cuenta ha sido creada y has iniciado sesión.",
      });
      setSheetOpen(false);
      // Clear fields after registration
      setRegisterName("");
      setRegisterEmail("");
      setRegisterPassword("");
    } else {
      toast({
        variant: "destructive",
        title: "Error en el registro",
        description:
          "Este email ya está en uso o la contraseña es demasiado débil.",
      });
    }
  };

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      toast({
        title: "Has cerrado sesión",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo cerrar la sesión. Inténtalo de nuevo.",
      });
    }
  };

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || ""
    );
  };

  if (loading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/50 text-primary-foreground font-bold">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">Abrir menú de usuario</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>¡Hola, {user.name}!</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/account">
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Mi cuenta</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/orders">
                <ShoppingBag className="mr-2 h-4 w-4" />
                <span>Mis pedidos</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          {user.isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/admin">
                    <UploadCloud className="mr-2 h-4 w-4" />
                    <span>Administración</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <User className="h-5 w-5" />
          <span className="sr-only">Iniciar Sesión / Registrarse</span>
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Accede a tu cuenta</SheetTitle>
        </SheetHeader>
        <Tabs defaultValue="login" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="login-email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="tu@email.com"
                    className="col-span-3"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="login-password" className="text-right">
                    Contraseña
                  </Label>
                  <div className="col-span-3 relative">
                    <Input
                      id="login-password"
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="Tu contraseña"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showLoginPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <SheetFooter>
                <Button type="submit" className="w-full">
                  Iniciar Sesión
                </Button>
              </SheetFooter>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleRegister}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="register-name" className="text-right">
                    Nombre
                  </Label>
                  <Input
                    id="register-name"
                    placeholder="Tu nombre"
                    className="col-span-3"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="register-email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="tu@email.com"
                    className="col-span-3"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="register-password" className="text-right">
                    Contraseña
                  </Label>
                  <div className="col-span-3 relative">
                    <Input
                      id="register-password"
                      type={showRegisterPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowRegisterPassword(!showRegisterPassword)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showRegisterPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <SheetFooter>
                <Button type="submit" className="w-full">
                  Crear Cuenta
                </Button>
              </SheetFooter>
            </form>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
