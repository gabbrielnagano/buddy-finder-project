import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Send, MessageCircle } from 'lucide-react';

interface Comment {
  id: string;
  comment: string;
  created_at: string;
  user_id: string;
}

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  petName: string;
  comments: Comment[];
  onAddComment: (comment: string) => Promise<void>;
  loading: boolean;
}

export function CommentsModal({
  isOpen,
  onClose,
  petName,
  comments,
  onAddComment,
  loading
}: CommentsModalProps) {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    await onAddComment(newComment);
    setNewComment('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comentários - {petName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Lista de comentários */}
          <ScrollArea className="h-60">
            {comments.length > 0 ? (
              <div className="space-y-3 pr-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {comment.user_id.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{comment.comment}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(comment.created_at), {
                          addSuffix: true,
                          locale: ptBR
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <MessageCircle className="h-12 w-12 mb-2" />
                <p className="text-sm">Nenhum comentário ainda</p>
                <p className="text-xs">Seja o primeiro a comentar!</p>
              </div>
            )}
          </ScrollArea>

          {/* Formulário para novo comentário */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva um comentário..."
              className="min-h-[80px] resize-none"
              maxLength={500}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {newComment.length}/500
              </span>
              <Button 
                type="submit" 
                size="sm" 
                disabled={loading || !newComment.trim()}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Comentar
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}