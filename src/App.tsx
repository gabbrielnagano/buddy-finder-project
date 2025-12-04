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
import { useEffect, useState, Suspense, lazy } from "react";
import Index from "./pages/Index";
import BuscarPets from "./pages/BuscarPets";
import Favoritos from "./pages/Favoritos";
import Settings from "./pages/Settings";
import AdicionarPet from "./pages/AdicionarPet";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import UserProfile from "./pages/UserProfile";
import Help from "./pages/Help";
const PetDetails = lazy(() => import("./pages/PetDetails"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const queryClient = new QueryClient();
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
    const checkResetPasswordRoute = () => {
      const path = window.location.pathname;
      const hasResetParams = window.location.search.includes('type=recovery') || 
                           window.location.search.includes('access_token') ||
                           window.location.hash.includes('type=recovery') ||
                           window.location.hash.includes('access_token');
      setIsResetPasswordRoute(path === '/reset-password' || (hasResetParams && path === '/'));
    };
    checkResetPasswordRoute();
    const handleLocationChange = () => {
      checkResetPasswordRoute();
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);
  if (isResetPasswordRoute) {
    return <ResetPassword />;
  }
  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginScreen />
          </PublicRoute>
        } 
      />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route 
        path="/pet/:id" 
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <PetDetails />
          </Suspense>
        } 
      />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/buscar-pets" 
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
      <Route 
        path="/perfil" 
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/perfil/editar" 
        element={
          <ProtectedRoute>
            <Suspense fallback={<div>Loading...</div>}>
              <EditProfile />
            </Suspense>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/perfil/:userId" 
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/configuracoes" 
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ajuda" 
        element={
          <ProtectedRoute>
            <Help />
          </ProtectedRoute>
        } 
      />
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
