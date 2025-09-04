import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
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
import { ThemePreview } from "@/components/ThemePreview";

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [previewTheme, setPreviewTheme] = useState(theme || "system");
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

  useEffect(() => {
    setPreviewTheme(theme || "system");
  }, [theme]);

  const handleSaveSettings = () => {
    localStorage.setItem('language', language);
    toast({
      title: t('settings.saved'),
      description: t('settings.savedDescription'),
      duration: 3000,
    });
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const handleThemePreview = (newTheme: string) => {
    setPreviewTheme(newTheme);
    setTheme(newTheme);
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
    { id: "dogs", label: t('settings.species.dogs'), icon: "🐕" },
    { id: "cats", label: t('settings.species.cats'), icon: "🐱" },
    { id: "birds", label: t('settings.species.birds'), icon: "🐦" },
    { id: "rabbits", label: t('settings.species.rabbits'), icon: "🐰" },
    { id: "fish", label: t('settings.species.fish'), icon: "🐠" },
    { id: "reptiles", label: t('settings.species.reptiles'), icon: "🦎" }
  ];

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('settings.title')}</h1>
        <p className="text-muted-foreground">{t('settings.subtitle')}</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">{t('settings.general')}</span>
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
                {t('settings.appearance.title')}
              </CardTitle>
              <CardDescription>
                {t('settings.appearance.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">{t('settings.appearance.theme')}</Label>
                    <p className="text-sm text-muted-foreground">
                      {t('settings.appearance.themeDescription')}
                    </p>
                  </div>
                  <Select value={previewTheme} onValueChange={handleThemePreview}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="w-4 h-4" />
                          {t('settings.appearance.light')}
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="w-4 h-4" />
                          {t('settings.appearance.dark')}
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Layout className="w-4 h-4" />
                          {t('settings.appearance.system')}
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <ThemePreview theme={previewTheme} />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">{t('settings.appearance.language')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.appearance.languageDescription')}
                  </p>
                </div>
                <Select value={language} onValueChange={handleLanguageChange}>
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
                  <Label className="text-sm font-medium">{t('settings.appearance.layout')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.appearance.layoutDescription')}
                  </p>
                </div>
                <Select value={layoutStyle} onValueChange={setLayoutStyle}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">{t('settings.appearance.grid')}</SelectItem>
                    <SelectItem value="list">{t('settings.appearance.list')}</SelectItem>
                    <SelectItem value="compact">{t('settings.appearance.compact')}</SelectItem>
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
                {t('settings.notifications.title')}
              </CardTitle>
              <CardDescription>
                {t('settings.notifications.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">{t('settings.notifications.push')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.notifications.pushDescription')}
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
                  <Label className="text-sm font-medium">{t('settings.notifications.email')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.notifications.emailDescription')}
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
                  <Label className="text-sm font-medium">{t('settings.notifications.sms')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.notifications.smsDescription')}
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
                {t('settings.pets.title')}
              </CardTitle>
              <CardDescription>
                {t('settings.pets.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium">{t('settings.pets.favoriteSpecies')}</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  {t('settings.pets.favoriteSpeciesDescription')}
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
                  <Label className="text-sm font-medium">{t('settings.pets.newPetAlerts')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.pets.newPetAlertsDescription')}
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
                <Label className="text-sm font-medium">{t('settings.pets.defaultFilters')}</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">{t('settings.pets.age')}</Label>
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
                        <SelectItem value="all">{t('settings.pets.allAges')}</SelectItem>
                        <SelectItem value="puppy">{t('settings.pets.puppy')}</SelectItem>
                        <SelectItem value="young">{t('settings.pets.young')}</SelectItem>
                        <SelectItem value="adult">{t('settings.pets.adult')}</SelectItem>
                        <SelectItem value="senior">{t('settings.pets.senior')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">{t('settings.pets.size')}</Label>
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
                        <SelectItem value="all">{t('settings.pets.allSizes')}</SelectItem>
                        <SelectItem value="small">{t('settings.pets.small')}</SelectItem>
                        <SelectItem value="medium">{t('settings.pets.medium')}</SelectItem>
                        <SelectItem value="large">{t('settings.pets.large')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">{t('settings.pets.location')}</Label>
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
                        <SelectItem value="nearby">{t('settings.pets.nearby')}</SelectItem>
                        <SelectItem value="city">{t('settings.pets.city')}</SelectItem>
                        <SelectItem value="state">{t('settings.pets.state')}</SelectItem>
                        <SelectItem value="country">{t('settings.pets.country')}</SelectItem>
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
          {t('settings.save')}
        </Button>
      </div>
    </div>
  );
};

export default Settings;