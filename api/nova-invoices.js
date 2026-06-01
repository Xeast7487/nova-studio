import { createClient } from '@supabase/supabase-js';

const sb = createClient(
  'https://gnpjilwdehxsafdqdtak.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImducGppbHdkZWh4c2FmZHFkdGFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5Nzk3NjIsImV4cCI6MjA5NTU1NTc2Mn0.iFYR9r5ZZsKcc9n2N8jPtFTLs0QDTIqR3KMCMhCdSdA'
);

export default async function handler(req, res) {
  const { client_id } = req.query;
  if (!client_id) return res.status(400).json({ error: 'client_id requis' });

  const { data, error } = await sb
    .from('nova_invoices')
    .select('*')
    .eq('client_id', client_id)
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  res.setHeader('Cache-Control', 'no-store');
  return res.json({ invoices: data || [] });
}
