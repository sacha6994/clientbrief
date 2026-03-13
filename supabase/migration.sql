-- ClientBrief — Supabase Migration
-- Exécuter dans le SQL Editor de Supabase

CREATE TABLE IF NOT EXISTS briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  project_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  submission JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour les lookups par token (wizard client)
CREATE INDEX idx_briefs_token ON briefs(token);

-- RLS policies
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;

-- Policy : accès complet pour les utilisateurs authentifiés (dashboard admin)
CREATE POLICY "Admin full access" ON briefs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER briefs_updated_at
  BEFORE UPDATE ON briefs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
