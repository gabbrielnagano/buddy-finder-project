import { Heart, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/contexts/FavoritesContext";
import { PetSearchCard } from "@/components/PetSearchCard";

export default function Favoritos() {
  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-red-500 fill-current" />
            <h1 className="text-4xl font-bold text-foreground">
              Animais Favoritos
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Seus pets favoritos salvos para adoção futura
          </p>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-foreground">
            {favorites.length} favorito{favorites.length !== 1 ? 's' : ''}
          </h2>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-muted-foreground mb-4">
                <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Nenhum favorito ainda</h3>
                <p className="mb-4">Comece a adicionar pets aos seus favoritos para vê-los aqui.</p>
              </div>
              <Button asChild>
                <a href="/" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Buscar Pets
                </a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((pet, index) => (
              <div 
                key={pet.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PetSearchCard pet={pet} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}