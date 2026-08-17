import { createClient } from "@supabase/supabase-js";

// We will use the new project where we created the packages and bookings tables
const supabaseUrl = "https://jukdvumkkxekyjbhcosy.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1a2R2dW1ra3hla3lqYmhjb3N5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ2MDA4NzgsImV4cCI6MjEwMDE3Njg3OH0.Gxx3mUnHDssZbHYA299bJzjJTgeggULjvEu9NT5B_8k";

export const nnaSupabase = createClient(supabaseUrl, supabaseKey);
