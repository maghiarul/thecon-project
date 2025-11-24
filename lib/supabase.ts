import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nhubwlyskpobeeuqxkyr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5odWJ3bHlza3BvYmVldXF4a3lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTIyMjksImV4cCI6MjA3OTU2ODIyOX0.bqykiBIWSQgp45gebJy-HdiJKeHgDSyRlDtc3YrhH9A';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
