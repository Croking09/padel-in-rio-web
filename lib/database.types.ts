export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      bonuses: {
        Row: {
          id: number
          month_id: number | null
          player_id: number
          quantity: number
        }
        Insert: {
          id?: number
          month_id?: number | null
          player_id: number
          quantity?: number
        }
        Update: {
          id?: number
          month_id?: number | null
          player_id?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "bonuses_month_id_fkey"
            columns: ["month_id"]
            isOneToOne: false
            referencedRelation: "months"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bonuses_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          id: number
          name: string
          order: number
          points_per_set: number
        }
        Insert: {
          id?: number
          name: string
          order: number
          points_per_set?: number
        }
        Update: {
          id?: number
          name?: string
          order?: number
          points_per_set?: number
        }
        Relationships: []
      }
      inscriptions: {
        Row: {
          category: string | null
          id: number
          phone_number: string
          player1_full_name: string
          player2_full_name: string
          tournament_id: number
          user_id: string
        }
        Insert: {
          category?: string | null
          id?: number
          phone_number: string
          player1_full_name: string
          player2_full_name: string
          tournament_id: number
          user_id: string
        }
        Update: {
          category?: string | null
          id?: number
          phone_number?: string
          player1_full_name?: string
          player2_full_name?: string
          tournament_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inscriptions_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
        ]
      }
      match_participants: {
        Row: {
          id: number
          match_id: number
          player_id: number
          substitute_id: number | null
        }
        Insert: {
          id?: number
          match_id: number
          player_id: number
          substitute_id?: number | null
        }
        Update: {
          id?: number
          match_id?: number
          player_id?: number
          substitute_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "match_participants_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_participants_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_participants_substitute_id_fkey"
            columns: ["substitute_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      matchdays: {
        Row: {
          id: number
          month_id: number
          order: number
        }
        Insert: {
          id?: number
          month_id: number
          order: number
        }
        Update: {
          id?: number
          month_id?: number
          order?: number
        }
        Relationships: []
      }
      matches: {
        Row: {
          category_id: number
          id: number
          matchday_id: number
        }
        Insert: {
          category_id: number
          id?: number
          matchday_id: number
        }
        Update: {
          category_id?: number
          id?: number
          matchday_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "matches_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_matchday_id_fkey"
            columns: ["matchday_id"]
            isOneToOne: false
            referencedRelation: "matchdays"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          full_name: string
          id: number
          is_active: boolean
          nickname: string | null
        }
        Insert: {
          full_name: string
          id?: number
          is_active?: boolean
          nickname?: string | null
        }
        Update: {
          full_name?: string
          id?: number
          is_active?: boolean
          nickname?: string | null
        }
        Relationships: []
      }
      months: {
        Row: {
          has_fifth_category: boolean
          id: number
          month: number
          season_id: number
          status: Database["public"]["Enums"]["month_status"]
          year: number
        }
        Insert: {
          has_fifth_category?: boolean
          id?: number
          month: number
          season_id: number
          status?: Database["public"]["Enums"]["month_status"]
          year: number
        }
        Update: {
          has_fifth_category?: boolean
          id?: number
          month?: number
          season_id?: number
          status?: Database["public"]["Enums"]["month_status"]
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "months_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      player_category_assignments: {
        Row: {
          category_id: number
          id: number
          month_id: number
          player_id: number
        }
        Insert: {
          category_id: number
          id?: number
          month_id: number
          player_id: number
        }
        Update: {
          category_id?: number
          id?: number
          month_id?: number
          player_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "player_category_assignments_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_category_assignments_month_id_fkey"
            columns: ["month_id"]
            isOneToOne: false
            referencedRelation: "months"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "player_category_assignments_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      seasons: {
        Row: {
          id: number
          name: string
          start_date: string | null
        }
        Insert: {
          id?: number
          name: string
          start_date?: string | null
        }
        Update: {
          id?: number
          name?: string
          start_date?: string | null
        }
        Relationships: []
      }
      sets: {
        Row: {
          id: number
          match_id: number
          order: number
          pair1_player1_id: number
          pair1_player2_id: number
          pair1_score: number
          pair2_player1_id: number
          pair2_player2_id: number
          pair2_score: number
        }
        Insert: {
          id?: number
          match_id: number
          order: number
          pair1_player1_id: number
          pair1_player2_id: number
          pair1_score: number
          pair2_player1_id: number
          pair2_player2_id: number
          pair2_score: number
        }
        Update: {
          id?: number
          match_id?: number
          order?: number
          pair1_player1_id?: number
          pair1_player2_id?: number
          pair1_score?: number
          pair2_player1_id?: number
          pair2_player2_id?: number
          pair2_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "sets_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sets_pair1_player1_id_fkey"
            columns: ["pair1_player1_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sets_pair1_player2_id_fkey"
            columns: ["pair1_player2_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sets_pair2_player1_id_fkey"
            columns: ["pair2_player1_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sets_pair2_player2_id_fkey"
            columns: ["pair2_player2_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          categories: string[] | null
          description: string | null
          end_date: string
          id: number
          img_path: string | null
          inscription_end_date: string
          manually_closed: boolean
          name: string
          start_date: string
        }
        Insert: {
          categories?: string[] | null
          description?: string | null
          end_date: string
          id?: number
          img_path?: string | null
          inscription_end_date: string
          manually_closed: boolean
          name: string
          start_date: string
        }
        Update: {
          categories?: string[] | null
          description?: string | null
          end_date?: string
          id?: number
          img_path?: string | null
          inscription_end_date?: string
          manually_closed?: boolean
          name?: string
          start_date?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_temporada_with_months: {
        Args: { p_months: Json; p_name: string; p_start_date: string }
        Returns: undefined
      }
      generar_partidos_mes: {
        Args: { p_mes_id: number; p_partidos: Json }
        Returns: undefined
      }
      get_global_classification: {
        Args: { p_temporada_id: number }
        Returns: {
          diff: number
          full_name: string
          games_for: number
          matches_played: number
          nickname: string
          player_id: number
          points: number
        }[]
      }
      get_month_classification: {
        Args: { p_categoria_id: number; p_mes_id: number }
        Returns: {
          diff: number
          full_name: string
          games_for: number
          matches_played: number
          nickname: string
          player_id: number
          points: number
        }[]
      }
      register_match_results: {
        Args: { p_participacion: Json; p_partido_id: number; p_sets: Json }
        Returns: undefined
      }
    }
    Enums: {
      month_status: "draft" | "locked" | "confirmed"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      month_status: ["draft", "locked", "confirmed"],
    },
  },
} as const

