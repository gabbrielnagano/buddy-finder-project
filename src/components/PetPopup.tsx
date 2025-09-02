import { useState } from "react";
import { X, Heart, Share2, Bookmark, MapPin, Calendar, Shield, Activity, Users, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    comment: "Já adotei um pet através desta plataforma. Recomendo muito!",
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

interface PetPopupProps {
  pet: Pet | null;
  open: boolean;
  onClose: () => void;
}

export function PetPopup({ pet, open, onClose }: PetPopupProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(mockComments);
  const [likeCount, setLikeCount] = useState(127);

  if (!open || !pet) return null;

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Conheça ${pet.name}`,
          text: `${pet.name} está disponível para adoção!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Erro ao compartilhar');
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        // Toast notification could be added here
      } catch (err) {
        console.log('Erro ao copiar link');
      }
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

  const getCharacteristics = () => {
    const characteristics = [];
    if (pet.vaccinated) characteristics.push({ icon: Shield, label: "Vacinado", color: "text-green-600" });
    if (pet.castrated) characteristics.push({ icon: Calendar, label: "Castrado", color: "text-blue-600" });
    if (pet.docile) characteristics.push({ icon: Heart, label: "Dócil", color: "text-pink-600" });
    if (pet.active) characteristics.push({ icon: Activity, label: "Ativo", color: "text-orange-600" });
    if (pet.specialNeeds) characteristics.push({ icon: Users, label: "Necessidades Especiais", color: "text-purple-600" });
    return characteristics;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup Content */}
      <div className="relative bg-background rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm hover:bg-background/90 rounded-full"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Image Section */}
          <div className="relative bg-muted">
            <img 
              src={pet.image} 
              alt={pet.name}
              className="w-full h-full object-cover min-h-[300px] lg:min-h-[600px]"
            />
            
            {/* Action Buttons Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-background/90 backdrop-blur-sm hover:bg-background text-foreground shadow-lg"
                  onClick={handleLike}
                >
                  <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  {likeCount}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-background/90 backdrop-blur-sm hover:bg-background text-foreground shadow-lg"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  {comments.length}
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="bg-background/90 backdrop-blur-sm hover:bg-background text-foreground shadow-lg"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="bg-background/90 backdrop-blur-sm hover:bg-background text-foreground shadow-lg"
                  onClick={() => setIsSaved(!isSaved)}
                >
                  <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-primary text-primary' : ''}`} />
                </Button>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {pet.name} {pet.species === "cachorro" ? "🐕" : "🐱"}
                  </h1>
                  <p className="text-lg text-muted-foreground mb-2">
                    {pet.breed}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="capitalize">{pet.age}</span>
                    <span>•</span>
                    <span className="capitalize">{pet.gender}</span>
                    <span>•</span>
                    <span className="capitalize">Porte {pet.size}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{pet.location}</span>
              </div>
            </div>

            {/* Scrollable Content */}
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="font-semibold text-lg mb-3">Sobre {pet.name}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {pet.description}
                  </p>
                </div>

                {/* Characteristics */}
                {getCharacteristics().length > 0 && (
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Características</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {getCharacteristics().map((char, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <char.icon className={`h-5 w-5 ${char.color}`} />
                          <span className="font-medium">{char.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comments Section */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Comentários ({comments.length})</h3>
                  
                  {/* Add Comment */}
                  <div className="flex gap-3 mb-6">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>V</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex gap-2">
                      <Input
                        placeholder="Adicione um comentário..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                        className="flex-1"
                      />
                      <Button onClick={handleAddComment} size="sm">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Comments List */}
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
              </div>
            </ScrollArea>

            {/* Bottom Actions */}
            <div className="p-6 border-t bg-background">
              <div className="flex gap-3">
                <Button className="flex-1" size="lg">
                  ❤️ Quero Adotar
                </Button>
                <Button variant="outline" size="lg">
                  💬 Conversar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}