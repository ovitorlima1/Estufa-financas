
import { createClient } from '@supabase/supabase-js';

/**
 * No Vite, variáveis de ambiente para o cliente DEVEM começar com VITE_.
 * Elas são acessadas via import.meta.env em vez de process.env.
 */
const env = (import.meta as any).env || {};

const supabaseUrl = env.VITE_SUPABASE_URL || "https://hxvitksdttsoossfjtia.supabase.co";
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4dml0a3NkdHRzb29zc2ZqdGlhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTUzMDc5OSwiZXhwIjoyMDgxMTA2Nzk5fQ.UxlNWZlU-aX8goxNOdssvhCg5PBRj9qGXrsk0R8che8";

// Exporta o cliente diretamente. 
// Como supabaseUrl e supabaseAnonKey são garantidos como strings (pelo fallback), 
// o tipo retornado nunca será null.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
