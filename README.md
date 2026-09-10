# BuddyFinder - Plataforma de Adoção de Pets

Plataforma web para conectar pets disponíveis para adoção com potenciais tutores, facilitando o processo de adoção responsável.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- **npm** ou **bun** (gerenciador de pacotes)
- **Git** - [Download](https://git-scm.com/)

### Contas e Serviços Necessários

1. **Supabase** (Backend as a Service)
   - Crie uma conta em [supabase.com](https://supabase.com)
   - Crie um novo projeto
   - Anote a **URL do projeto** e a **chave pública (anon key)**

2. **Google Maps API** (Geocodificação)
   - Acesse [Google Cloud Console](https://console.cloud.google.com/)
   - Crie um projeto e ative a **Geocoding API**
   - Gere uma **API Key**

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/gmartinssr/buddy-finder-project.git
cd buddy-finder-project
```

### 2. Instale as dependências

```bash
npm install
# ou
bun install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_publica_do_supabase
VITE_GOOGLE_MAPS_API_KEY=sua_chave_api_do_google_maps
```

### 4. Configure o banco de dados Supabase

Execute as migrações SQL na ordem correta no **SQL Editor** do Supabase:

1. `supabase/migrations/001_create_pets_table.sql`
2. `supabase/migrations/20251026214531_9399b2f1-ab2a-40b0-9c5b-2f610f6084f0.sql`
3. `supabase/migrations/20251026221448_4168db97-7a57-4f1c-ad8b-0a6f04754db6.sql`
4. `supabase/migrations/20251027232413_b96e27d2-586c-48f7-beb3-4d1ddd54646d.sql`
5. `supabase/migrations/20251104134219_9e3bbf73-9a4a-4b10-9987-927d4f55812a.sql`

### 5. Atualize as credenciais no código

**Importante:** Atualize os seguintes arquivos com suas credenciais:

- `src/integrations/supabase/client.ts` - Substitua a URL e chave do Supabase
- `src/lib/geocoding.ts` - Substitua a API Key do Google Maps

### 6. Inicie o servidor de desenvolvimento

```
bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## Tecnologias Utilizadas

### Frontend
- **React** 18.3.1 - Biblioteca UI
- **TypeScript** 5.8.3 - Tipagem estática
- **Vite** 5.4.19 - Build tool e dev server
- **React Router DOM** 6.30.1 - Roteamento
- **Tailwind CSS** 3.4.18 - Framework CSS
- **shadcn/ui** - Componentes UI (Radix UI)
- **Lucide React** - Ícones
- **React Hook Form** + **Zod** - Validação de formulários
- **react-i18next** - Internacionalização

### Backend (Supabase)
- **PostgreSQL** 13.0.4 - Banco de dados
- **Supabase Auth** - Autenticação
- **Supabase Storage** - Armazenamento de imagens
- **Row Level Security (RLS)** - Segurança de dados

### APIs Externas
- **Google Maps Geocoding API** - Conversão de endereços em coordenadas

## Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento na porta 3000
npm run build        # Build de produção
npm run build:dev    # Build de desenvolvimento
npm run lint         # Verifica erros de linting
npm run preview      # Preview do build de produção
```

## Estrutura do Banco de Dados

### Tabelas Principais

- **pets** - Animais disponíveis para adoção
- **favoritos** - Sistema de curtidas/salvos
- **comentarios** - Comentários em pets
- **perfis** - Perfis de usuários
- **mensagens** - Sistema de chat (backend pronto)

### Políticas de Segurança (RLS)

Todas as tabelas possuem políticas RLS configuradas:
- ✅ Leitura pública de pets e comentários
- ✅ Apenas usuários autenticados podem criar pets
- ✅ Apenas proprietários podem editar/deletar seus pets
- ✅ Favoritos privados por usuário

## Funcionalidades

- ✅ **Autenticação completa** (login, registro, reset de senha)
- ✅ **CRUD de pets** com upload de imagens
- ✅ **Sistema de favoritos** com sincronização em tempo real
- ✅ **Comentários** em pets
- ✅ **Busca avançada** com filtros (espécie, porte, gênero, distância)
- ✅ **Geocodificação** de endereços
- ✅ **Internacionalização** (i18n)
- ✅ **Responsive design**

## Notas Importantes

### Segurança
- **Não commite suas credenciais** - Use variáveis de ambiente
- As chaves no código atual são de exemplo e devem ser substituídas
- Configure `.gitignore` para ignorar o arquivo `.env`

### Limitações Conhecidas
- Nomes de usuário nos comentários mostram "Usuário" (TODO: integrar com tabela perfis)
- Botão de compartilhar sem funcionalidade (placeholder)
- Sistema de mensagens preparado mas sem UI

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT.

## Autor

Desenvolvido por [@gabbrielnagano](https://github.com/gabbrielnagano)
