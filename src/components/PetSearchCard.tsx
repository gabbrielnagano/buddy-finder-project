import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2, Bookmark, Eye, MapPin, Calendar, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PetPopup } from "./PetPopup";
import { CommentsModal } from "./CommentsModal";
import { ShareModal } from "./ShareModal";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  distance?: number;
}

interface PetSearchCardProps {
  pet: Pet;
}

export function PetSearchCard({ pet }: PetSearchCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);

  const isLiked = isFavorite(pet.id);

  // Fetch real counts from database
  useEffect(() => {
    fetchCounts();
  }, [pet.id]);

  const fetchCounts = async () => {
    try {
      // Get favorites count
      const { count: favCount } = await supabase
        .from('favoritos')
        .select('*', { count: 'exact', head: true })
        .eq('pet_id', pet.id);

      setLikeCount(favCount || 0);

      // Get comments count
      const { count: commCount } = await supabase
        .from('comentarios')
        .select('*', { count: 'exact', head: true })
        .eq('pet_id', pet.id);

      setCommentCount(commCount || 0);
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const { data, error } = await supabase
        .from('comentarios')
        .select('*')
        .eq('pet_id', pet.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Erro ao carregar comentários",
        variant: "destructive"
      });
    } finally {
      setLoadingComments(false);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleFavorite(pet);
    // Refetch to get updated count
    await fetchCounts();
  };

  const handleCommentClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await fetchComments();
    setIsCommentsOpen(true);
  };

  const handleAddComment = async (comment: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Você precisa estar logado para comentar",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('comentarios')
        .insert({
          pet_id: pet.id,
          usuario_id: user.id,
          comentario: comment
        });

      if (error) throw error;

      toast({
        title: "Comentário adicionado com sucesso!"
      });

      // Refetch comments and counts
      await fetchComments();
      await fetchCounts();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Erro ao adicionar comentário",
        variant: "destructive"
      });
    }
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation(); // Previne o click de abrir o modal
    setIsSaved(!isSaved);
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsShareOpen(true);
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
    <>
      <PetPopup 
        pet={pet}
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
      />
      <CommentsModal
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        petName={pet.name}
        comments={comments}
        onAddComment={handleAddComment}
        loading={loadingComments}
      />
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        url={`${window.location.origin}/pet/${pet.id}`}
        title={`${pet.name} - Adote um Pet`}
        text={`Conheça ${pet.name}, ${pet.breed} disponível para adoção!${pet.description ? ' ' + pet.description.slice(0, 100) + '...' : ''}`}
      />
      <Card className="overflow-hidden hover:shadow-soft transition-all duration-300 animate-fade-in group">
        <div className="relative cursor-pointer" onClick={() => setIsDialogOpen(true)}>
          <img 
            src={pet.image} 
            alt={pet.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-card/95 rounded-full px-4 py-2 backdrop-blur-sm border border-border">
              <span className="text-sm font-medium text-card-foreground">{t('pet.viewDetails')}</span>
            </div>
          </div>
          <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
            <Badge 
              variant={pet.species === "cachorro" ? "default" : "secondary"} 
              className="text-xs font-medium shadow-sm"
            >
              {pet.species === "cachorro" ? "🐕 Cachorro" : "🐱 Gato"}
            </Badge>
            <Badge variant="outline" className="text-xs bg-card border-border text-card-foreground">
              {getAgeLabel(pet.age)}
            </Badge>
          </div>
          <div className="absolute bottom-3 right-3 flex gap-2">
            {pet.distance && (
              <Badge variant="default" className="text-xs bg-primary text-primary-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {pet.distance.toFixed(1)} km
              </Badge>
            )}
            <Badge variant="outline" className="text-xs bg-card border-border text-card-foreground flex items-center gap-1">
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
                <Badge variant="outline" className="text-xs bg-muted text-muted-foreground">
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
                onClick={handleCommentClick}
                className="text-muted-foreground hover-scale"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                <span className="text-sm">{commentCount}</span>
              </Button>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
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
    </>
  );
}