"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { useEffect, useState } from "react";

export function Navbar() {
  const { theme, systemTheme } = useTheme();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [currentTheme, setCurrentTheme] = useState<string | undefined>(undefined);

  useEffect(() => {
    setCurrentTheme(theme === "system" ? systemTheme : theme);
  }, [theme, systemTheme]);

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        {currentTheme !== undefined && (
          <Image
            src="/icon.png"
            alt="App Icon"
            width={32}
            height={32}
            className={`mr-4 ${currentTheme === "dark" ? "invert" : ""}`}
          />
        )}
        {session && (
          <>
            <MainNav className="mx-6" activeItem={pathname} />
          </>
        )}
        <div className="ml-auto flex items-center space-x-4">
          {session && <UserNav />}
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
