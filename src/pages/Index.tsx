import { Heart, Search, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

      {/* Features Section */}
      <section className="px-6 py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
            Por que escolher o BuddyFinder?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-soft transition-all duration-300">
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

            <Card className="text-center hover:shadow-soft transition-all duration-300">
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

            <Card className="text-center hover:shadow-soft transition-all duration-300">
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
