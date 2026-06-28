const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const requiredEnv = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
const missingEnv = requiredEnv.filter((name) => !process.env[name]);

if (missingEnv.length > 0) {
  throw new Error(
    `Faltan variables de entorno de Supabase: ${missingEnv.join(', ')}. ` +
    'Crea el archivo backend/.env tomando como base backend/.env.example.'
  );
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

module.exports = supabase;
