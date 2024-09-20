"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { SignUpModal } from "@/components/SignUpModal";

export function UserCheck({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [isUserExist, setIsUserExist] = useState<boolean | null>(null);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch("/api/check-user", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: session.user.email }),
          });
          const data = await response.json();
          setIsUserExist(data.exists);
          if (!data.exists) {
            setIsSignUpModalOpen(true);
          }
        } catch (error) {
          console.error("Error checking user:", error);
          setIsUserExist(false);
        }
      }
    };

    if (status === "authenticated") {
      checkUser();
    }
  }, [session, status]);

  const handleSignUp = async (
    email: string,
    connectionId: string,
    apiKey: string
  ) => {
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, connectionId, apiKey }),
      });

      if (response.ok) {
        console.log("User saved to MongoDB");
        setIsSignUpModalOpen(false);
        setIsUserExist(true);
      } else {
        console.error("Sign up failed");
      }
    } catch (error) {
      console.error("Error during sign up:", error);
    }
  };

  return (
    <>
      {children}
      {isUserExist === false && (
        <SignUpModal
          isOpen={isSignUpModalOpen}
          onClose={() => setIsSignUpModalOpen(false)}
          onSubmit={handleSignUp}
          email={session?.user?.email || ""}
        />
      )}
    </>
  );
}
