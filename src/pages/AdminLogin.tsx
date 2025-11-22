import { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import "@/utils/hash-generator";

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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHashHelper, setShowHashHelper] = useState(false);
  const [generatedHash, setGeneratedHash] = useState("");

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
      await login(email, password);
      navigate(redirectPath, { replace: true });
    } catch (authError) {
      console.error(authError);
      setError("Email ou senha inválidos. Acesso negado.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateHash = async () => {
    if (!password) {
      setError("Digite uma senha para gerar o hash");
      return;
    }
    
    try {
      const { hashSecret } = await import("@/lib/auth");
      const hash = await hashSecret(password);
      setGeneratedHash(hash);
      setShowHashHelper(true);
    } catch (error) {
      console.error("Erro ao gerar hash:", error);
      setError("Erro ao gerar hash");
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
          <CardTitle className="text-2xl">Acesso Administrativo</CardTitle>
          <CardDescription>
            Digite seu email e senha de administrador para acessar as ferramentas de configuração e mídia.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {state.message && (
            <Alert variant="destructive" className="mb-4">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Autorização necessária</AlertTitle>
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>Acesso negado</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                name="admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Digite seu email"
                autoComplete="email"
                required
                disabled={disabled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password">Senha</Label>
              <Input
                id="admin-password"
                name="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                required
                disabled={disabled}
              />
            </div>

            <Button type="submit" className="w-full" disabled={disabled}>
              {loading ? "Verificando..." : "Acessar"}
            </Button>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full mt-2" 
              onClick={handleGenerateHash}
              disabled={disabled}
            >
              Gerar Hash SHA-256 (Debug)
            </Button>
          </form>

          {showHashHelper && generatedHash && (
            <Alert className="mt-4">
              <ShieldCheck className="h-4 w-4" />
              <AlertTitle>Hash SHA-256 Gerado</AlertTitle>
              <AlertDescription className="break-all font-mono text-xs mt-2">
                {generatedHash}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          Sessões são protegidas localmente por tempo limitado.
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
