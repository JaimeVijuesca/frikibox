import Link from "next/link";
import { Gift } from "lucide-react";
import LoginSheet from "./login-sheet";
import CartSheet from "./cart-sheet";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { ThemeSwitcher } from "./theme-switcher";
import { getAllPosts } from "../app/lib/post";

export default function Header() {
  const posts = getAllPosts().slice(0, 3); // últimos 3

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeSwitcher />
          <LoginSheet />
          <CartSheet />
          <Link
            href="/blog"
            className="text-primary font-medium hover:underline"
          >
            Blog
          </Link>
        </div>
      </div>
    </header>
  );
}
