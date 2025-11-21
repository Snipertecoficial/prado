import { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, initializing } = useAdminAuth();

  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const state = (location.state as { from?: string; message?: string } | null) || {};
  const redirectPath = state.from || "/admin/dashboard";

  useEffect(() => {
    if (!initializing && isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [initializing, isAuthenticated, navigate, redirectPath]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(secret);
      navigate(redirectPath, { replace: true });
    } catch (authError) {
      console.error(authError);
      setError("Invalid admin secret. Access denied.");
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || initializing;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-10">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Shield className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>
            Enter the shared admin secret to unlock configurator and media tools.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {state.message && (
            <Alert variant="warning" className="mb-4">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Authorization required</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Access denied</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-secret">Shared secret</Label>
              <Input
                id="admin-secret"
                name="admin-secret"
                type="password"
                value={secret}
                onChange={(event) => setSecret(event.target.value)}
                placeholder="Enter admin secret"
                autoComplete="current-password"
                required
                disabled={disabled}
              />
            </div>

            <Button type="submit" className="w-full" disabled={disabled}>
              {loading ? "Verifying…" : "Unlock admin"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          Sessions are secured locally for a limited time.
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
