import { Database } from "../types/supabase";
import supabase from "./supabaseConfig";

// Types
type Form = Database["public"]["Tables"]["forms"]["Row"];
type Activity = Database["public"]["Tables"]["activites"]["Row"];
type Program = Database["public"]["Tables"]["programs"]["Row"];
type Question = Database["public"]["Tables"]["questions"]["Row"];
type Response = Database["public"]["Tables"]["responses"]["Row"];
type QUESTION_TYPE = Database["public"]["Enums"]["QUESTION_TYPE"];
type ANALYSIS_TYPE = Database["public"]["Enums"]["ANALYSIS_TYPE"];

/**
 * Form Module
 */
export const GetAllForms = async () => {
  const { data: forms, error } = await supabase.from("forms").select("*");
  return forms;
};

export const GetFormById = async ({ formId }: { formId: number }) => {
  const { data: form, error } = await supabase.from("forms").select("*").eq("id", formId).single();
  return form;
};

export const GetFormByProgramId = async ({ programId }: { programId: number }) => {
  const { data: forms, error } = await supabase.from("forms").select("*").eq("program_id", programId);
  return forms;
};

export const GetFormByActivityId = async ({ activityId }: { activityId: number }) => {
  const { data: forms, error } = await supabase.from("forms").select("*").eq("activity_id", activityId);
  return forms;
};

export const AddNewForm = async ({ newForm }: { newForm: Form }) => {
  supabase.from("forms").insert(newForm);
};

/**
 * Activity Module
 */
export const GetAllActivities = async () => {
  const { data: activities, error } = await supabase.from("activites").select("*");
  return activities;
};

export const GetActivityById = async ({ activityId }: { activityId: number }) => {
  const { data: activity, error } = await supabase.from("activites").select("*").eq("id", activityId).single();
  return activity;
};

export const GetActivityByProgramId = async ({ programId }: { programId: number }) => {
  const { data: activities, error } = await supabase.from("activites").select("*").eq("program_id", programId);
  return activities;
};

export const AddNewActivity = async ({ newActivity }: { newActivity: Activity }) => {
  supabase.from("activites").insert(newActivity);
};

/**
 * Program Module
 */
export const GetAllPrograms = async () => {
  const { data: programs, error } = await supabase.from("programs").select("*");
  return programs;
};

export const GetProgramById = async ({ programId }: { programId: number }) => {
  const { data: program, error } = await supabase.from("programs").select("*").eq("id", programId).single();
  return program;
};

export const AddNewProgram = async ({ newProgram }: { newProgram: Program }) => {
  supabase.from("programs").insert(newProgram);
};

/**
 * Question Module
 */
export const GetAllQuestions = async () => {
  const { data: questions, error } = await supabase.from("questions").select("*");
  return questions;
};

export const GetQuestionById = async ({ questionId }: { questionId: number }) => {
  const { data: question, error } = await supabase.from("questions").select("*").eq("id", questionId).single();
  return question;
};

export const GetQuestionByFormId = async ({ formId }: { formId: number }) => {
  const { data: questions, error } = await supabase.from("questions").select("*").eq("form_id", formId);
  return questions;
};

export const GetQuestionByQuestionType = async ({ questionType }: { questionType: QUESTION_TYPE }) => {
  const { data: questions, error } = await supabase.from("questions").select("*").eq("question_type", questionType);
  return questions;
};

export const GetQuestionByAnalysisType = async ({ analysisType }: { analysisType: ANALYSIS_TYPE }) => {
  const { data: questions, error } = await supabase.from("questions").select("*").eq("analysis_type", analysisType);
  return questions;
};

export const AddNewQuestion = async ({ newQuestion }: { newQuestion: Question }) => {
  supabase.from("questions").insert(newQuestion);
};

/**
 * Response Module
 */
export const GetAllResponses = async () => {
  const { data: responses, error } = await supabase.from("responses").select("*");
  return responses;
};

export const GetResponseById = async ({ responseId }: { responseId: number }) => {
  const { data: response, error } = await supabase.from("responses").select("*").eq("id", responseId).single();
  return response;
};

export const GetResponseByQuestionId = async ({ questionId }: { questionId: number }) => {
  const { data: responses, error } = await supabase.from("responses").select("*").eq("question_id", questionId);
  return responses;
};
