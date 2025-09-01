import { useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark, Eye, MapPin, Calendar, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

interface PetSearchCardProps {
  pet: Pet;
}

export function PetSearchCard({ pet }: PetSearchCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50) + 5);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const getSizeLabel = (size: string) => {
    switch (size) {
      case "pequeno": return "Pequeno";
      case "medio": return "Médio";
      case "grande": return "Grande";
      default: return size;
    }
  };

  const getAgeLabel = (age: string) => {
    switch (age) {
      case "filhote": return "Filhote";
      case "adulto": return "Adulto";
      case "idoso": return "Idoso";
      default: return age;
    }
  };

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case "macho": return "Macho";
      case "femea": return "Fêmea";
      default: return gender;
    }
  };

  const getCharacteristics = () => {
    const characteristics = [];
    if (pet.vaccinated) characteristics.push("Vacinado");
    if (pet.castrated) characteristics.push("Castrado");
    if (pet.docile) characteristics.push("Dócil");
    if (pet.active) characteristics.push("Ativo");
    if (pet.specialNeeds) characteristics.push("Necessidades Especiais");
    return characteristics;
  };

  return (
    <Card className="overflow-hidden hover:shadow-soft transition-all duration-300 animate-fade-in group">
      <div className="relative">
        <img 
          src={pet.image} 
          alt={pet.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          <Badge 
            variant={pet.species === "cachorro" ? "default" : "secondary"} 
            className="text-xs font-medium shadow-sm"
          >
            {pet.species === "cachorro" ? "🐕 Cachorro" : "🐱 Gato"}
          </Badge>
          <Badge variant="outline" className="text-xs bg-white/90 backdrop-blur-sm">
            {getAgeLabel(pet.age)}
          </Badge>
        </div>
        <div className="absolute bottom-3 right-3">
          <Badge variant="outline" className="text-xs bg-white/90 backdrop-blur-sm flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {pet.location}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-foreground mb-1">{pet.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{pet.breed}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {getGenderLabel(pet.gender)}
              </span>
              <span>•</span>
              <span>{getSizeLabel(pet.size)}</span>
            </div>
          </div>
        </div>

        {/* Pet Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {pet.description}
        </p>

        {/* Characteristics */}
        {getCharacteristics().length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {getCharacteristics().slice(0, 3).map((characteristic, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs bg-primary/5 text-primary border-primary/20"
              >
                {characteristic}
              </Badge>
            ))}
            {getCharacteristics().length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{getCharacteristics().length - 3}
              </Badge>
            )}
          </div>
        )}
        
        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`hover-scale ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
            >
              <Heart 
                className={`h-4 w-4 mr-1 transition-colors ${isLiked ? 'fill-current' : ''}`} 
              />
              <span className="text-sm">{likeCount}</span>
            </Button>
            
            <Button
              variant="ghost" 
              size="sm"
              className="text-muted-foreground hover-scale"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="text-sm">{Math.floor(Math.random() * 15) + 1}</span>
            </Button>
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm" 
              className="text-muted-foreground hover-scale"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className={`hover-scale ${isSaved ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button variant="outline" className="flex-1" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Ver mais
          </Button>
          <Button className="flex-1" size="sm">
            <Heart className="h-4 w-4 mr-2" />
            Quero adotar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}