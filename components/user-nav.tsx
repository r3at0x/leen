import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SignUpModal } from "@/components/signup-modal";

export function UserNav() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  if (!session) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const handleSettingsClick = () => {
    setIsSignUpModalOpen(true);
  };

  const handleSubmit = async (email: string, connectionId: string, apiKey: string) => {
    try {
      const response = await fetch("/api/update-user-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, connectionId, apiKey }),
      });

      if (response.ok) {
        setIsSignUpModalOpen(false);
        window.location.reload(); // Reload the page after successful update
      } else {
        const errorData = await response.json();
        alert(`Failed to update settings: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("An error occurred while updating settings.");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={session.user?.image || ""}
                alt={session.user?.name || ""}
              />
              <AvatarFallback>
                {session.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user?.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem disabled>Profile</DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettingsClick}>Settings</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {session?.user?.email && (
        <SignUpModal
          isOpen={isSignUpModalOpen}
          onClose={() => setIsSignUpModalOpen(false)}
          onSubmit={handleSubmit}
          email={session.user.email}
          isUpdate={true}
        />
      )}
    </>
  );
}
