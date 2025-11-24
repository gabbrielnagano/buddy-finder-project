import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, Mail, Phone, PawPrint, Settings, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PetCard } from "@/components/PetCard";
import { useTranslation } from "react-i18next";

interface UserProfile {
  nome: string;
  avatar_url: string | null;
  cidade: string | null;
  estado: string | null;
  telefone: string | null;
}

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  age: string | null;
  size: string | null;
  gender: string | null;
  location: string | null;
  image_url: string | null;
  description: string | null;
  vaccinated: boolean;
  castrated: boolean;
  docile: boolean;
  special_needs: boolean;
  active: boolean;
}

export default function UserProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();
  const { t } = useTranslation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  const isOwnProfile = !userId || userId === user?.id;

  useEffect(() => {
    fetchProfileData();
  }, [userId, user]);

  const fetchProfileData = async () => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) return;

    try {
      // Buscar perfil
      const { data: profileData } = await supabase
        .from('perfis')
        .select('nome, avatar_url, cidade, estado, telefone')
        .eq('id', targetUserId)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Buscar email do usuário (apenas se for o próprio perfil)
      if (isOwnProfile && user) {
        setUserEmail(user.email || null);
      }

      // Buscar pets do usuário
      const { data: petsData } = await supabase
        .from('pets')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });

      if (petsData) {
        setPets(petsData);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="bg-card rounded-lg shadow-sm p-8 mb-8">
            <div className="flex items-start gap-6 mb-8">
              <Skeleton className="h-32 w-32 rounded-full" />
              <div className="flex-1 space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const initials = profile?.nome
    ? profile.nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : userEmail?.[0].toUpperCase() || 'U';

  const displayName = profile?.nome || userEmail?.split('@')[0] || 'Usuário';
  const location = profile?.cidade && profile?.estado
    ? `${profile.cidade}, ${profile.estado}`
    : profile?.cidade || profile?.estado || null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
              <Avatar className="h-32 w-32 border-4 border-primary/20">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary text-3xl font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-3xl font-bold text-foreground">{displayName}</h1>
                  {isOwnProfile && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/configuracoes')}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Editar Perfil
                    </Button>
                  )}
                </div>

                <div className="space-y-2 text-muted-foreground">
                  {location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{location}</span>
                    </div>
                  )}
                  
                  {isOwnProfile && userEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{userEmail}</span>
                    </div>
                  )}

                  {profile?.telefone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{profile.telefone}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full">
                    <PawPrint className="h-4 w-4" />
                    <span className="font-semibold">{pets.length}</span>
                    <span className="text-sm">{pets.length === 1 ? 'pet cadastrado' : 'pets cadastrados'}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pets Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <PawPrint className="h-6 w-6 text-primary" />
              {isOwnProfile ? 'Meus Pets' : `Pets de ${displayName}`}
            </h2>
            {isOwnProfile && pets.length > 0 && (
              <Button
                variant="outline"
                onClick={() => navigate('/adicionar-pet')}
              >
                Adicionar Pet
              </Button>
            )}
          </div>

          {pets.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <PawPrint className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {isOwnProfile ? 'Nenhum pet cadastrado ainda' : 'Este usuário não tem pets cadastrados'}
                </h3>
                {isOwnProfile && (
                  <>
                    <p className="text-muted-foreground mb-4">
                      Comece adicionando seu primeiro pet para adoção
                    </p>
                    <Button onClick={() => navigate('/adicionar-pet')}>
                      Adicionar Primeiro Pet
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <PetCard
                  key={pet.id}
                  id={pet.id}
                  name={pet.name}
                  image={pet.image_url || ''}
                  type={pet.species === 'Gato' ? 'gato' : 'cachorro'}
                  age={pet.age || ''}
                  location={pet.location || ''}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
