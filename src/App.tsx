import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "next-themes";
import { AppSidebar } from "@/components/AppSidebar";
import { LoginScreen } from "@/components/LoginScreen";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import "@/i18n";
import Index from "./pages/Index";
import BuscarPets from "./pages/BuscarPets";
import Favoritos from "./pages/Favoritos";
import Settings from "./pages/Settings";
import AdicionarPet from "./pages/AdicionarPet";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import PetDetails from "./pages/PetDetails";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

// Componente para proteger rotas autenticadas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger className="ml-4" />
          </header>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

// Componente para rota pública (login)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const [isResetPasswordRoute, setIsResetPasswordRoute] = useState(false);

  useEffect(() => {
    // Verificar se estamos na rota de reset password
    const checkResetPasswordRoute = () => {
      const path = window.location.pathname;
      const hasResetParams = window.location.search.includes('type=recovery') || 
                           window.location.search.includes('access_token') ||
                           window.location.hash.includes('type=recovery') ||
                           window.location.hash.includes('access_token');
      
      setIsResetPasswordRoute(path === '/reset-password' || (hasResetParams && path === '/'));
    };

    checkResetPasswordRoute();
    
    // Listener para mudanças na URL
    const handleLocationChange = () => {
      checkResetPasswordRoute();
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Se detectarmos que é uma rota de reset password, sempre mostrar a página
  if (isResetPasswordRoute) {
    return <ResetPassword />;
  }

  return (
    <Routes>
      {/* Rota pública de login */}
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginScreen />
          </PublicRoute>
        } 
      />
      
      {/* Rota especial de reset password */}
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Página pública de detalhes do pet para links compartilhados */}
      <Route path="/pet/:id" element={<PetDetails />} />
      
      {/* Rotas protegidas */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/buscar" 
        element={
          <ProtectedRoute>
            <BuscarPets />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/favoritos" 
        element={
          <ProtectedRoute>
            <Favoritos />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/adicionar-pet" 
        element={
          <ProtectedRoute>
            <AdicionarPet />
          </ProtectedRoute>
        } 
      />
      
      /
      <Route 
        path="/configuracoes" 
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } 
      />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <FavoritesProvider>
                <AppRoutes />
              </FavoritesProvider>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
