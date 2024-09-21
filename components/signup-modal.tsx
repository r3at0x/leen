import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string, connectionId: string, apiKey: string) => void;
  email: string;
  isUpdate?: boolean;
}

export function SignUpModal({
  isOpen,
  onClose,
  onSubmit,
  email,
  isUpdate = false,
}: SignUpModalProps) {
  const [connectionId, setConnectionId] = useState("");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    if (isUpdate) {
      // Fetch existing credentials when updating
      const fetchCredentials = async () => {
        try {
          const response = await fetch("/api/get-user-credentials", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          });
          const data = await response.json();
          if (response.ok) {
            setConnectionId(data.connectionId);
            setApiKey(data.apiKey);
          }
        } catch (error) {
          console.error("Error fetching user credentials:", error);
        }
      };
      fetchCredentials();
    }
  }, [isUpdate, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, connectionId, apiKey);
    // Close the modal after submission
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isUpdate ? "Update Your Settings" : "Complete Your Registration"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={email} disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="connectionId">Connection ID</Label>
              <Input
                id="connectionId"
                placeholder="Enter your Connection ID"
                value={connectionId}
                onChange={(e) => setConnectionId(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                placeholder="Enter your API Key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                required
              />
            </div>
          </div>
          <Button type="submit">{isUpdate ? "Update Settings" : "Complete Sign Up"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
