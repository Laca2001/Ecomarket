// Usa la variable global "window.supabase" que carga desde el CDN
const SUPABASE_URL = "https://euuwitoztqanqaerkiwg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1dXdpdG96dHFhbnFhZXJraXdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NzI5NjAsImV4cCI6MjA4MDQ0ODk2MH0.duRKMoYyT7AX3qi4Ot2AK6egNepi59yjlCZF7332SeY";

// Creamos un cliente global que podrás usar en otros scripts
window.supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
