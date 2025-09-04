import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  addToFavorites: (pet: Pet) => void;
  removeFromFavorites: (petId: string) => void;
  isFavorite: (petId: string) => boolean;
  toggleFavorite: (pet: Pet) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Pet[]>([]);

  // Carregar favoritos do localStorage na inicialização
  useEffect(() => {
    const savedFavorites = localStorage.getItem('pet-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Salvar favoritos no localStorage sempre que a lista mudar
  useEffect(() => {
    localStorage.setItem('pet-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (pet: Pet) => {
    setFavorites(prev => {
      if (prev.find(p => p.id === pet.id)) return prev;
      return [...prev, pet];
    });
  };

  const removeFromFavorites = (petId: string) => {
    setFavorites(prev => prev.filter(p => p.id !== petId));
  };

  const isFavorite = (petId: string) => {
    return favorites.some(p => p.id === petId);
  };

  const toggleFavorite = (pet: Pet) => {
    if (isFavorite(pet.id)) {
      removeFromFavorites(pet.id);
    } else {
      addToFavorites(pet);
    }
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      toggleFavorite
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