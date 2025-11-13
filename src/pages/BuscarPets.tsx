import { useState, useEffect } from "react";
import { Search, Filter, MapPin, Sliders, Navigation } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getCurrentLocation, calculateDistance } from "@/lib/geocoding";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PetSearchCard } from "@/components/PetSearchCard";
import { useTranslation } from "react-i18next";

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
  latitude?: number | null;
  longitude?: number | null;
  distance?: number;
}

export default function BuscarPets() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [filters, setFilters] = useState({
    species: "todas",
    breed: "",
    age: "todas",
    size: "todos",
    gender: "todos",
    location: "",
    vaccinated: false,
    castrated: false,
    docile: false,
    active: false,
    specialNeeds: false,
    maxDistance: 0 // 0 = sem filtro de distância
  });

  // Obter localização do usuário
  useEffect(() => {
    const getUserLocation = async () => {
      const location = await getCurrentLocation();
      if (location) {
        setUserLocation(location);
      }
    };
    getUserLocation();
  }, []);

  // Carregar pets do banco de dados
  useEffect(() => {
    loadPets();
  }, [userLocation]);

  const loadPets = async () => {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedPets: Pet[] = data.map(pet => {
          let distance: number | undefined;
          
          // Calcular distância se ambas as localizações existirem
          if (userLocation && pet.latitude && pet.longitude) {
            distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              pet.latitude,
              pet.longitude
            );
          }
          
          return {
            id: pet.id,
            name: pet.name,
            image: pet.image_url,
            species: pet.species as "cachorro" | "gato",
            breed: pet.breed || 'SRD',
            age: pet.age || 'adulto',
            size: pet.size as "pequeno" | "medio" | "grande",
            gender: pet.gender as "macho" | "femea",
            location: pet.location || 'Brasil',
            description: pet.description || '',
            vaccinated: pet.vaccinated,
            castrated: pet.castrated,
            docile: pet.docile,
            active: pet.active,
            specialNeeds: pet.special_needs,
            latitude: pet.latitude,
            longitude: pet.longitude,
            distance,
          };
        });
        
        setPets(formattedPets);
      }
    } catch (error) {
      console.error('Erro ao carregar pets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecies = !filters.species || filters.species === "todas" || pet.species === filters.species;
    const matchesBreed = !filters.breed || pet.breed.toLowerCase().includes(filters.breed.toLowerCase());
    const matchesAge = !filters.age || filters.age === "todas" || pet.age === filters.age;
    const matchesSize = !filters.size || filters.size === "todos" || pet.size === filters.size;
    const matchesGender = !filters.gender || filters.gender === "todos" || pet.gender === filters.gender;
    const matchesLocation = !filters.location || pet.location.toLowerCase().includes(filters.location.toLowerCase());
    
    const matchesVaccinated = !filters.vaccinated || pet.vaccinated === filters.vaccinated;
    const matchesCastrated = !filters.castrated || pet.castrated === filters.castrated;
    const matchesDocile = !filters.docile || pet.docile === filters.docile;
    const matchesActive = !filters.active || pet.active === filters.active;
    const matchesSpecialNeeds = !filters.specialNeeds || pet.specialNeeds === filters.specialNeeds;
    
    // Filtrar por distância se o filtro estiver ativo
    const matchesDistance = !filters.maxDistance || 
                           !pet.distance || 
                           pet.distance <= filters.maxDistance;

    return matchesSearch && matchesSpecies && matchesBreed && matchesAge && 
           matchesSize && matchesGender && matchesLocation && matchesVaccinated && 
           matchesCastrated && matchesDocile && matchesActive && matchesSpecialNeeds &&
           matchesDistance;
  });

  const clearFilters = () => {
    setFilters({
      species: "todas",
      breed: "",
      age: "todas",
      size: "todos",
      gender: "todos",
      location: "",
      vaccinated: false,
      castrated: false,
      docile: false,
      active: false,
      specialNeeds: false,
      maxDistance: 0
    });
  };

  const handleGetLocation = async () => {
    const location = await getCurrentLocation();
    if (location) {
      setUserLocation(location);
      toast({
        title: "Localização obtida!",
        description: "Agora você pode filtrar pets por proximidade.",
      });
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível obter sua localização.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">
            {t('search.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('search.subtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={t('search.searchPlaceholder')}
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
                {t('search.advancedFilters')}
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
                  {t('search.advancedFilters')}
                </CardTitle>
                <Button variant="ghost" onClick={clearFilters} className="text-sm">
                  {t('search.clearFilters')}
                </Button>
              </div>
              <CardDescription>
                {t('search.refineSearch')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Filters */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <Label htmlFor="species" className="text-sm font-medium mb-2 block">{t('search.species')}</Label>
                  <Select value={filters.species} onValueChange={(value) => setFilters({...filters, species: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('search.all')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">{t('search.all')}</SelectItem>
                      <SelectItem value="cachorro">{t('search.dog')}</SelectItem>
                      <SelectItem value="gato">{t('search.cat')}</SelectItem>
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
                      <SelectItem value="todas">Todas</SelectItem>
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
                      <SelectItem value="todos">Todos</SelectItem>
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
                      <SelectItem value="todos">Todos</SelectItem>
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

               {/* Proximity Filter */}
               <div>
                 <Label className="text-sm font-medium mb-3 block">Filtrar por Proximidade</Label>
                 <div className="flex items-center gap-4">
                   <Button 
                     type="button" 
                     variant="outline" 
                     onClick={handleGetLocation}
                     className="flex items-center gap-2"
                   >
                     <Navigation className="h-4 w-4" />
                     {userLocation ? "Atualizar Localização" : "Obter Minha Localização"}
                   </Button>
                   {userLocation && (
                     <div className="flex-1">
                       <Label htmlFor="maxDistance" className="text-sm mb-2 block">
                         Distância máxima: {filters.maxDistance > 0 ? `${filters.maxDistance} km` : "Sem limite"}
                       </Label>
                       <div className="flex items-center gap-2">
                         <input
                           id="maxDistance"
                           type="range"
                           min="0"
                           max="100"
                           step="5"
                           value={filters.maxDistance}
                           onChange={(e) => setFilters({...filters, maxDistance: parseInt(e.target.value)})}
                           className="flex-1"
                         />
                         <span className="text-sm text-muted-foreground w-16 text-right">
                           {filters.maxDistance > 0 ? `${filters.maxDistance} km` : "Todos"}
                         </span>
                       </div>
                     </div>
                   )}
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
            {t('search.resultsFound', { count: filteredPets.length })}
          </h2>
          {filteredPets.length > 0 && (
            <Badge variant="secondary" className="text-sm">
              {filteredPets.length} {t('search.of')} {pets.length} pets
            </Badge>
          )}
        </div>

        {/* Pet Results Grid */}
        {filteredPets.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-muted-foreground mb-4">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">{t('search.noResults')}</h3>
                <p>{t('search.adjustFilters')}</p>
              </div>
              <Button onClick={clearFilters} variant="outline">
                {t('search.clearFilters')}
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