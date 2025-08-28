import { useState } from "react";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
            <Badge variant="outline" className="text-xs bg-white/90 backdrop-blur-sm">
              {age}
            </Badge>
          )}
        </div>
        {location && (
          <div className="absolute bottom-3 right-3">
            <Badge variant="outline" className="text-xs bg-white/90 backdrop-blur-sm">
              📍 {location}
            </Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg text-foreground">{name}</h3>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`hover-scale ${isLiked ? 'text-red-500' : 'text-muted-foreground'}`}
            >
              <Heart 
                className={`h-5 w-5 mr-1 transition-colors ${isLiked ? 'fill-current' : ''}`} 
              />
              <span className="text-sm">{likeCount}</span>
            </Button>
            
            <Button
              variant="ghost" 
              size="sm"
              className="text-muted-foreground hover-scale"
            >
              <MessageCircle className="h-5 w-5 mr-1" />
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
      </CardContent>
    </Card>
  );
}