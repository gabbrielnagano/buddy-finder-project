import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Plus, Upload, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Database } from "@/integrations/supabase/types";

interface PetFormData {
  name: string;
  breed: string;
  species: string;
  age: string;
  gender: string;
  location: string;
  size: string;
  description: string;
  tags: string[];
  image?: File;
}

const PREDEFINED_TAGS = [
  "Vacinado",
  "Castrado",
  "Dócil", 
  "Brincalhão",
  "Carinhoso",
  "Sociável",
  "Ativo",
  "Calmo",
  "Independente",
  "Protetor",
  "Obediente",
  "Treinádo",
  "Bom com crianças",
  "Bom com outros pets",
  "Necessita cuidados especiais"
];

const SIZES = [
  { value: "pequeno", label: "Pequeno" },
  { value: "medio", label: "Médio" },
  { value: "grande", label: "Grande" }
];

const SPECIES = [
  { value: "cachorro", label: "🐕 Cachorro" },
  { value: "gato", label: "🐱 Gato" }
];

const AGES = [
  { value: "filhote", label: "Filhote" },
  { value: "adulto", label: "Adulto" },
  { value: "idoso", label: "Idoso" }
];

const GENDERS = [
  { value: "macho", label: "Macho" },
  { value: "femea", label: "Fêmea" }
];

export default function AdicionarPet() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [customTag, setCustomTag] = useState("");
  
  const [formData, setFormData] = useState<PetFormData>({
    name: "",
    breed: "",
    species: "",
    age: "",
    gender: "",
    location: "",
    size: "",
    description: "",
    tags: [],
  });

  const handleInputChange = (field: keyof PetFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addCustomTag = () => {
    if (customTag.trim()) {
      addTag(customTag.trim());
      setCustomTag("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.breed || !formData.species || !formData.age || !formData.gender || !formData.location || !formData.size) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      let imageUrl = null;
      
      // Upload da imagem se existir
      if (formData.image) {
        const fileExt = formData.image.name.split('.').pop();
        const fileName = `${user?.id}/${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('pet-images')
          .upload(fileName, formData.image);

        if (uploadError) {
          throw uploadError;
        }

        // Obter URL pública da imagem
        const { data: urlData } = supabase.storage
          .from('pet-images')
          .getPublicUrl(fileName);
        
        imageUrl = urlData.publicUrl;
      }

      // Mapear tags para características booleanas
      const petData: Database['public']['Tables']['pets']['Insert'] = {
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        age: formData.age,
        gender: formData.gender,
        location: formData.location,
        size: formData.size,
        description: formData.description || null,
        image_url: imageUrl,
        user_id: user?.id || '',
        vaccinated: formData.tags.includes('Vacinado'),
        castrated: formData.tags.includes('Castrado'),
        docile: formData.tags.includes('Dócil'),
        active: formData.tags.includes('Ativo') || formData.tags.includes('Brincalhão'),
        special_needs: formData.tags.includes('Necessita cuidados especiais'),
      };

      const { data, error } = await supabase
        .from('pets')
        .insert(petData)
        .select();

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Pet adicionado com sucesso!",
      });

      // Redirecionar para a página inicial ou de pets
      navigate("/");
      
    } catch (error) {
      console.error("Erro ao adicionar pet:", error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar pet. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">
            Adicionar Novo Pet
          </h1>
          <p className="text-muted-foreground">
            Preencha as informações do seu pet para disponibilizá-lo para adoção
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Pet</CardTitle>
          <CardDescription>
            Preencha todos os campos para criar o perfil do pet
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload de Imagem */}
            <div className="space-y-2">
              <Label htmlFor="image">Foto do Pet</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Label htmlFor="image" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Clique para adicionar uma foto do pet
                  </p>
                  {formData.image && (
                    <p className="text-sm text-primary mt-2">
                      {formData.image.name}
                    </p>
                  )}
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Pet *</Label>
                <Input
                  id="name"
                  placeholder="Ex: Rex, Luna, Mimi..."
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>

              {/* Espécie */}
              <div className="space-y-2">
                <Label htmlFor="species">Espécie *</Label>
                <Select value={formData.species} onValueChange={(value) => handleInputChange("species", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a espécie" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIES.map((species) => (
                      <SelectItem key={species.value} value={species.value}>
                        {species.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Raça */}
              <div className="space-y-2">
                <Label htmlFor="breed">Raça *</Label>
                <Input
                  id="breed"
                  placeholder="Ex: Golden Retriever, SRD, Persa..."
                  value={formData.breed}
                  onChange={(e) => handleInputChange("breed", e.target.value)}
                  required
                />
              </div>

              {/* Idade */}
              <div className="space-y-2">
                <Label htmlFor="age">Idade *</Label>
                <Select value={formData.age} onValueChange={(value) => handleInputChange("age", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a idade" />
                  </SelectTrigger>
                  <SelectContent>
                    {AGES.map((age) => (
                      <SelectItem key={age.value} value={age.value}>
                        {age.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Gênero */}
              <div className="space-y-2">
                <Label htmlFor="gender">Gênero *</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    {GENDERS.map((gender) => (
                      <SelectItem key={gender.value} value={gender.value}>
                        {gender.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Localização */}
              <div className="space-y-2">
                <Label htmlFor="location">Localização *</Label>
                <Input
                  id="location"
                  placeholder="Ex: São Paulo - SP"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Porte */}
            <div className="space-y-2">
              <Label htmlFor="size">Porte *</Label>
              <Select value={formData.size} onValueChange={(value) => handleInputChange("size", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o porte do pet" />
                </SelectTrigger>
                <SelectContent>
                  {SIZES.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description">Descrição (Opcional)</Label>
              <Textarea
                id="description"
                placeholder="Conte um pouco sobre a personalidade do pet, seus hábitos, se tem alguma necessidade especial..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
              />
            </div>

            {/* Tags */}
            <div className="space-y-4">
              <Label>Tags do Pet</Label>
              
              {/* Tags predefinidas */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Tags predefinidas:</p>
                <div className="flex flex-wrap gap-2">
                  {PREDEFINED_TAGS.map((tag) => (
                    <Badge
                      key={tag}
                      variant={formData.tags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => 
                        formData.tags.includes(tag) ? removeTag(tag) : addTag(tag)
                      }
                    >
                      {tag}
                      {formData.tags.includes(tag) && (
                        <X className="ml-1 h-3 w-3" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Adicionar tag customizada */}
              <div className="flex gap-2">
                <Input
                  placeholder="Adicionar tag personalizada..."
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCustomTag())}
                />
                <Button type="button" onClick={addCustomTag} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Tags selecionadas */}
              {formData.tags.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Tags selecionadas:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                        <X 
                          className="ml-1 h-3 w-3 cursor-pointer" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
              >
                {loading ? "Adicionando..." : "Adicionar Pet"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}