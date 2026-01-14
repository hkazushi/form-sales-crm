import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ipypoksxlmdzbrdzpqwr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjdWx0c2JhcWtreXFoeWhpYWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNTQzMzgsImV4cCI6MjA4MzgzMDMzOH0.QJ02OzL_zIyxmvqRSd-CM66ScOqXYf6yQYBicB1lo6M';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
