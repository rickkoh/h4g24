import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

const SUPABSE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const supabase = createClient<Database>(SUPABSE_URL || "", SUPABASE_KEY || "");
export default supabase;
