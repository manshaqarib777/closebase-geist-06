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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          answers: Json | null
          created_at: string
          cv_path: string | null
          fit_score: number | null
          id: string
          job_id: string
          message: string | null
          source: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answers?: Json | null
          created_at?: string
          cv_path?: string | null
          fit_score?: number | null
          id?: string
          job_id: string
          message?: string | null
          source?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answers?: Json | null
          created_at?: string
          cv_path?: string | null
          fit_score?: number | null
          id?: string
          job_id?: string
          message?: string | null
          source?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          description: string | null
          headcount_band: string | null
          id: string
          industry: string[] | null
          linkedin_url: string | null
          location_city: string | null
          location_country: string | null
          logo_file_id: string | null
          moderation_score: number | null
          name: string
          owner_id: string | null
          revenue_band: string | null
          stripe_customer_id: string | null
          subscription_end_date: string | null
          subscription_product_id: string | null
          subscription_status: string | null
          updated_at: string
          vat_id: string | null
          verified_at: string | null
          website_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          headcount_band?: string | null
          id?: string
          industry?: string[] | null
          linkedin_url?: string | null
          location_city?: string | null
          location_country?: string | null
          logo_file_id?: string | null
          moderation_score?: number | null
          name: string
          owner_id?: string | null
          revenue_band?: string | null
          stripe_customer_id?: string | null
          subscription_end_date?: string | null
          subscription_product_id?: string | null
          subscription_status?: string | null
          updated_at?: string
          vat_id?: string | null
          verified_at?: string | null
          website_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          headcount_band?: string | null
          id?: string
          industry?: string[] | null
          linkedin_url?: string | null
          location_city?: string | null
          location_country?: string | null
          logo_file_id?: string | null
          moderation_score?: number | null
          name?: string
          owner_id?: string | null
          revenue_band?: string | null
          stripe_customer_id?: string | null
          subscription_end_date?: string | null
          subscription_product_id?: string | null
          subscription_status?: string | null
          updated_at?: string
          vat_id?: string | null
          verified_at?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      company_users: {
        Row: {
          accepted_at: string | null
          company_id: string
          created_at: string
          id: string
          invited_at: string | null
          role: string
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          company_id: string
          created_at?: string
          id?: string
          invited_at?: string | null
          role: string
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          company_id?: string
          created_at?: string
          id?: string
          invited_at?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_users_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      interviews: {
        Row: {
          application_id: string
          confirmed_at: string | null
          created_at: string | null
          id: string
          slot_chosen_at: string | null
          slots: Json
          status: Database["public"]["Enums"]["interview_status"] | null
          updated_at: string | null
        }
        Insert: {
          application_id: string
          confirmed_at?: string | null
          created_at?: string | null
          id?: string
          slot_chosen_at?: string | null
          slots: Json
          status?: Database["public"]["Enums"]["interview_status"] | null
          updated_at?: string | null
        }
        Update: {
          application_id?: string
          confirmed_at?: string | null
          created_at?: string | null
          id?: string
          slot_chosen_at?: string | null
          slots?: Json
          status?: Database["public"]["Enums"]["interview_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interviews_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      job_saved_searches: {
        Row: {
          company_id: string
          created_at: string
          id: string
          query_json: Json
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          query_json: Json
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          query_json?: Json
        }
        Relationships: [
          {
            foreignKeyName: "job_saved_searches_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      job_views: {
        Row: {
          created_at: string
          id: string
          ip_hash: string | null
          job_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_hash?: string | null
          job_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_hash?: string | null
          job_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_views_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          avg_commission_eur: number | null
          avg_commission_percent: number | null
          avg_product_cost_band: string | null
          benefits_md: string | null
          boost_until: string | null
          company_id: string
          created_at: string
          description_md: string | null
          employment_type: string | null
          expires_at: string | null
          id: string
          industries: string[] | null
          kpis_md: string | null
          language: string | null
          leads_available: boolean | null
          leads_type: string | null
          location_city: string | null
          location_country: string | null
          location_mode: string | null
          one_time_payment_eur: number | null
          product_desc_md: string | null
          published_at: string | null
          quality_score_int: number | null
          requirements_md: string | null
          responsibilities_md: string | null
          role_needed: string
          sales_cycle_band: string | null
          screening_questions: Json | null
          seniority: string | null
          status: string
          title: string
          tools: Json | null
          updated_at: string
          weekly_hours_needed: number | null
        }
        Insert: {
          avg_commission_eur?: number | null
          avg_commission_percent?: number | null
          avg_product_cost_band?: string | null
          benefits_md?: string | null
          boost_until?: string | null
          company_id: string
          created_at?: string
          description_md?: string | null
          employment_type?: string | null
          expires_at?: string | null
          id?: string
          industries?: string[] | null
          kpis_md?: string | null
          language?: string | null
          leads_available?: boolean | null
          leads_type?: string | null
          location_city?: string | null
          location_country?: string | null
          location_mode?: string | null
          one_time_payment_eur?: number | null
          product_desc_md?: string | null
          published_at?: string | null
          quality_score_int?: number | null
          requirements_md?: string | null
          responsibilities_md?: string | null
          role_needed: string
          sales_cycle_band?: string | null
          screening_questions?: Json | null
          seniority?: string | null
          status?: string
          title: string
          tools?: Json | null
          updated_at?: string
          weekly_hours_needed?: number | null
        }
        Update: {
          avg_commission_eur?: number | null
          avg_commission_percent?: number | null
          avg_product_cost_band?: string | null
          benefits_md?: string | null
          boost_until?: string | null
          company_id?: string
          created_at?: string
          description_md?: string | null
          employment_type?: string | null
          expires_at?: string | null
          id?: string
          industries?: string[] | null
          kpis_md?: string | null
          language?: string | null
          leads_available?: boolean | null
          leads_type?: string | null
          location_city?: string | null
          location_country?: string | null
          location_mode?: string | null
          one_time_payment_eur?: number | null
          product_desc_md?: string | null
          published_at?: string | null
          quality_score_int?: number | null
          requirements_md?: string | null
          responsibilities_md?: string | null
          role_needed?: string
          sales_cycle_band?: string | null
          screening_questions?: Json | null
          seniority?: string | null
          status?: string
          title?: string
          tools?: Json | null
          updated_at?: string
          weekly_hours_needed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachments: Json | null
          body: string | null
          created_at: string | null
          id: string
          sender_id: string
          thread_id: string
        }
        Insert: {
          attachments?: Json | null
          body?: string | null
          created_at?: string | null
          id?: string
          sender_id: string
          thread_id: string
        }
        Update: {
          attachments?: Json | null
          body?: string | null
          created_at?: string | null
          id?: string
          sender_id?: string
          thread_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "threads"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          message: string | null
          read: boolean | null
          title: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string | null
          read?: boolean | null
          title: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string | null
          read?: boolean | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          avg_deal_eur: number | null
          bio: string | null
          company_id: string | null
          created_at: string
          display_name: string | null
          first_name: string | null
          id: string
          intro_video_duration: number | null
          intro_video_path: string | null
          intro_video_thumb_path: string | null
          intro_video_uploaded_at: string | null
          intro_video_visibility: string | null
          last_name: string | null
          role: string | null
          updated_at: string
          user_id: string
          years_of_experience: number | null
        }
        Insert: {
          avatar_url?: string | null
          avg_deal_eur?: number | null
          bio?: string | null
          company_id?: string | null
          created_at?: string
          display_name?: string | null
          first_name?: string | null
          id?: string
          intro_video_duration?: number | null
          intro_video_path?: string | null
          intro_video_thumb_path?: string | null
          intro_video_uploaded_at?: string | null
          intro_video_visibility?: string | null
          last_name?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
          years_of_experience?: number | null
        }
        Update: {
          avatar_url?: string | null
          avg_deal_eur?: number | null
          bio?: string | null
          company_id?: string | null
          created_at?: string
          display_name?: string | null
          first_name?: string | null
          id?: string
          intro_video_duration?: number | null
          intro_video_path?: string | null
          intro_video_thumb_path?: string | null
          intro_video_uploaded_at?: string | null
          intro_video_visibility?: string | null
          last_name?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
          years_of_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_jobs: {
        Row: {
          created_at: string | null
          id: string
          job_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          job_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      threads: {
        Row: {
          created_at: string | null
          id: string
          topic_id: string
          topic_type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          topic_id: string
          topic_type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          topic_id?: string
          topic_type?: string
          updated_at?: string | null
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
      application_stage:
        | "applied"
        | "shortlist"
        | "interview"
        | "offer"
        | "hired"
        | "rejected"
      interview_status: "proposed" | "confirmed" | "declined"
      job_status: "draft" | "pending" | "published" | "closed"
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
    Enums: {
      application_stage: [
        "applied",
        "shortlist",
        "interview",
        "offer",
        "hired",
        "rejected",
      ],
      interview_status: ["proposed", "confirmed", "declined"],
      job_status: ["draft", "pending", "published", "closed"],
    },
  },
} as const
