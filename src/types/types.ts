import { Database } from "./supabase";

export type Survey = Database["public"]["Tables"]["forms"]["Row"];
export type SurveyInsert = Database["public"]["Tables"]["forms"]["Insert"];
export type Activity = Database["public"]["Tables"]["activities"]["Row"];
export type ActivityInsert = Database["public"]["Tables"]["activities"]["Insert"];
export type Program = Database["public"]["Tables"]["programs"]["Row"];
export type ProgramInsert = Database["public"]["Tables"]["programs"]["Insert"];
export type Question = Database["public"]["Tables"]["questions"]["Row"];
export type QuestionInsert = Database["public"]["Tables"]["questions"]["Insert"];
export type Response = Database["public"]["Tables"]["responses"]["Row"];
export type ResponseInsert = Database["public"]["Tables"]["responses"]["Insert"];

export enum ANALYSIS_TYPE {
  SENTIMENTAL = "SENTIMENTAL",
  SUMMARY = "SUMMARY",
  KEYWORD = "KEYWORD",
}

export enum QUESTION_TYPE {
  TEXT_ANSWER = "TEXT_ANSWER",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  CHECKBOX = "CHECKBOX",
  LINEAR_SCALE = "LINEAR_SCALE",
}
