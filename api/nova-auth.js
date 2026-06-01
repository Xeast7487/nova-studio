import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

const sb = createClient(
  'https://gnpjilwdehxsafdqdtak.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImducGppbHdkZWh4c2FmZHFkdGFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5Nzk3NjIsImV4cCI6MjA5NTU1NTc2Mn0.iFYR9r5ZZsKcc9n2N8jPtFTLs0QDTIqR3KMCMhCdSdA'
);

function hashPassword(pwd) {
  return createHash('sha256').update(pwd + 'nova-studio-salt').digest('hex');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email et mot de passe requis' });

  const { data: client, error } = await sb
    .from('nova_clients')
    .select('id, name, email, company, phone, password_hash')
    .eq('email', email.toLowerCase().trim())
    .single();

  if (error || !client) return res.status(401).json({ error: 'Identifiants invalides' });

  const hash = hashPassword(password);
  if (hash !== client.password_hash) return res.status(401).json({ error: 'Identifiants invalides' });

  res.setHeader('Cache-Control', 'no-store');
  return res.json({
    id:      client.id,
    name:    client.name,
    email:   client.email,
    company: client.company,
  });
}
