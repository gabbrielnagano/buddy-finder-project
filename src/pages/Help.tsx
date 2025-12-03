import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, MessageCircle, Mail, Phone, ChevronDown, ChevronUp, PawPrint, Heart, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    id: "1",
    category: "Adoção",
    question: "Como funciona o processo de adoção?",
    answer: "O processo é simples: 1) Encontre um pet que você gostou, 2) Entre em contato com o responsável através dos comentários ou compartilhamento, 3) Converse sobre os detalhes da adoção, 4) Agende uma visita para conhecer o pet pessoalmente."
  },
  {
    id: "2", 
    category: "Cadastro",
    question: "Como cadastro meu pet para adoção?",
    answer: "Vá em 'Adicionar Pet' na barra lateral, preencha todas as informações do seu pet (nome, idade, características, etc.), adicione uma foto e publique. Seu pet aparecerá na busca para outros usuários interessados."
  },
  {
    id: "3",
    category: "Perfil",
    question: "Como edito meu perfil?",
    answer: "Clique na sua foto no topo da barra lateral para ir ao seu perfil, depois clique em 'Editar Perfil'. Você pode alterar seu nome, foto e biografia."
  },
  {
    id: "4",
    category: "Busca",
    question: "Como encontro pets específicos?",
    answer: "Use a página 'Buscar Pets' na barra lateral. Você pode filtrar por espécie (cachorro/gato), localização, características como vacinado, castrado, e outras preferências."
  },
  {
    id: "5",
    category: "Favoritos",
    question: "Como salvo pets que me interessam?",
    answer: "Clique no ícone de coração nos cards dos pets para adicionar aos seus favoritos. Você pode ver todos os seus pets favoritos na seção 'Favoritos' da barra lateral."
  },
  {
    id: "6",
    category: "Segurança",
    question: "Como posso ter certeza de que a adoção é segura?",
    answer: "Sempre converse bastante com o responsável antes de adotar. Peça para visitar o pet pessoalmente, faça perguntas sobre a saúde e histórico do animal. Nunca faça transferências bancárias antes de conhecer o pet."
  },
  {
    id: "7",
    category: "Suporte",
    question: "Encontrei um problema no aplicativo, como reportar?",
    answer: "Você pode entrar em contato conosco através do email suporte@buddyfinder.com ou através das redes sociais. Descreva o problema detalhadamente para que possamos ajudar."
  }
];

const guides = [
  {
    title: "Primeiro acesso",
    description: "Guia para novos usuários",
    steps: [
      "Faça login ou crie sua conta",
      "Complete seu perfil com nome e foto",
      "Explore os pets disponíveis na página inicial", 
      "Use os filtros na página 'Buscar Pets' para encontrar o pet ideal"
    ]
  },
  {
    title: "Cadastrando seu pet",
    description: "Como disponibilizar seu pet para adoção",
    steps: [
      "Clique em 'Adicionar Pet' na barra lateral",
      "Tire uma boa foto do seu pet (bem iluminada e clara)",
      "Preencha todas as informações: nome, idade, características",
      "Seja honesto sobre o temperamento e necessidades especiais",
      "Publique e acompanhe o interesse de adotantes"
    ]
  }
];

export default function Help() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todas");

  const categories = ["Todas", ...Array.from(new Set(faqData.map(item => item.category)))];

  const filteredFAQ = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todas" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
            <PawPrint className="h-8 w-8" />
            Central de Ajuda
          </h1>
          <p className="text-muted-foreground text-lg">
            Encontre respostas para suas dúvidas sobre o BuddyFinder
          </p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Busque por dúvidas, palavras-chave..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/adicionar-pet')}>
            <CardContent className="p-4 text-center">
              <Plus className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Adicionar Pet</h3>
              <p className="text-sm text-muted-foreground">Cadastre seu pet para adoção</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/buscar-pets')}>
            <CardContent className="p-4 text-center">
              <Search className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Buscar Pets</h3>
              <p className="text-sm text-muted-foreground">Encontre seu novo amigo</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/perfil')}>
            <CardContent className="p-4 text-center">
              <Settings className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Meu Perfil</h3>
              <p className="text-sm text-muted-foreground">Edite suas informações</p>
            </CardContent>
          </Card>
        </div>

        {/* Guides */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Guias Rápidos</CardTitle>
            <CardDescription>Tutoriais passo-a-passo para usar o BuddyFinder</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {guides.map((guide, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">{guide.title}</h3>
                  <p className="text-muted-foreground mb-3">{guide.description}</p>
                  <ol className="space-y-2">
                    {guide.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start gap-3">
                        <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium mt-0.5">
                          {stepIndex + 1}
                        </span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Perguntas Frequentes</CardTitle>
            <CardDescription>
              {filteredFAQ.length} {filteredFAQ.length === 1 ? 'pergunta encontrada' : 'perguntas encontradas'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredFAQ.map((item) => (
                <Collapsible
                  key={item.id}
                  open={expandedFAQ === item.id}
                  onOpenChange={() => setExpandedFAQ(expandedFAQ === item.id ? null : item.id)}
                >
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="text-left flex-1">
                        <Badge variant="outline" className="mb-2">{item.category}</Badge>
                        <h3 className="font-medium">{item.question}</h3>
                      </div>
                      {expandedFAQ === item.id ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 pb-4">
                      <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
              
              {filteredFAQ.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhuma pergunta encontrada para sua busca.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Precisa de mais ajuda?</CardTitle>
            <CardDescription>Entre em contato conosco</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">suporte@buddyfinder.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <MessageCircle className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Chat</p>
                  <p className="text-sm text-muted-foreground">Disponível 9h às 18h</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <Phone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Telefone</p>
                  <p className="text-sm text-muted-foreground">(11) 99999-9999</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-primary/5 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Dica:</strong> Para um atendimento mais rápido, tenha em mãos as informações sobre 
                o problema que você está enfrentando, incluindo prints da tela se necessário.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}