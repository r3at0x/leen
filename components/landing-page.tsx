import { Button } from "@/components/ui/button";
import { signInWithGithub, signInWithGoogle } from "@/authActions";

export function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-background text-foreground">
      <h1 className="text-4xl font-bold mb-6">Welcome to SDMVP</h1>
      <p className="text-xl mb-8 text-center max-w-md">
        Secure your startup with our powerful device management and
        vulnerability platform.
      </p>
      <div className="flex space-x-4">
        <form action={signInWithGithub}>
          <Button type="submit" variant="outline">
            Sign in with GitHub
          </Button>
        </form>
        <form action={signInWithGoogle}>
          <Button type="submit" variant="outline">
            Sign in with Google
          </Button>
        </form>
      </div>
    </div>
  );
}
