import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

const SUPABSE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const supabase = createClient<Database>(SUPABSE_URL || "https://aojwftxnuzjqxsmdjtrb.supabase.co", SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvandmdHhudXpqcXhzbWRqdHJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY4MDc0MjgsImV4cCI6MjAyMjM4MzQyOH0.r1YY-oq-mEIFnT--QvAijQE7_605JciTs3Y0JEEQlDE");
export default supabase;
