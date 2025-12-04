import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
interface Pet {
  id: string;
  name: string;
  image: string;
  species: "cachorro" | "gato";
  breed: string;
  age: string;
  size: "pequeno" | "medio" | "grande";
  gender: "macho" | "femea";
  location: string;
  description: string;
  vaccinated: boolean;
  castrated: boolean;
  docile: boolean;
  active: boolean;
  specialNeeds: boolean;
}
interface FavoritesContextType {
  favorites: Pet[];
  addToFavorites: (pet: Pet) => Promise<void>;
  removeFromFavorites: (petId: string) => Promise<void>;
  isFavorite: (petId: string) => boolean;
  toggleFavorite: (pet: Pet) => Promise<void>;
  loading: boolean;
}
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  useEffect(() => {
    loadFavorites();
  }, []);
  const loadFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      const { data: favoritosData, error } = await supabase
        .from('favoritos')
        .select('pet_id')
        .eq('usuario_id', user.id);
      if (error) throw error;
      if (favoritosData && favoritosData.length > 0) {
        const petIds = favoritosData.map(f => f.pet_id);
        const { data: petsData, error: petsError } = await supabase
          .from('card')
          .select('*')
          .in('id', petIds);
        if (petsError) throw petsError;
        const formattedPets: Pet[] = (petsData || []).map(card => ({
          id: card.id,
          name: card.name,
          image: card.image_url || '',
          species: card.species as "cachorro" | "gato",
          breed: card.breed || '',
          age: card.age || '',
          size: card.size as "pequeno" | "medio" | "grande",
          gender: card.gender as "macho" | "femea",
          location: card.location || '',
          description: card.description || '',
          vaccinated: card.vaccinated,
          castrated: card.castrated,
          docile: card.docile,
          active: card.active,
          specialNeeds: card.special_needs,
        }));
        setFavorites(formattedPets);
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    } finally {
      setLoading(false);
    }
  };
  const addToFavorites = async (pet: Pet) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para adicionar favoritos",
          variant: "destructive",
        });
        return;
      }
      const { error } = await supabase
        .from('favoritos')
        .insert({ usuario_id: user.id, pet_id: pet.id });
      if (error) throw error;
      setFavorites(prev => {
        if (prev.find(p => p.id === pet.id)) return prev;
        return [...prev, pet];
      });
      toast({
        title: "Sucesso",
        description: "Pet adicionado aos favoritos",
      });
    } catch (error: any) {
      console.error('Erro ao adicionar favorito:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao adicionar favorito",
        variant: "destructive",
      });
    }
  };
  const removeFromFavorites = async (petId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase
        .from('favoritos')
        .delete()
        .eq('usuario_id', user.id)
        .eq('pet_id', petId);
      if (error) throw error;
      setFavorites(prev => prev.filter(p => p.id !== petId));
      toast({
        title: "Sucesso",
        description: "Pet removido dos favoritos",
      });
    } catch (error: any) {
      console.error('Erro ao remover favorito:', error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao remover favorito",
        variant: "destructive",
      });
    }
  };
  const isFavorite = (petId: string) => {
    return favorites.some(p => p.id === petId);
  };
  const toggleFavorite = async (pet: Pet) => {
    if (isFavorite(pet.id)) {
      await removeFromFavorites(pet.id);
    } else {
      await addToFavorites(pet);
    }
  };
  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      toggleFavorite,
      loading
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}