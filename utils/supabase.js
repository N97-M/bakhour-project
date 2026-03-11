import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// If keys are missing, we export a dummy client that throws on use.
// This prevents the build process from crashing during static analysis.
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : new Proxy({}, {
        get: (target, prop) => {
            if (prop === 'then') return undefined; // Handle async/await checks
            return (...args) => {
                console.error(`Supabase attempted to call "${String(prop)}" but is not initialized. Check your environment variables.`);
                return { data: null, error: new Error("Supabase not initialized") };
            };
        }
    });
