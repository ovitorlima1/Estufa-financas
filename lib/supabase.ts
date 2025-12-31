
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || "https://hxvitksdttsoossfjtia.supabase.co";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4dml0a3NkdHRzb29zc2ZqdGlhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTUzMDc5OSwiZXhwIjoyMDgxMTA2Nzk5fQ.UxlNWZlU-aX8goxNOdssvhCg5PBRj9qGXrsk0R8che8";

// Só inicializa o cliente se as credenciais existirem para evitar o erro "supabaseUrl is required"
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
