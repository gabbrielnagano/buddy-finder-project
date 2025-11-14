import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PetDetailsDialog } from "@/components/PetDetailsDialog";

// Página pública para exibir detalhes do pet a partir do link compartilhado
// SEO básico: título dinâmico e canonical
const PetDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [petRecord, setPetRecord] = useState<any | null>(null);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const fetchPet = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Erro ao carregar pet:", error);
        setPetRecord(null);
      } else {
        setPetRecord(data);
      }
      setLoading(false);
    };

    fetchPet();
  }, [id]);

  // Mapeia o registro do banco para a estrutura esperada pelo PetDetailsDialog
  const petForDialog = useMemo(() => {
    if (!petRecord) return null;
    const p = petRecord as any;
    return {
      id: p.id,
      name: p.name,
      image: p.image_url || "",
      species: (p.species || "cachorro") as "cachorro" | "gato",
      breed: p.breed || "",
      age: p.age || "",
      size: (p.size || "medio") as "pequeno" | "medio" | "grande",
      gender: (p.gender || "macho") as "macho" | "femea",
      location: p.location || "",
      description: p.description || "",
      vaccinated: !!p.vaccinated,
      castrated: !!p.castrated,
      docile: !!p.docile,
      active: !!p.active,
      specialNeeds: !!p.special_needs,
    } as any;
  }, [petRecord]);

  // SEO básico
  useEffect(() => {
    const title = petRecord?.name
      ? `${petRecord.name} – Adote um Pet`
      : "Pet – BuddyFinder";
    document.title = title;

    // canonical
    const linkEl = document.querySelector('link[rel="canonical"]') as
      | HTMLLinkElement
      | null;
    const href = window.location.href;
    if (linkEl) {
      linkEl.href = href;
    } else {
      const l = document.createElement("link");
      l.setAttribute("rel", "canonical");
      l.setAttribute("href", href);
      document.head.appendChild(l);
    }
  }, [petRecord]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </main>
    );
  }

  if (!petRecord) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-semibold">Pet não encontrado</h1>
          <p className="text-muted-foreground">Este anúncio pode ter sido removido.</p>
          <Link to="/" className="underline text-primary">Voltar para a página inicial</Link>
        </div>
      </main>
    );
  }

  return (
    <main>
      {/* H1 oculto para SEO */}
      <h1 className="sr-only">{petRecord.name} para adoção</h1>
      <PetDetailsDialog
        pet={petForDialog}
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            // Volta para a busca ou home ao fechar
            navigate(-1);
          }
        }}
      />
    </main>
  );
};

export default PetDetails;
