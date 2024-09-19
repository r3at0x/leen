"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import TeamSwitcher from "@/components/team-switcher";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const { theme } = useTheme();

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        {theme === "dark" ? (
          <Image
            src="/icon.png"
            alt="App Icon"
            width={32}
            height={32}
            className="mr-4 invert"
          />
        ) : (
          <Image
            src="/icon.png"
            alt="App Icon"
            width={32}
            height={32}
            className="mr-4"
          />
        )}
        <TeamSwitcher />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">          
          <UserNav />
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
