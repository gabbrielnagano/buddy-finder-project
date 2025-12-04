import { Heart, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/contexts/FavoritesContext";
import { PetSearchCard } from "@/components/PetSearchCard";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function Favoritos() {
  const { favorites } = useFavorites();
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="h-8 w-8 text-red-500 fill-current" />
            <h1 className="text-4xl font-bold text-foreground">
              {t('favorites.title')}
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            {t('favorites.subtitle')}
          </p>
        </div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-foreground">
            {t('favorites.count', { count: favorites.length })}
          </h2>
        </div>
        {favorites.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-muted-foreground mb-4">
                <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">{t('favorites.empty')}</h3>
                <p className="mb-4">{t('favorites.emptyDescription')}</p>
              </div>
              <Button asChild>
                <Link to="/" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  {t('favorites.searchPets')}
                </Link>
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