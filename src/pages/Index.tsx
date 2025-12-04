import { useState, useEffect } from "react";
import { Heart, Search, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PetSearchCard } from "@/components/PetSearchCard";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
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
const Index = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadPets();
  }, []);
  const loadPets = async () => {
    try {
      const { data, error } = await supabase
        .from('card')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data) {
        const formattedPets: Pet[] = data.map((card: any) => ({
          id: card.id,
          name: card.name,
          image: card.image_url || '',
          species: card.species as "cachorro" | "gato",
          breed: card.breed || 'SRD',
          age: card.age || 'adulto',
          size: card.size as "pequeno" | "medio" | "grande",
          gender: card.gender as "macho" | "femea",
          location: card.location || 'Brasil',
          description: card.description || '',
          vaccinated: card.vaccinated || false,
          castrated: card.castrated || false,
          docile: card.docile || false,
          active: card.active || false,
          specialNeeds: card.special_needs || false,
        }));
        setPets(formattedPets);
      }
    } catch (error) {
      console.error('Erro ao carregar pets:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <section className="relative px-6 py-16 md:py-24">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Encontre seu{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              companheiro perfeito
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            BuddyFinder conecta corações. Descubra animais esperando por um lar cheio de amor
            e transforme duas vidas para sempre.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" className="px-8" onClick={() => navigate('/buscar')}>
              <Search className="mr-2 h-5 w-5" />
              Buscar Pets
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              Como Funciona
            </Button>
          </div>
        </div>
      </section>
      <section className="px-6 py-16">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              Pets esperando por você ❤️
            </h2>
            <Button variant="outline" onClick={() => navigate('/buscar')}>
              Ver todos
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : pets.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Nenhum pet encontrado. Adicione o primeiro!</p>
              </div>
            ) : (
              pets.map((pet, index) => (
                <div 
                  key={pet.id} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <PetSearchCard pet={pet} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      <section className="px-6 py-16 bg-card/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Por que escolher o BuddyFinder?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-soft transition-all duration-300 hover-scale">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Adoção Responsável</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Conectamos pessoas com pets que precisam de um lar, garantindo que cada adoção
                  seja feita com responsabilidade e amor.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-soft transition-all duration-300 hover-scale">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Pets Verificados</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Todos os animais passam por verificação veterinária e têm histórico completo
                  disponível para os futuros tutores.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-soft transition-all duration-300 hover-scale">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Comunidade Ativa</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Faça parte de uma comunidade que se importa. Receba apoio e compartilhe
                  experiências com outros tutores.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="px-6 py-16 bg-card/50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Pronto para encontrar seu novo amigo?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Milhares de pets estão esperando por você. Comece sua jornada de adoção hoje!
          </p>
          <Button variant="warm" size="lg" className="px-8">
            Começar Agora
          </Button>
        </div>
      </section>
    </div>
  );
};
export default Index;
