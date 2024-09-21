"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { SignUpModal } from "@/components/signup-modal";

export function UserCheck({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [isUserExist, setIsUserExist] = useState<boolean | null>(null);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);

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
            setIsFirstLogin(true);
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

  const handleSignUpOrUpdate = async (
    email: string,
    connectionId: string,
    apiKey: string
  ) => {
    try {
      const endpoint = isUserExist
        ? "/api/update-user-credentials"
        : "/api/signup";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, connectionId, apiKey }),
      });

      if (response.ok) {
        setIsSignUpModalOpen(false);
        setIsUserExist(true);
        if (isUserExist) {
          // Show a success message for updates
          alert("Settings updated successfully!");
        } else {
          // Reload the page for first-time sign-ups
          window.location.reload();
        }
      } else {
        console.error("Operation failed");
      }
    } catch (error) {
      console.error("Error during operation:", error);
    }
  };

  return (
    <>
      {children}
      {(isUserExist === false || isSignUpModalOpen) && (
        <SignUpModal
          isOpen={isSignUpModalOpen}
          onClose={() => setIsSignUpModalOpen(false)}
          onSubmit={handleSignUpOrUpdate}
          email={session?.user?.email || ""}
          isUpdate={isUserExist ?? false}
          isFirstLogin={isFirstLogin}
        />
      )}
    </>
  );
}
