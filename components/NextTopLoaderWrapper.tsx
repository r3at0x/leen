"use client";

import { useTheme } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import { useEffect, useState } from "react";

export function NextTopLoaderWrapper() {
  const { theme, systemTheme } = useTheme();
  const [color, setColor] = useState("#000000");

  useEffect(() => {
    const currentTheme = theme === "system" ? systemTheme : theme;
    setColor(currentTheme === "dark" ? "#ffffff" : "#000000");
  }, [theme, systemTheme]);

  return <NextTopLoader color={color} showSpinner={false} />;
}
