import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mbtbfjholufobjyxivvi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1idGJmamhvbHVmb2JqeXhpdnZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2NDU2MzksImV4cCI6MjA4ODIyMTYzOX0.1hY-UsyoGXR0PlnFY7iYYddrFqja2oBzZnplDV0Gh_A";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);