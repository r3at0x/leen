import { useState, useEffect } from "react";

export function useTypewriter(text: string, speed: number) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    setDisplayText(""); // Reset text when input changes
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(() => text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return displayText;
}
