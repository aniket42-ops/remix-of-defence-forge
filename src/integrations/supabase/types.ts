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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string
          slug: string
          sort_order: number
          title: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          image_url?: string
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      characteristic_prices: {
        Row: {
          characteristic_key: string
          characteristic_label: string
          created_at: string
          id: string
          is_customizable: boolean
          option_label: string
          option_value: string
          price: number
          sort_order: number
          sub_category_id: string
          updated_at: string
        }
        Insert: {
          characteristic_key: string
          characteristic_label: string
          created_at?: string
          id?: string
          is_customizable?: boolean
          option_label: string
          option_value: string
          price?: number
          sort_order?: number
          sub_category_id: string
          updated_at?: string
        }
        Update: {
          characteristic_key?: string
          characteristic_label?: string
          created_at?: string
          id?: string
          is_customizable?: boolean
          option_label?: string
          option_value?: string
          price?: number
          sort_order?: number
          sub_category_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "characteristic_prices_sub_category_id_fkey"
            columns: ["sub_category_id"]
            isOneToOne: false
            referencedRelation: "sub_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          base_price: number
          created_at: string
          guy_ropes: string
          head_load: number
          height_erected: number
          height_retracted: number
          id: string
          model_no: string
          sections: number
          sub_category_id: string
          sway: string
          tripod_guy_ropes: string
          tripod_weight: number
          tube_dia: string
          updated_at: string
          visible: boolean
          weight: number
          wind_area: number
          wind_speed_operational: number
          wind_speed_survival: number
        }
        Insert: {
          base_price?: number
          created_at?: string
          guy_ropes?: string
          head_load?: number
          height_erected?: number
          height_retracted?: number
          id?: string
          model_no: string
          sections?: number
          sub_category_id: string
          sway?: string
          tripod_guy_ropes?: string
          tripod_weight?: number
          tube_dia?: string
          updated_at?: string
          visible?: boolean
          weight?: number
          wind_area?: number
          wind_speed_operational?: number
          wind_speed_survival?: number
        }
        Update: {
          base_price?: number
          created_at?: string
          guy_ropes?: string
          head_load?: number
          height_erected?: number
          height_retracted?: number
          id?: string
          model_no?: string
          sections?: number
          sub_category_id?: string
          sway?: string
          tripod_guy_ropes?: string
          tripod_weight?: number
          tube_dia?: string
          updated_at?: string
          visible?: boolean
          weight?: number
          wind_area?: number
          wind_speed_operational?: number
          wind_speed_survival?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_sub_category_id_fkey"
            columns: ["sub_category_id"]
            isOneToOne: false
            referencedRelation: "sub_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          category: string
          company: string
          country: string
          created_at: string
          email: string
          estimated_price: number
          id: string
          message: string
          name: string
          phone: string
          product_model: string
          quantity: number
          status: string
          sub_category: string
        }
        Insert: {
          category: string
          company?: string
          country?: string
          created_at?: string
          email: string
          estimated_price?: number
          id?: string
          message?: string
          name: string
          phone?: string
          product_model: string
          quantity?: number
          status?: string
          sub_category: string
        }
        Update: {
          category?: string
          company?: string
          country?: string
          created_at?: string
          email?: string
          estimated_price?: number
          id?: string
          message?: string
          name?: string
          phone?: string
          product_model?: string
          quantity?: number
          status?: string
          sub_category?: string
        }
        Relationships: []
      }
      sub_categories: {
        Row: {
          category_id: string
          created_at: string
          description: string
          id: string
          slug: string
          sort_order: number
          title: string
          updated_at: string
          visible: boolean
        }
        Insert: {
          category_id: string
          created_at?: string
          description: string
          id?: string
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
          visible?: boolean
        }
        Update: {
          category_id?: string
          created_at?: string
          description?: string
          id?: string
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
          visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "sub_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
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
