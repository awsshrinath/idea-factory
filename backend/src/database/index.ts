import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ Backend Configuration Error:');
  console.error('Missing required Supabase environment variables.\n');
  
  if (!supabaseUrl) {
    console.error('Missing: SUPABASE_URL');
    console.error('Add this to your backend/.env file:');
    console.error('SUPABASE_URL=https://nphkufnrodsvvyxyaglc.supabase.co\n');
  }
  
  if (!supabaseKey) {
    console.error('Missing: SUPABASE_SERVICE_ROLE_KEY');
    console.error('Get your service role key from:');
    console.error('https://supabase.com/dashboard/project/nphkufnrodsvvyxyaglc/settings/api');
    console.error('Add it to your backend/.env file as:');
    console.error('SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key\n');
  }
  
  console.error('📖 See backend/SETUP.md for detailed setup instructions.');
  console.error('⚠️  Backend cannot start without these variables.\n');
  
  throw new Error('Supabase URL and Service Role Key must be provided in environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

console.log('✅ Supabase client initialized successfully');
