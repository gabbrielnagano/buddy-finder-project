import { useState } from "react";
import { Heart, Share2, Bookmark, MapPin, Calendar, Users, Shield, Activity, Star, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface Comment {
  id: string;
  user: string;
  avatar: string;
  comment: string;
  timestamp: string;
}

const mockComments: Comment[] = [
  {
    id: "1",
    user: "Maria Silva",
    avatar: "/avatars/maria.jpg",
    comment: "Que fofinho! Parece ser muito carinhoso ❤️",
    timestamp: "há 2 horas"
  },
  {
    id: "2", 
    user: "João Santos",
    avatar: "/avatars/joao.jpg",
    comment: "Já adotei um pet através desta plataforma. Recomendo!",
    timestamp: "há 5 horas"
  },
  {
    id: "3",
    user: "Ana Costa",
    avatar: "/avatars/ana.jpg", 
    comment: "Gostaria de saber mais informações sobre a adoção.",
    timestamp: "há 1 dia"
  }
];

interface PetDetailsDialogProps {
  pet: Pet | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PetDetailsDialog({ pet, open, onOpenChange }: PetDetailsDialogProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(mockComments);

  if (!pet) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Conheça ${pet.name}`,
        text: `${pet.name} está disponível para adoção!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Could add a toast notification here
    }
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        user: "Você",
        avatar: "/avatars/default.jpg",
        comment: newComment,
        timestamp: "agora"
      };
      setComments([comment, ...comments]);
      setNewComment("");
    }
  };

  const getSpeciesIcon = () => {
    return pet.species === "cachorro" ? "🐕" : "🐱";
  };

  const getGenderIcon = () => {
    return pet.gender === "macho" ? "♂️" : "♀️";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Image Section */}
          <div className="relative bg-muted">
            <img 
              src={pet.image} 
              alt={pet.name}
              className="w-full h-full object-cover min-h-[400px] lg:min-h-[600px]"
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
                onClick={() => setIsSaved(!isSaved)}
              >
                <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-primary text-primary' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex flex-col h-full">
            <DialogHeader className="p-6 pb-4">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                {pet.name} {getSpeciesIcon()}
              </DialogTitle>
              <DialogDescription className="text-base">
                {pet.breed} • {pet.age} • {getGenderIcon()} {pet.gender}
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-hidden flex flex-col">
              <ScrollArea className="flex-1 px-6">
                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4" />
                  {pet.location}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Sobre {pet.name}</h3>
                  <p className="text-muted-foreground leading-relaxed">{pet.description}</p>
                </div>

                {/* Characteristics */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Características</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Porte {pet.size}
                    </Badge>
                    {pet.vaccinated && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Vacinado
                      </Badge>
                    )}
                    {pet.castrated && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Castrado
                      </Badge>
                    )}
                    {pet.docile && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        Dócil
                      </Badge>
                    )}
                    {pet.active && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        Ativo
                      </Badge>
                    )}
                    {pet.specialNeeds && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        Necessidades Especiais
                      </Badge>
                    )}
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Comments Section */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-4">Comentários</h3>
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.avatar} alt={comment.user} />
                          <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium">{comment.user}</span>
                            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{comment.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>

              {/* Comment Input & Actions */}
              <div className="p-6 pt-4 border-t bg-background">
                {/* Add Comment */}
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Adicione um comentário..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                    className="flex-1"
                  />
                  <Button onClick={handleAddComment} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button className="flex-1" size="lg">
                    Quero Adotar
                  </Button>
                  <Button variant="outline" size="lg">
                    Entrar em Contato
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}