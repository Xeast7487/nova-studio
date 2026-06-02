-- À exécuter dans Supabase > SQL Editor
-- Crée la table des avis clients

CREATE TABLE nova_reviews (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id   UUID REFERENCES nova_clients(id) ON DELETE CASCADE,
  client_name TEXT    NOT NULL,
  rating      INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment     TEXT    NOT NULL,
  approved    BOOLEAN DEFAULT false,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Désactiver RLS pour que la clé anon puisse lire/insérer
-- (cohérent avec les autres tables du projet)
ALTER TABLE nova_reviews DISABLE ROW LEVEL SECURITY;
