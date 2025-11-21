import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Configurator from "./pages/Configurator";
import AdminLogin from "./pages/AdminLogin";
import AdminMedia from "./pages/AdminMedia";
import AdminProducts from "./pages/AdminProducts";
import Category from "./pages/Category";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Product from "./pages/Product";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AdminAuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<Index />} />
            <Route path="/product/:handle" element={<Product />} />
            <Route path="/categoria/:categorySlug" element={<Category />} />
            <Route path="/categoria/:categorySlug/:subcategorySlug" element={<Category />} />
            
            {/* Rotas de Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Rotas Protegidas (Requer Login) */}
            <Route element={<ProtectedRoute />}>
              <Route path="/admin/configurator" element={<Configurator />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/media" element={<AdminMedia />} />
            </Route>

            {/* Rota de Erro */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
