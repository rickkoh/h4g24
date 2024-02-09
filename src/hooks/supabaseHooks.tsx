import { Database } from "../types/supabase";
import supabase from "./supabaseConfig";
import { Activity, ActivityInsert, SurveyInsert, Program, Question, QuestionInsert, Response, ResponseInsert, ProgramInsert } from "../types/types";

// Types
type QUESTION_TYPE = Database["public"]["Enums"]["QUESTION_TYPE"];
type ANALYSIS_TYPE = Database["public"]["Enums"]["ANALYSIS_TYPE"];

/**
 * Form Module
 */
export const GetAllForms = async () => {
  const { data: forms, error } = await supabase.from("forms").select("*");
  return forms;
};

export const GetFormById = async ({ formId }: { formId: string }) => {
  const { data: form, error } = await supabase.from("forms").select("*").eq("id", formId).single();
  return form;
};

export const GetFormByProgramId = async ({ programId }: { programId: string }) => {
  const { data: forms, error } = await supabase.from("forms").select("*").eq("program_id", programId);
  return forms;
};

export const GetFormByActivityId = async ({ activityId }: { activityId: string }) => {
  const { data: forms, error } = await supabase.from("forms").select("*").eq("activity_id", activityId);
  return forms;
};

export const AddNewForm = async ({ newForm }: { newForm: SurveyInsert }) => {
  const response = await supabase.from("forms").insert(newForm).select();
  return response;
};

export const LinkFormToActivity = async ({ formId, activityId }: { formId: string; activityId: string }) => {
  console.log(formId, activityId);
  const response = await supabase.from("forms").update({ activity_id: activityId }).eq("id", formId).select();
  return response;
};

/**
 * Activity Module
 */
export const GetAllActivities = async () => {
  const { data: activities, error } = await supabase.from("activities").select("*");
  return activities;
};

export const GetActivityById = async ({ activityId }: { activityId: string }) => {
  const { data: activity, error } = await supabase.from("activities").select("*").eq("id", activityId).single();
  return activity;
};

export const GetActivityByProgramId = async ({ programId }: { programId: string }) => {
  const { data: activities, error } = await supabase.from("activities").select("*").eq("program_id", programId);
  return activities;
};

export const AddNewActivity = async ({ newActivity }: { newActivity: ActivityInsert }) => {
  const { data, error } = await supabase.from("activities").insert(newActivity);
  return data;
};

/**
 * Program Module
 */
export const GetAllPrograms = async () => {
  const { data: programs, error } = await supabase.from("programs").select("*");
  return programs;
};

export const GetProgramById = async ({ programId }: { programId: string }) => {
  const { data: program, error } = await supabase.from("programs").select("*").eq("id", programId).single();
  return program;
};

export const AddNewProgram = async ({ newProgram }: { newProgram: ProgramInsert }) => {
  supabase.from("programs").insert(newProgram);
};

export const LinkActivityToProgram = async ({ programId, activityId }: { programId: string; activityId: string }) => {
  const response = await supabase.from("activities").update({ program_id: programId }).eq("id", activityId).select();
  return response;
};

/**
 * Question Module
 */
export const GetAllQuestions = async () => {
  const { data: questions, error } = await supabase.from("questions").select("*");
  return questions;
};

export const GetQuestionById = async ({ questionId }: { questionId: string }) => {
  const { data: question, error } = await supabase.from("questions").select("*").eq("id", questionId).single();
  return question;
};

export const GetQuestionByFormId = async ({ formId }: { formId: string }) => {
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

export const AddAllNewQuestions = async ({ newQuestions }: { newQuestions: QuestionInsert[] }) => {
  const { data, error } = await supabase.from("questions").insert(newQuestions).select();
  return data;
};
/**
 * Response Module
 */
export const GetAllResponses = async () => {
  const { data: responses, error } = await supabase.from("responses").select("*");
  return responses;
};

export const GetResponseById = async ({ responseId }: { responseId: string }) => {
  const { data: response, error } = await supabase.from("responses").select("*").eq("id", responseId).single();
  return response;
};

export const GetResponseByQuestionId = async ({ questionId }: { questionId: string }) => {
  const { data: responses, error } = await supabase.from("responses").select("*").eq("question_id", questionId);
  return responses;
};

export const AddNewResponse = async ({ newResponse }: { newResponse: Response }) => {
  const { data, error } = await supabase.from("responses").insert(newResponse);
};

export const AddAllNewResponses = async ({ newResponses }: { newResponses: ResponseInsert[] }) => {
  const { data, error } = await supabase.from("responses").insert(newResponses);
};
