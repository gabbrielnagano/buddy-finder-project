-- Criar tabela de pets completa
CREATE TABLE IF NOT EXISTS public.pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  species TEXT NOT NULL,
  breed TEXT,
  age TEXT,
  size TEXT,
  gender TEXT,
  location TEXT,
  description TEXT,
  vaccinated BOOLEAN DEFAULT FALSE,
  castrated BOOLEAN DEFAULT FALSE,
  docile BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT FALSE,
  special_needs BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela pets
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para pets
CREATE POLICY "Todos podem ver pets"
  ON public.pets FOR SELECT
  USING (true);

CREATE POLICY "Usuários podem criar pets"
  ON public.pets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios pets"
  ON public.pets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios pets"
  ON public.pets FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger para updated_at na tabela pets
CREATE TRIGGER atualizar_pets_updated_at
  BEFORE UPDATE ON public.pets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Criar tabela de perfis de usuário
CREATE TABLE IF NOT EXISTS public.perfis (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  nome TEXT,
  avatar_url TEXT,
  telefone TEXT,
  cidade TEXT,
  estado TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela perfis
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para perfis
CREATE POLICY "Usuários podem ver todos os perfis"
  ON public.perfis FOR SELECT
  USING (true);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.perfis FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil"
  ON public.perfis FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trigger para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.criar_perfil_usuario()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.perfis (id, nome)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NEW;
END;
$$;

CREATE TRIGGER ao_criar_usuario
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.criar_perfil_usuario();

-- Trigger para updated_at na tabela perfis
CREATE TRIGGER atualizar_perfis_updated_at
  BEFORE UPDATE ON public.perfis
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Criar tabela de favoritos
CREATE TABLE IF NOT EXISTS public.favoritos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  pet_id UUID NOT NULL REFERENCES public.pets ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(usuario_id, pet_id)
);

-- Habilitar RLS na tabela favoritos
ALTER TABLE public.favoritos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para favoritos
CREATE POLICY "Usuários podem ver seus próprios favoritos"
  ON public.favoritos FOR SELECT
  USING (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem adicionar favoritos"
  ON public.favoritos FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem remover seus favoritos"
  ON public.favoritos FOR DELETE
  USING (auth.uid() = usuario_id);

-- Criar tabela de comentários
CREATE TABLE IF NOT EXISTS public.comentarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pet_id UUID NOT NULL REFERENCES public.pets ON DELETE CASCADE,
  usuario_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  comentario TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela comentarios
ALTER TABLE public.comentarios ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para comentarios
CREATE POLICY "Todos podem ver comentários"
  ON public.comentarios FOR SELECT
  USING (true);

CREATE POLICY "Usuários autenticados podem adicionar comentários"
  ON public.comentarios FOR INSERT
  WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuários podem deletar seus próprios comentários"
  ON public.comentarios FOR DELETE
  USING (auth.uid() = usuario_id);

-- Criar tabela de mensagens (para chat)
CREATE TABLE IF NOT EXISTS public.mensagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  remetente_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  destinatario_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  pet_id UUID REFERENCES public.pets ON DELETE SET NULL,
  mensagem TEXT NOT NULL,
  lida BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS na tabela mensagens
ALTER TABLE public.mensagens ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para mensagens
CREATE POLICY "Usuários podem ver suas próprias mensagens"
  ON public.mensagens FOR SELECT
  USING (auth.uid() = remetente_id OR auth.uid() = destinatario_id);

CREATE POLICY "Usuários podem enviar mensagens"
  ON public.mensagens FOR INSERT
  WITH CHECK (auth.uid() = remetente_id);

CREATE POLICY "Usuários podem atualizar status de leitura de mensagens recebidas"
  ON public.mensagens FOR UPDATE
  USING (auth.uid() = destinatario_id);

-- Adicionar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_pets_user ON public.pets(user_id);
CREATE INDEX IF NOT EXISTS idx_favoritos_usuario ON public.favoritos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_favoritos_pet ON public.favoritos(pet_id);
CREATE INDEX IF NOT EXISTS idx_comentarios_pet ON public.comentarios(pet_id);
CREATE INDEX IF NOT EXISTS idx_mensagens_remetente ON public.mensagens(remetente_id);
CREATE INDEX IF NOT EXISTS idx_mensagens_destinatario ON public.mensagens(destinatario_id);