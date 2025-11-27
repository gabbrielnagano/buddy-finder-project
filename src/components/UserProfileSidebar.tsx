import { useState, useEffect } from "react";
import { MapPin, PawPrint } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";

interface UserProfile {
  nome: string;
  avatar_url: string | null;
  cidade: string | null;
  estado: string | null;
}

export function UserProfileSidebar() {
  const { user } = useAuth();
  const { state } = useSidebar();
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [petsCount, setPetsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchUserData();
    }
  }, [user, routeLocation.pathname]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      // Buscar perfil do usuário
      const { data: profileData } = await supabase
        .from('perfis')
        .select('nome, avatar_url, cidade, estado')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Contar pets do usuário
      const { count } = await supabase
        .from('pets')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);


      setPetsCount(count || 0);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          {state !== "collapsed" && (
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          )}
        </div>
      </div>
    );
  }

  const initials = profile?.nome
    ? profile.nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email?.[0].toUpperCase() || 'U';

  const location = profile?.cidade && profile?.estado
    ? `${profile.cidade}, ${profile.estado}`
    : profile?.cidade || profile?.estado || 'Localização não definida';

  return (
    <div className="px-4 py-3 border-b border-border bg-muted/30">
      <div 
        className={`flex items-center gap-3 cursor-pointer hover:bg-accent/50 rounded-lg p-2 transition-colors ${
          state === "collapsed" ? "justify-center" : ""
        }`}
        onClick={() => navigate('/perfil')}
      >
        <Avatar className="h-10 w-10 border-2 border-primary/20 flex-shrink-0">
          <AvatarImage src={profile?.avatar_url || undefined} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>

        {state !== "collapsed" && (
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-foreground truncate">
              {profile?.nome || user.email?.split('@')[0] || 'Usuário'}
            </p>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </div>

            <div className="flex items-center gap-1 mt-1.5">
              <Badge 
                variant="secondary" 
                className="text-xs px-2 py-0.5 bg-primary/10 text-primary hover:bg-primary/20"
              >
                <PawPrint className="h-3 w-3 mr-1" />
                {petsCount} {petsCount === 1 ? 'pet' : 'pets'}
              </Badge>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
