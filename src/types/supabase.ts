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
      activities: {
        Row: {
          analysis_output: Json | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          last_analysed: string | null
          program_id: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          analysis_output?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          last_analysed?: string | null
          program_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          analysis_output?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          last_analysed?: string | null
          program_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      forms: {
        Row: {
          activity_id: string | null
          analysis_output: Json | null
          created_at: string
          created_by: string | null
          id: string
          program_id: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          activity_id?: string | null
          analysis_output?: Json | null
          created_at?: string
          created_by?: string | null
          id?: string
          program_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          activity_id?: string | null
          analysis_output?: Json | null
          created_at?: string
          created_by?: string | null
          id?: string
          program_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forms_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      programs: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "programs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      questions: {
        Row: {
          analysis_output: Json | null
          analysis_type: Database["public"]["Enums"]["ANALYSIS_TYPE"] | null
          created_at: string
          created_by: string | null
          form_id: string | null
          id: string
          question_type: Database["public"]["Enums"]["QUESTION_TYPE"]
          text: string | null
          updated_at: string
        }
        Insert: {
          analysis_output?: Json | null
          analysis_type?: Database["public"]["Enums"]["ANALYSIS_TYPE"] | null
          created_at?: string
          created_by?: string | null
          form_id?: string | null
          id?: string
          question_type: Database["public"]["Enums"]["QUESTION_TYPE"]
          text?: string | null
          updated_at?: string
        }
        Update: {
          analysis_output?: Json | null
          analysis_type?: Database["public"]["Enums"]["ANALYSIS_TYPE"] | null
          created_at?: string
          created_by?: string | null
          form_id?: string | null
          id?: string
          question_type?: Database["public"]["Enums"]["QUESTION_TYPE"]
          text?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "forms"
            referencedColumns: ["id"]
          }
        ]
      }
      responses: {
        Row: {
          analysis_output: Json | null
          answer: string
          created_at: string
          created_by: string | null
          id: string
          question_id: string
          updated_at: string
        }
        Insert: {
          analysis_output?: Json | null
          answer: string
          created_at?: string
          created_by?: string | null
          id?: string
          question_id: string
          updated_at?: string
        }
        Update: {
          analysis_output?: Json | null
          answer?: string
          created_at?: string
          created_by?: string | null
          id?: string
          question_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "responses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          }
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
      ANALYSIS_TYPE: "SENTIMENTAL" | "SUMMARY" | "KEYWORD" | "NONE"
      QUESTION_TYPE:
        | "TEXT_ANSWER"
        | "MULTIPLE_CHOICE"
        | "CHECKBOX"
        | "LINEAR_SCALE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
