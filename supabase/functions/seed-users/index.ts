import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const users = [
      { email: 'admin@campus.edu', password: 'admin123', name: 'Admin User', role: 'admin' },
      { email: 'teacher@campus.edu', password: 'teacher123', name: 'Prof. Kumar', role: 'teacher' },
      { email: 'student@campus.edu', password: 'student123', name: 'Student Demo', role: 'student' },
    ];

    const results = [];

    for (const u of users) {
      // Check if user exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existing = existingUsers?.users?.find(eu => eu.email === u.email);
      
      if (existing) {
        // Update role if needed
        await supabaseAdmin.from('user_roles').upsert(
          { user_id: existing.id, role: u.role },
          { onConflict: 'user_id,role' }
        );
        results.push({ email: u.email, status: 'exists', role: u.role });
        continue;
      }

      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: u.email,
        password: u.password,
        email_confirm: true,
        user_metadata: { full_name: u.name },
      });

      if (error) {
        results.push({ email: u.email, status: 'error', error: error.message });
        continue;
      }

      // The trigger creates student role by default, so update for non-students
      if (u.role !== 'student' && data.user) {
        await supabaseAdmin.from('user_roles')
          .update({ role: u.role })
          .eq('user_id', data.user.id);
      }

      results.push({ email: u.email, status: 'created', role: u.role });
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
