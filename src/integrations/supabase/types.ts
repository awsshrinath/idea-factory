export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      content: {
        Row: {
          created_at: string | null
          description: string
          generated_content: string | null
          id: string
          platforms: string[]
          status: string
          title: string
          tone: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          generated_content?: string | null
          id?: string
          platforms: string[]
          status?: string
          title: string
          tone: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          generated_content?: string | null
          id?: string
          platforms?: string[]
          status?: string
          title?: string
          tone?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      content_versions: {
        Row: {
          content: string
          content_id: string | null
          created_at: string | null
          id: string
          user_id: string | null
          version_number: number
        }
        Insert: {
          content: string
          content_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
          version_number: number
        }
        Update: {
          content?: string
          content_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_versions_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "generated_content"
            referencedColumns: ["id"]
          },
        ]
      }
      generated_content: {
        Row: {
          ai_model: string
          created_at: string | null
          description: string
          edited_content: string | null
          generated_text: string | null
          hashtags: string[] | null
          id: string
          is_edited: boolean | null
          language: string
          platform: string[]
          seo_score: number | null
          status: string | null
          tone: string
          updated_at: string | null
          user_id: string
          version: number
        }
        Insert: {
          ai_model?: string
          created_at?: string | null
          description: string
          edited_content?: string | null
          generated_text?: string | null
          hashtags?: string[] | null
          id?: string
          is_edited?: boolean | null
          language?: string
          platform: string[]
          seo_score?: number | null
          status?: string | null
          tone: string
          updated_at?: string | null
          user_id: string
          version?: number
        }
        Update: {
          ai_model?: string
          created_at?: string | null
          description?: string
          edited_content?: string | null
          generated_text?: string | null
          hashtags?: string[] | null
          id?: string
          is_edited?: boolean | null
          language?: string
          platform?: string[]
          seo_score?: number | null
          status?: string | null
          tone?: string
          updated_at?: string | null
          user_id?: string
          version?: number
        }
        Relationships: []
      }
      generated_images: {
        Row: {
          aspect_ratio: string
          created_at: string | null
          id: string
          image_path: string
          is_favorite: boolean | null
          prompt: string
          style: string
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          aspect_ratio: string
          created_at?: string | null
          id?: string
          image_path: string
          is_favorite?: boolean | null
          prompt: string
          style: string
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          aspect_ratio?: string
          created_at?: string | null
          id?: string
          image_path?: string
          is_favorite?: boolean | null
          prompt?: string
          style?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      recent_activity: {
        Row: {
          activity_type: string
          created_at: string | null
          details: Json | null
          id: string
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          details?: Json | null
          id?: string
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      sample_videos: {
        Row: {
          created_at: string | null
          description: string
          id: string
          style: string
          thumbnail_url: string
          title: string
          video_url: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          style: string
          thumbnail_url: string
          title: string
          video_url: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          style?: string
          thumbnail_url?: string
          title?: string
          video_url?: string
        }
        Relationships: []
      }
      scheduled_posts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          platform: string[]
          scheduled_date: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          platform: string[]
          scheduled_date: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          platform?: string[]
          scheduled_date?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      trending_topics: {
        Row: {
          created_at: string | null
          description: string
          id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      user_metrics: {
        Row: {
          engagement_rate: number | null
          top_content: Json | null
          total_content: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          engagement_rate?: number | null
          top_content?: Json | null
          total_content?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          engagement_rate?: number | null
          top_content?: Json | null
          total_content?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          created_at: string | null
          file_path: string
          id: string
          public_url: string | null
          script_content: string | null
          status: string
          style: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          user_id: string
          video_type: string
        }
        Insert: {
          created_at?: string | null
          file_path: string
          id?: string
          public_url?: string | null
          script_content?: string | null
          status?: string
          style?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          video_type: string
        }
        Update: {
          created_at?: string | null
          file_path?: string
          id?: string
          public_url?: string | null
          script_content?: string | null
          status?: string
          style?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          video_type?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
