import { useState } from "react";
import { useTheme } from "next-themes";
import { Bell, Globe, Layout, Moon, PawPrint, Shield, Sun, Check, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState("pt-BR");
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: false
  });
  const [petPreferences, setPetPreferences] = useState({
    favoriteSpecies: ["dogs", "cats"],
    newPetAlerts: true,
    defaultFilters: {
      age: "all",
      size: "all",
      location: "nearby"
    }
  });
  const [layoutStyle, setLayoutStyle] = useState("grid");

  const handleSaveSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "Suas preferências foram atualizadas com sucesso!",
      duration: 3000,
    });
  };

  const toggleSpecies = (species: string) => {
    setPetPreferences(prev => ({
      ...prev,
      favoriteSpecies: prev.favoriteSpecies.includes(species)
        ? prev.favoriteSpecies.filter(s => s !== species)
        : [...prev.favoriteSpecies, species]
    }));
  };

  const speciesOptions = [
    { id: "dogs", label: "Cachorros", icon: "🐕" },
    { id: "cats", label: "Gatos", icon: "🐱" },
    { id: "birds", label: "Pássaros", icon: "🐦" },
    { id: "rabbits", label: "Coelhos", icon: "🐰" },
    { id: "fish", label: "Peixes", icon: "🐠" },
    { id: "reptiles", label: "Répteis", icon: "🦎" }
  ];

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Configurações</h1>
        <p className="text-muted-foreground">Personalize sua experiência no BuddyFinder</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Geral</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="pets" className="flex items-center gap-2">
            <PawPrint className="w-4 h-4" />
            <span className="hidden sm:inline">Pets</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="w-5 h-5" />
                Aparência e Layout
              </CardTitle>
              <CardDescription>
                Personalize a aparência da interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Tema</Label>
                  <p className="text-sm text-muted-foreground">
                    Escolha entre modo claro, escuro ou automático
                  </p>
                </div>
                <Select value={theme || "system"} onValueChange={setTheme}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        Claro
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4" />
                        Escuro
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">
                        <Layout className="w-4 h-4" />
                        Sistema
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Idioma</Label>
                  <p className="text-sm text-muted-foreground">
                    Selecione seu idioma preferido
                  </p>
                </div>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Português (BR)
                      </div>
                    </SelectItem>
                    <SelectItem value="en-US">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        English (US)
                      </div>
                    </SelectItem>
                    <SelectItem value="es-ES">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Español
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Layout de Exibição</Label>
                  <p className="text-sm text-muted-foreground">
                    Como os pets são mostrados na busca
                  </p>
                </div>
                <Select value={layoutStyle} onValueChange={setLayoutStyle}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grade</SelectItem>
                    <SelectItem value="list">Lista</SelectItem>
                    <SelectItem value="compact">Compacto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notificações
              </CardTitle>
              <CardDescription>
                Gerencie como você recebe notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Notificações Push</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações no navegador
                  </p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, push: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Notificações por E-mail</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba atualizações por e-mail
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, email: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Notificações por SMS</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba mensagens de texto importantes
                  </p>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, sms: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PawPrint className="w-5 h-5" />
                Preferências de Pets
              </CardTitle>
              <CardDescription>
                Configure suas preferências para busca e alertas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium">Espécies Favoritas</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Selecione os tipos de pets que mais te interessam
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {speciesOptions.map((species) => (
                    <Button
                      key={species.id}
                      variant={petPreferences.favoriteSpecies.includes(species.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSpecies(species.id)}
                      className="flex items-center gap-2 h-auto py-3"
                    >
                      <span className="text-lg">{species.icon}</span>
                      <span className="text-xs sm:text-sm">{species.label}</span>
                      {petPreferences.favoriteSpecies.includes(species.id) && (
                        <Check className="w-3 h-3 ml-auto" />
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Alertas de Novos Pets</Label>
                  <p className="text-sm text-muted-foreground">
                    Seja notificado quando pets das suas espécies favoritas estiverem disponíveis
                  </p>
                </div>
                <Switch
                  checked={petPreferences.newPetAlerts}
                  onCheckedChange={(checked) =>
                    setPetPreferences(prev => ({ ...prev, newPetAlerts: checked }))
                  }
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-sm font-medium">Filtros Padrão de Busca</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Idade</Label>
                    <Select
                      value={petPreferences.defaultFilters.age}
                      onValueChange={(value) =>
                        setPetPreferences(prev => ({
                          ...prev,
                          defaultFilters: { ...prev.defaultFilters, age: value }
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="puppy">Filhote</SelectItem>
                        <SelectItem value="young">Jovem</SelectItem>
                        <SelectItem value="adult">Adulto</SelectItem>
                        <SelectItem value="senior">Idoso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Porte</Label>
                    <Select
                      value={petPreferences.defaultFilters.size}
                      onValueChange={(value) =>
                        setPetPreferences(prev => ({
                          ...prev,
                          defaultFilters: { ...prev.defaultFilters, size: value }
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="small">Pequeno</SelectItem>
                        <SelectItem value="medium">Médio</SelectItem>
                        <SelectItem value="large">Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Localização</Label>
                    <Select
                      value={petPreferences.defaultFilters.location}
                      onValueChange={(value) =>
                        setPetPreferences(prev => ({
                          ...prev,
                          defaultFilters: { ...prev.defaultFilters, location: value }
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nearby">Próximo a mim</SelectItem>
                        <SelectItem value="city">Minha cidade</SelectItem>
                        <SelectItem value="state">Meu estado</SelectItem>
                        <SelectItem value="country">Todo o país</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-6">
        <Button onClick={handleSaveSettings} className="min-w-32">
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};

export default Settings;