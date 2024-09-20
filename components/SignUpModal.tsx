import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string, connectionId: string, apiKey: string) => void;
  email: string;
}

export function SignUpModal({
  isOpen,
  onClose,
  onSubmit,
  email,
}: SignUpModalProps) {
  const [connectionId, setConnectionId] = useState("");
  const [apiKey, setApiKey] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, connectionId, apiKey);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Your Registration</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Input id="email" value={email} disabled />
            <Input
              id="connectionId"
              placeholder="Connection ID"
              value={connectionId}
              onChange={(e) => setConnectionId(e.target.value)}
              required
            />
            <Input
              id="apiKey"
              placeholder="API Key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
          </div>
          <Button type="submit">Complete Sign Up</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
