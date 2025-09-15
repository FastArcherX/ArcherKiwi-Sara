import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/firebase";
import { LogIn, Chrome } from "lucide-react";
import { useOptionalAuth, hasFirebaseConfigured } from "@/hooks/useOptionalAuth";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const [user, loading] = useOptionalAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    if (!hasFirebaseConfigured) {
      console.warn("Firebase non configurato - impossibile effettuare il login");
      return;
    }
    
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
      onOpenChange(false);
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading) {
    return null;
  }

  if (user) {
    onOpenChange(false);
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogIn className="w-5 h-5" />
            Accedi ad ArcherKiwi
          </DialogTitle>
          <DialogDescription>
            Accedi per salvare le tue note nel cloud e accedervi da qualsiasi dispositivo
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Button
            onClick={handleSignIn}
            disabled={isSigningIn}
            className="w-full"
            size="lg"
            data-testid="button-sign-in-google"
          >
            <Chrome className="w-5 h-5 mr-2" />
            {isSigningIn ? "Accedendo..." : "Accedi con Google"}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Continuando accetti i nostri termini di servizio e la privacy policy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}