import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/authActions";
import { LogIn } from "lucide-react";
import { useTypewriter } from "@/hooks/use-typewriter";

export function LandingPage() {
  const typewriterText = useTypewriter(
    "Secure your startup with our powerful device management and vulnerability platform.",
    30
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-6">Welcome to SDMVP</h1>
      <p className="text-xl mb-8 text-center max-w-md h-20">{typewriterText}</p>
      <div className="flex space-x-4">
        <form action={signInWithGoogle}>
          <Button
            type="submit"
            variant="outline"
            className="flex items-center space-x-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign in with Google</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
