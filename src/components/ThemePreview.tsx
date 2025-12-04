import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share } from "lucide-react";
interface ThemePreviewProps {
  theme: string;
}
export const ThemePreview = ({ theme }: ThemePreviewProps) => {
  return (
    <div className={`${theme === 'dark' ? 'dark' : ''} p-4 rounded-lg border bg-background transition-all duration-300`}>
      <Card className="w-full max-w-sm mx-auto">
        <div className="relative">
          <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-t-lg flex items-center justify-center">
            <div className="w-16 h-16 bg-primary/30 rounded-full flex items-center justify-center">
              <span className="text-2xl">🐕</span>
            </div>
          </div>
          <div className="absolute top-2 right-2">
            <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Max</CardTitle>
            <Badge variant="secondary">2 anos</Badge>
          </div>
          <CardDescription className="text-sm">
            Golden Retriever • São Paulo, SP
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-3">
            Cão amigável e brincalhão procurando um lar...
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              <MessageCircle className="w-3 h-3 mr-1" />
              Contato
            </Button>
            <Button size="sm" variant="outline">
              <Share className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
      <p className="text-center text-xs text-muted-foreground mt-2">
        Pré-visualização do tema {theme === 'light' ? 'claro' : theme === 'dark' ? 'escuro' : 'sistema'}
      </p>
    </div>
  );
};