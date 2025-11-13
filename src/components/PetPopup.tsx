import { useState, useEffect } from "react";
import { X, Heart, Share2, Bookmark, MapPin, Calendar, Shield, Activity, Users, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

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
  user_name: string;
  user_avatar: string | null;
  comment: string;
  created_at: string;
}

const mockComments: Comment[] = [
  {
    id: "1",
    user_name: "Maria Silva",
    user_avatar: "/avatars/maria.jpg",
    comment: "Que fofinho! Parece ser muito carinhoso ❤️",
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "2", 
    user_name: "João Santos",
    user_avatar: "/avatars/joao.jpg",
    comment: "Já adotei um pet através desta plataforma. Recomendo muito!",
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "3",
    user_name: "Ana Costa",
    user_avatar: "/avatars/ana.jpg", 
    comment: "Gostaria de saber mais informações sobre a adoção.",
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

interface PetPopupProps {
  pet: Pet | null;
  open: boolean;
  onClose: () => void;
}

export function PetPopup({ pet, open, onClose }: PetPopupProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [likeCount, setLikeCount] = useState(127);
  const [loadingComments, setLoadingComments] = useState(false);

  // Carregar comentários quando o popup abrir
  useEffect(() => {
    if (open && pet) {
      loadComments();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pet?.id]);

  const loadComments = async () => {
    if (!pet) return;
    
    setLoadingComments(true);
    try {
      const { data, error } = await supabase
        .from('comentarios')
        .select('*')
        .eq('pet_id', pet.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        // Mapear dados do banco para o formato esperado
        const formattedComments: Comment[] = data.map(c => ({
          id: c.id,
          user_name: 'Usuário', // TODO: Buscar nome do usuário
          user_avatar: null,
          comment: c.comentario,
          created_at: c.created_at || new Date().toISOString()
        }));
        setComments(formattedComments);
      }
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    } finally {
      setLoadingComments(false);
    }
  };

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

  const handleAddComment = async () => {
    if (!newComment.trim() || !pet) return;

    try {
      const { data, error } = await supabase
        .from('comentarios')
        .insert([
          {
            pet_id: pet.id,
            usuario_id: user?.id || 'anonymous',
            comentario: newComment.trim()
          }
        ])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        // Adicionar o comentário à lista local
        const newCommentObj: Comment = {
          id: data.id,
          user_name: user?.user_metadata?.name || 'Você',
          user_avatar: null,
          comment: data.comentario,
          created_at: data.created_at || new Date().toISOString()
        };
        setComments([newCommentObj, ...comments]);
        setNewComment("");
        toast({
          title: "Comentário adicionado!",
          description: "Seu comentário foi publicado com sucesso.",
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o comentário.",
        variant: "destructive",
      });
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

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMinutes < 1) return "agora";
    if (diffInMinutes < 60) return `há ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
    if (diffInHours < 24) return `há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    if (diffInDays < 7) return `há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
    return date.toLocaleDateString('pt-BR');
  };

  if (!open || !pet) return null;

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
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 bg-background/80 backdrop-blur-sm hover:bg-background/90 rounded-full"
          onClick={onClose}
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Image Section */}
          <div className="relative bg-muted">
            <img 
              src={pet.image} 
              alt={pet.name}
              className="w-full h-full object-cover min-h-[250px] sm:min-h-[300px] lg:min-h-[600px]"
            />
            
            {/* Action Buttons Overlay */}
            <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 flex justify-between items-end">
              <div className="flex items-center gap-1 sm:gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-background/90 backdrop-blur-sm hover:bg-background text-foreground shadow-lg text-xs sm:text-sm p-1 sm:p-2"
                  onClick={handleLike}
                >
                  <Heart className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  <span className="hidden sm:inline">{likeCount}</span>
                  <span className="sm:hidden">{likeCount > 999 ? '999+' : likeCount}</span>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-background/90 backdrop-blur-sm hover:bg-background text-foreground shadow-lg text-xs sm:text-sm p-1 sm:p-2"
                >
                  <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{comments.length}</span>
                  <span className="sm:hidden">{comments.length}</span>
                </Button>
              </div>
              
              <div className="flex gap-1 sm:gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="bg-background/90 backdrop-blur-sm hover:bg-background text-foreground shadow-lg h-8 w-8 sm:h-10 sm:w-10"
                  onClick={handleShare}
                >
                  <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="bg-background/90 backdrop-blur-sm hover:bg-background text-foreground shadow-lg h-8 w-8 sm:h-10 sm:w-10"
                  onClick={() => setIsSaved(!isSaved)}
                >
                  <Bookmark className={`h-3 w-3 sm:h-4 sm:w-4 ${isSaved ? 'fill-primary text-primary' : ''}`} />
                </Button>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-3 sm:p-6 border-b">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div>
                  <h1 className="text-xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
                    {pet.name} {pet.species === "cachorro" ? "🐕" : "🐱"}
                  </h1>
                  <p className="text-sm sm:text-lg text-muted-foreground mb-1 sm:mb-2">
                    {pet.breed}
                  </p>
                  <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground flex-wrap">
                    <span className="capitalize">{pet.age}</span>
                    <span>•</span>
                    <span className="capitalize">{pet.gender}</span>
                    <span>•</span>
                    <span className="capitalize">Porte {pet.size}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>{pet.location}</span>
              </div>
            </div>

            {/* Scrollable Content */}
            <ScrollArea className="flex-1">
              <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
                {/* Description */}
                <div>
                  <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">Sobre {pet.name}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {pet.description}
                  </p>
                </div>

                {/* Characteristics */}
                {getCharacteristics().length > 0 && (
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">Características</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {getCharacteristics().map((char, index) => (
                        <div key={index} className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg bg-muted/50">
                          <char.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${char.color}`} />
                          <span className="font-medium text-sm sm:text-base">{char.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Comments Section */}
                <div>
                  <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Comentários ({comments.length})</h3>
                  
                  {/* Add Comment */}
                  <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                      <AvatarFallback>V</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex gap-2">
                      <Input
                        placeholder="Adicione um comentário..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                        className="flex-1 text-sm"
                      />
                      <Button onClick={handleAddComment} size="sm" className="h-8 w-8 sm:h-10 sm:w-auto px-2 sm:px-4">
                        <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Comments List */}
                  <div className="space-y-3 sm:space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex gap-2 sm:gap-3">
                        <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                          <AvatarImage src={comment.user_avatar || undefined} alt={comment.user_name} />
                          <AvatarFallback>{comment.user_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs sm:text-sm font-medium">{comment.user_name}</span>
                            <span className="text-xs text-muted-foreground">{formatTimeAgo(comment.created_at)}</span>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground">{comment.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Bottom Actions */}
            <div className="p-3 sm:p-6 border-t bg-background">
              <div className="flex gap-2 sm:gap-3 flex-col sm:flex-row">
                <Button className="flex-1 text-sm sm:text-base" size="sm">
                  ❤️ Quero Adotar
                </Button>
                <Button variant="outline" className="flex-1 text-sm sm:text-base" size="sm">
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