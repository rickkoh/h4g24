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
      activites: {
        Row: {
          description: string | null
          id: number
          program_id: number
          title: string | null
        }
        Insert: {
          description?: string | null
          id?: number
          program_id: number
          title?: string | null
        }
        Update: {
          description?: string | null
          id?: number
          program_id?: number
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activites_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          }
        ]
      }
      forms: {
        Row: {
          activity_id: number | null
          id: number
          program_id: number | null
          title: string | null
        }
        Insert: {
          activity_id?: number | null
          id?: number
          program_id?: number | null
          title?: string | null
        }
        Update: {
          activity_id?: number | null
          id?: number
          program_id?: number | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forms_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forms_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          }
        ]
      }
      programs: {
        Row: {
          description: string | null
          id: number
          title: string | null
        }
        Insert: {
          description?: string | null
          id?: number
          title?: string | null
        }
        Update: {
          description?: string | null
          id?: number
          title?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          analysis_type: Database["public"]["Enums"]["ANALYSIS_TYPE"]
          form_id: number
          id: number
          question_type: Database["public"]["Enums"]["QUESTION_TYPE"]
          text: string | null
        }
        Insert: {
          analysis_type: Database["public"]["Enums"]["ANALYSIS_TYPE"]
          form_id: number
          id?: number
          question_type: Database["public"]["Enums"]["QUESTION_TYPE"]
          text?: string | null
        }
        Update: {
          analysis_type?: Database["public"]["Enums"]["ANALYSIS_TYPE"]
          form_id?: number
          id?: number
          question_type?: Database["public"]["Enums"]["QUESTION_TYPE"]
          text?: string | null
        }
        Relationships: [
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
          answer: string | null
          id: number
          question_id: number
        }
        Insert: {
          answer?: string | null
          id?: number
          question_id: number
        }
        Update: {
          answer?: string | null
          id?: number
          question_id?: number
        }
        Relationships: [
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
      ANALYSIS_TYPE: "SENTIMENTAL" | "SUMMARY" | "KEYWORD"
      QUESTION_TYPE: "TEXT_ANSWER" | "MULTIPLE_CHOICE" | "CHECKBOX"
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
