import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
interface PetCardProps {
  id: string;
  name: string;
  image: string;
  type: "cachorro" | "gato";
  age?: string;
  location?: string;
}
export function PetCard({ id, name, image, type, age, location }: PetCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-soft transition-all duration-300 animate-fade-in group">
      <div className="relative">
        <img 
          src={image} 
          alt={name}
          className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge 
            variant={type === "cachorro" ? "default" : "secondary"} 
            className="text-xs font-medium shadow-sm"
          >
            {type === "cachorro" ? "🐕 Cachorro" : "🐱 Gato"}
          </Badge>
          {age && (
            <Badge variant="outline" className="text-xs bg-card border-border text-card-foreground">
              {age}
            </Badge>
          )}
        </div>
        {location && (
          <div className="absolute bottom-3 right-3">
            <Badge variant="outline" className="text-xs bg-card border-border text-card-foreground">
              📍 {location}
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg text-foreground">{name}</h3>
        </div>
      </CardContent>
    </Card>
  );
}