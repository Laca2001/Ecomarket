// Usa la variable global "window.supabase" que carga desde el CDN
const SUPABASE_URL = "TU_PROJECT_URL_AQUI";
const SUPABASE_ANON_KEY = "TU_ANON_PUBLIC_KEY_AQUI";

// Creamos un cliente global que podrás usar en otros scripts
window.supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
