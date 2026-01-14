require('dotenv').config();

module.exports = {
  SUPABASE_URL: process.env.SUPABASE_URL || 'https://ipypoksxlmdzbrdzpqwr.supabase.co',
  SUPABASE_KEY: process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjdWx0c2JhcWtreXFoeWhpYWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNTQzMzgsImV4cCI6MjA4MzgzMDMzOH0.QJ02OzL_zIyxmvqRSd-CM66ScOqXYf6yQYBicB1lo6M',
  PORT: process.env.PORT || 3000,
  TIMEOUT: 180000,
  SYSTEM_PUPPETEER_KEY: 'SYSTEM_SCRIPT_PUPPETEER',
  SYSTEM_PLAYWRIGHT_KEY: 'SYSTEM_SCRIPT_PLAYWRIGHT'
};
