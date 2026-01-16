
'use client';

import { useTheme } from '../context/theme-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Paintbrush, Check, Sun, Moon } from 'lucide-react';
import { themes } from '../context/theme-context';

export function ThemeSwitcher() {
  const { theme: activeTheme, setTheme, mode, setMode } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Paintbrush className="h-5 w-5" />
          <span className="sr-only">Cambiar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => setMode('light')} className='justify-between'>
            <span>Claro</span>
            <Sun className="h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setMode('dark')} className='justify-between'>
            <span>Oscuro</span>
            <Moon className="h-4 w-4" />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
            {themes.map((theme) => (
            <DropdownMenuItem
                key={theme.name}
                onClick={() => setTheme(theme.name)}
                className="flex items-center justify-between"
            >
                <div className="flex items-center gap-2">
                <div
                    className="h-4 w-4 rounded-full border"
                    style={{
                        backgroundColor: `hsl(${theme.colors[mode].primary})`
                    }}
                />
                <span>{theme.label}</span>
                </div>
                {activeTheme?.name === theme.name && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
            ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
