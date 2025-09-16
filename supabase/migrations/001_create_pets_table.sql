-- Criar tabela de pets
CREATE TABLE IF NOT EXISTS pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    breed VARCHAR(100) NOT NULL,
    size VARCHAR(20) NOT NULL CHECK (size IN ('pequeno', 'medio', 'grande')),
    description TEXT,
    tags TEXT[] DEFAULT '{}',
    image_url TEXT,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS pets_owner_id_idx ON pets(owner_id);
CREATE INDEX IF NOT EXISTS pets_size_idx ON pets(size);
CREATE INDEX IF NOT EXISTS pets_is_available_idx ON pets(is_available);
CREATE INDEX IF NOT EXISTS pets_created_at_idx ON pets(created_at DESC);

-- Criar tabela para armazenar tags personalizadas (opcional)
CREATE TABLE IF NOT EXISTS pet_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tag_name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir tags padrão
INSERT INTO pet_tags (tag_name) VALUES 
('Vacinado'),
('Castrado'),
('Dócil'),
('Brincalhão'),
('Carinhoso'),
('Sociável'),
('Ativo'),
('Calmo'),
('Independente'),
('Protetor'),
('Obediente'),
('Treinado'),
('Bom com crianças'),
('Bom com outros pets'),
('Necessita cuidados especiais')
ON CONFLICT (tag_name) DO NOTHING;

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar updated_at
DROP TRIGGER IF EXISTS update_pets_updated_at ON pets;
CREATE TRIGGER update_pets_updated_at
    BEFORE UPDATE ON pets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Configurar RLS (Row Level Security)
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam todos os pets disponíveis
CREATE POLICY "Pets são visíveis para todos os usuários" ON pets
    FOR SELECT USING (is_available = true);

-- Política para permitir que usuários insiram seus próprios pets
CREATE POLICY "Usuários podem inserir seus próprios pets" ON pets
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Política para permitir que usuários atualizem apenas seus próprios pets
CREATE POLICY "Usuários podem atualizar seus próprios pets" ON pets
    FOR UPDATE USING (auth.uid() = owner_id);

-- Política para permitir que usuários deletem apenas seus próprios pets
CREATE POLICY "Usuários podem deletar seus próprios pets" ON pets
    FOR DELETE USING (auth.uid() = owner_id);

-- Criar bucket para imagens de pets (se não existir)
INSERT INTO storage.buckets (id, name, public)
VALUES ('pet-images', 'pet-images', true)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir upload de imagens
CREATE POLICY "Usuários podem fazer upload de imagens de pets" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'pet-images' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Política para permitir visualização de imagens
CREATE POLICY "Imagens de pets são públicas" ON storage.objects
    FOR SELECT USING (bucket_id = 'pet-images');

-- Política para permitir que usuários deletem suas próprias imagens
CREATE POLICY "Usuários podem deletar suas próprias imagens" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'pet-images' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );