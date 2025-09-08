import { Heart, Search, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PetSearchCard } from "@/components/PetSearchCard";

// Import pet images
import goldenRetrieverImg from "@/assets/pets/golden-retriever.jpg";
import orangeCatImg from "@/assets/pets/orange-cat.jpg";
import huskyPuppyImg from "@/assets/pets/husky-puppy.jpg";
import tuxedoCatImg from "@/assets/pets/tuxedo-cat.jpg";
import beagleMixImg from "@/assets/pets/beagle-mix.jpg";
import persianCatImg from "@/assets/pets/persian-cat.jpg";

const mockPets = [
  {
    id: "1",
    name: "Luna",
    image: goldenRetrieverImg,
    species: "cachorro" as const,
    breed: "Golden Retriever",
    age: "adulto",
    size: "grande" as const,
    gender: "femea" as const,
    location: "São Paulo, SP",
    description: "Luna é uma cadela carinhosa e muito inteligente. Ama brincar no parque e é ótima com crianças.",
    vaccinated: true,
    castrated: true,
    docile: true,
    active: true,
    specialNeeds: false
  },
  {
    id: "2", 
    name: "Milo",
    image: orangeCatImg,
    species: "gato" as const,
    breed: "SRD (Sem Raça Definida)",
    age: "filhote",
    size: "pequeno" as const,
    gender: "macho" as const,
    location: "Rio de Janeiro, RJ",
    description: "Milo é um gatinho brincalhão e cheio de energia. Adora carinho e ronrona muito alto.",
    vaccinated: true,
    castrated: false,
    docile: true,
    active: true,
    specialNeeds: false
  },
  {
    id: "3",
    name: "Zeus",
    image: huskyPuppyImg,
    species: "cachorro" as const,
    breed: "Husky Siberiano",
    age: "filhote",
    size: "medio" as const,
    gender: "macho" as const,
    location: "Belo Horizonte, MG",
    description: "Zeus é um filhote muito ativo e precisa de bastante exercício. Perfeito para famílias ativas.",
    vaccinated: true,
    castrated: false,
    docile: true,
    active: true,
    specialNeeds: false
  },
  {
    id: "4",
    name: "Nina",
    image: tuxedoCatImg,
    species: "gato" as const,
    breed: "SRD (Sem Raça Definida)",
    age: "adulto",
    size: "pequeno" as const,
    gender: "femea" as const,
    location: "Porto Alegre, RS",
    description: "Nina é uma gata tranquila e independente. Ideal para apartamentos e pessoas mais calmas.",
    vaccinated: true,
    castrated: true,
    docile: true,
    active: false,
    specialNeeds: false
  },
  {
    id: "5",
    name: "Buddy",
    image: beagleMixImg,
    species: "cachorro" as const,
    breed: "Beagle Mix",
    age: "adulto",
    size: "medio" as const,
    gender: "macho" as const,
    location: "Brasília, DF",
    description: "Buddy é um cão muito leal e companheiro. Adora longas caminhadas e é muito obediente.",
    vaccinated: true,
    castrated: true,
    docile: true,
    active: true,
    specialNeeds: false
  },
  {
    id: "6",
    name: "Princesa",
    image: persianCatImg,
    species: "gato" as const,
    breed: "Persa",
    age: "idoso",
    size: "pequeno" as const,
    gender: "femea" as const,
    location: "Salvador, BA",
    description: "Princesa é uma gata sênior muito carinhosa. Procura um lar tranquilo para seus anos dourados.",
    vaccinated: true,
    castrated: true,
    docile: true,
    active: false,
    specialNeeds: true
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
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
            <Button variant="hero" size="lg" className="px-8">
              <Search className="mr-2 h-5 w-5" />
              Buscar Pets
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              Como Funciona
            </Button>
          </div>
        </div>
      </section>

      {/* Pet Feed Section */}
      <section className="px-6 py-16">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-foreground">
              Pets esperando por você ❤️
            </h2>
            <Button variant="outline">
              Ver todos
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPets.map((pet, index) => (
              <div 
                key={pet.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PetSearchCard pet={pet} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
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

      {/* CTA Section */}
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
