import { useState } from "react";
import { Search, Filter, MapPin, Sliders } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PetSearchCard } from "@/components/PetSearchCard";

// Import pet images
import goldenRetrieverImg from "@/assets/pets/golden-retriever.jpg";
import orangeCatImg from "@/assets/pets/orange-cat.jpg";
import huskyPuppyImg from "@/assets/pets/husky-puppy.jpg";
import tuxedoCatImg from "@/assets/pets/tuxedo-cat.jpg";
import beagleMixImg from "@/assets/pets/beagle-mix.jpg";
import persianCatImg from "@/assets/pets/persian-cat.jpg";

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

const mockPets: Pet[] = [
  {
    id: "1",
    name: "Luna",
    image: goldenRetrieverImg,
    species: "cachorro",
    breed: "Golden Retriever",
    age: "adulto",
    size: "grande",
    gender: "femea",
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
    species: "gato",
    breed: "SRD (Sem Raça Definida)",
    age: "filhote",
    size: "pequeno",
    gender: "macho",
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
    species: "cachorro",
    breed: "Husky Siberiano",
    age: "filhote",
    size: "medio",
    gender: "macho",
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
    species: "gato",
    breed: "SRD (Sem Raça Definida)",
    age: "adulto",
    size: "pequeno",
    gender: "femea",
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
    species: "cachorro",
    breed: "Beagle Mix",
    age: "adulto",
    size: "medio",
    gender: "macho",
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
    species: "gato",
    breed: "Persa",
    age: "idoso",
    size: "pequeno",
    gender: "femea",
    location: "Salvador, BA",
    description: "Princesa é uma gata sênior muito carinhosa. Procura um lar tranquilo para seus anos dourados.",
    vaccinated: true,
    castrated: true,
    docile: true,
    active: false,
    specialNeeds: true
  }
];

export default function BuscarPets() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    species: "",
    breed: "",
    age: "",
    size: "",
    gender: "",
    location: "",
    vaccinated: false,
    castrated: false,
    docile: false,
    active: false,
    specialNeeds: false
  });

  const filteredPets = mockPets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecies = !filters.species || pet.species === filters.species;
    const matchesBreed = !filters.breed || pet.breed.toLowerCase().includes(filters.breed.toLowerCase());
    const matchesAge = !filters.age || pet.age === filters.age;
    const matchesSize = !filters.size || pet.size === filters.size;
    const matchesGender = !filters.gender || pet.gender === filters.gender;
    const matchesLocation = !filters.location || pet.location.toLowerCase().includes(filters.location.toLowerCase());
    
    const matchesVaccinated = !filters.vaccinated || pet.vaccinated === filters.vaccinated;
    const matchesCastrated = !filters.castrated || pet.castrated === filters.castrated;
    const matchesDocile = !filters.docile || pet.docile === filters.docile;
    const matchesActive = !filters.active || pet.active === filters.active;
    const matchesSpecialNeeds = !filters.specialNeeds || pet.specialNeeds === filters.specialNeeds;

    return matchesSearch && matchesSpecies && matchesBreed && matchesAge && 
           matchesSize && matchesGender && matchesLocation && matchesVaccinated && 
           matchesCastrated && matchesDocile && matchesActive && matchesSpecialNeeds;
  });

  const clearFilters = () => {
    setFilters({
      species: "",
      breed: "",
      age: "",
      size: "",
      gender: "",
      location: "",
      vaccinated: false,
      castrated: false,
      docile: false,
      active: false,
      specialNeeds: false
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">
            Buscar Pets para Adoção
          </h1>
          <p className="text-lg text-muted-foreground">
            Encontre seu novo melhor amigo usando nossos filtros avançados
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Busque por nome, raça ou localização..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Sliders className="h-4 w-4" />
                Filtros Avançados
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Filters */}
        {showFilters && (
          <Card className="mb-6 animate-fade-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros Avançados
                </CardTitle>
                <Button variant="ghost" onClick={clearFilters} className="text-sm">
                  Limpar Filtros
                </Button>
              </div>
              <CardDescription>
                Refine sua busca para encontrar o pet ideal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Filters */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <Label htmlFor="species" className="text-sm font-medium mb-2 block">Espécie</Label>
                  <Select value={filters.species} onValueChange={(value) => setFilters({...filters, species: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas</SelectItem>
                      <SelectItem value="cachorro">Cachorro</SelectItem>
                      <SelectItem value="gato">Gato</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="age" className="text-sm font-medium mb-2 block">Idade</Label>
                  <Select value={filters.age} onValueChange={(value) => setFilters({...filters, age: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas</SelectItem>
                      <SelectItem value="filhote">Filhote</SelectItem>
                      <SelectItem value="adulto">Adulto</SelectItem>
                      <SelectItem value="idoso">Idoso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="size" className="text-sm font-medium mb-2 block">Porte</Label>
                  <Select value={filters.size} onValueChange={(value) => setFilters({...filters, size: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="pequeno">Pequeno</SelectItem>
                      <SelectItem value="medio">Médio</SelectItem>
                      <SelectItem value="grande">Grande</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="gender" className="text-sm font-medium mb-2 block">Sexo</Label>
                  <Select value={filters.gender} onValueChange={(value) => setFilters({...filters, gender: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos</SelectItem>
                      <SelectItem value="macho">Macho</SelectItem>
                      <SelectItem value="femea">Fêmea</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="breed" className="text-sm font-medium mb-2 block">Raça</Label>
                  <Input
                    id="breed"
                    placeholder="Digite a raça..."
                    value={filters.breed}
                    onChange={(e) => setFilters({...filters, breed: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="text-sm font-medium mb-2 block">Localização</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="location"
                      placeholder="Cidade, Estado"
                      value={filters.location}
                      onChange={(e) => setFilters({...filters, location: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Characteristics */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Características Especiais</Label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="vaccinated"
                      checked={filters.vaccinated}
                      onCheckedChange={(checked) => setFilters({...filters, vaccinated: Boolean(checked)})}
                    />
                    <Label htmlFor="vaccinated" className="text-sm">Vacinado</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="castrated"
                      checked={filters.castrated}
                      onCheckedChange={(checked) => setFilters({...filters, castrated: Boolean(checked)})}
                    />
                    <Label htmlFor="castrated" className="text-sm">Castrado</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="docile"
                      checked={filters.docile}
                      onCheckedChange={(checked) => setFilters({...filters, docile: Boolean(checked)})}
                    />
                    <Label htmlFor="docile" className="text-sm">Dócil</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="active"
                      checked={filters.active}
                      onCheckedChange={(checked) => setFilters({...filters, active: Boolean(checked)})}
                    />
                    <Label htmlFor="active" className="text-sm">Ativo</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="specialNeeds"
                      checked={filters.specialNeeds}
                      onCheckedChange={(checked) => setFilters({...filters, specialNeeds: Boolean(checked)})}
                    />
                    <Label htmlFor="specialNeeds" className="text-sm">Necessidades Especiais</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-foreground">
            {filteredPets.length} pet{filteredPets.length !== 1 ? 's' : ''} encontrado{filteredPets.length !== 1 ? 's' : ''}
          </h2>
          {filteredPets.length > 0 && (
            <Badge variant="secondary" className="text-sm">
              {filteredPets.length} de {mockPets.length} pets
            </Badge>
          )}
        </div>

        {/* Pet Results Grid */}
        {filteredPets.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-muted-foreground mb-4">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Nenhum pet encontrado</h3>
                <p>Tente ajustar os filtros para encontrar mais resultados.</p>
              </div>
              <Button onClick={clearFilters} variant="outline">
                Limpar Filtros
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPets.map((pet, index) => (
              <div 
                key={pet.id} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PetSearchCard pet={pet} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}