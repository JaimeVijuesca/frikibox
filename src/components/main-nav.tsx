'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Gift } from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  {
    name: 'Productos',
    href: '/products',
  },
  {
    name: 'Crea tu FrikiBox',
    href: '/personalize',
  },
  {
    name: 'Sobre Mí',
    href: '/about',
  }
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Gift className="h-6 w-6 text-primary" />
        <span className="hidden font-bold sm:inline-block font-headline text-xl">
          FrikiBox
        </span>
      </Link>
      <nav className="flex items-center space-x-6 text-base font-medium">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'transition-colors hover:text-foreground/80',
              pathname === item.href ? 'text-foreground' : 'text-foreground/60'
            )}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
