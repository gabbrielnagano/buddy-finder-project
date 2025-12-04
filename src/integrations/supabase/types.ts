export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      adocao: {
        Row: {
          data_solicitacao: string | null
          id_adocao: number
          id_pet: number | null
          id_usuario: number | null
          status: string | null
        }
        Insert: {
          data_solicitacao?: string | null
          id_adocao?: number
          id_pet?: number | null
          id_usuario?: number | null
          status?: string | null
        }
        Update: {
          data_solicitacao?: string | null
          id_adocao?: number
          id_pet?: number | null
          id_usuario?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "adocao_id_pet_fkey"
            columns: ["id_pet"]
            isOneToOne: false
            referencedRelation: "pet"
            referencedColumns: ["id_pet"]
          },
          {
            foreignKeyName: "adocao_id_usuario_fkey"
            columns: ["id_usuario"]
            isOneToOne: false
            referencedRelation: "usuario"
            referencedColumns: ["id_usuario"]
          },
        ]
      }
      comentarios: {
        Row: {
          comentario: string
          created_at: string | null
          id: string
          pet_id: string
          usuario_id: string
        }
        Insert: {
          comentario: string
          created_at?: string | null
          id?: string
          pet_id: string
          usuario_id: string
        }
        Update: {
          comentario?: string
          created_at?: string | null
          id?: string
          pet_id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comentarios_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      favoritos: {
        Row: {
          created_at: string | null
          id: string
          pet_id: string
          usuario_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          pet_id: string
          usuario_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          pet_id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favoritos_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      instituicao: {
        Row: {
          cidade: string | null
          cnpj: string | null
          email: string | null
          endereco: string | null
          estado: string | null
          id_instituicao: number
          nome: string
          telefone: string | null
        }
        Insert: {
          cidade?: string | null
          cnpj?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id_instituicao?: number
          nome: string
          telefone?: string | null
        }
        Update: {
          cidade?: string | null
          cnpj?: string | null
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id_instituicao?: number
          nome?: string
          telefone?: string | null
        }
        Relationships: []
      }
      mensagens: {
        Row: {
          created_at: string | null
          destinatario_id: string
          id: string
          lida: boolean | null
          mensagem: string
          pet_id: string | null
          remetente_id: string
        }
        Insert: {
          created_at?: string | null
          destinatario_id: string
          id?: string
          lida?: boolean | null
          mensagem: string
          pet_id?: string | null
          remetente_id: string
        }
        Update: {
          created_at?: string | null
          destinatario_id?: string
          id?: string
          lida?: boolean | null
          mensagem?: string
          pet_id?: string | null
          remetente_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mensagens_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      perfis: {
        Row: {
          avatar_url: string | null
          bio: string | null
          cidade: string | null
          created_at: string | null
          estado: string | null
          id: string
          nome: string | null
          telefone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          cidade?: string | null
          created_at?: string | null
          estado?: string | null
          id: string
          nome?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          cidade?: string | null
          created_at?: string | null
          estado?: string | null
          id?: string
          nome?: string | null
          telefone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      card: {
        Row: {
          active: boolean | null
          age: string | null
          breed: string | null
          castrated: boolean | null
          created_at: string | null
          description: string | null
          docile: boolean | null
          gender: string | null
          id: string
          image_url: string | null
          latitude: number | null
          location: string | null
          longitude: number | null
          name: string
          pet_id: string
          size: string | null
          special_needs: boolean | null
          species: string
          updated_at: string | null
          user_id: string
          vaccinated: boolean | null
        }
        Insert: {
          active?: boolean | null
          age?: string | null
          breed?: string | null
          castrated?: boolean | null
          created_at?: string | null
          description?: string | null
          docile?: boolean | null
          gender?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name: string
          pet_id?: string
          size?: string | null
          special_needs?: boolean | null
          species: string
          updated_at?: string | null
          user_id: string
          vaccinated?: boolean | null
        }
        Update: {
          active?: boolean | null
          age?: string | null
          breed?: string | null
          castrated?: boolean | null
          created_at?: string | null
          description?: string | null
          docile?: boolean | null
          gender?: string | null
          id?: string
          image_url?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name?: string
          pet_id?: string
          size?: string | null
          special_needs?: boolean | null
          species?: string
          updated_at?: string | null
          user_id?: string
          vaccinated?: boolean | null
        }
        Relationships: []
      }
      pet: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      usuario: {
        Row: {
          email: string
          id_usuario: number
          nome: string
          senha: string
        }
        Insert: {
          email: string
          id_usuario?: number
          nome: string
          senha: string
        }
        Update: {
          email?: string
          id_usuario?: number
          nome?: string
          senha?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
