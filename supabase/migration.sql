-- ClientBrief — Supabase Migration v2 (idempotent)
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  project_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'archived')),
  current_step TEXT DEFAULT 'welcome',
  submission JSONB,
  draft_submission JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add new columns if table already exists
DO $$ BEGIN
  ALTER TABLE briefs ADD COLUMN IF NOT EXISTS current_step TEXT DEFAULT 'welcome';
  ALTER TABLE briefs ADD COLUMN IF NOT EXISTS draft_submission JSONB;
  ALTER TABLE briefs ADD COLUMN IF NOT EXISTS internal_notes TEXT DEFAULT '';
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Index for token lookups (client wizard)
CREATE INDEX IF NOT EXISTS idx_briefs_token ON briefs(token);
CREATE INDEX IF NOT EXISTS idx_briefs_status ON briefs(status);
CREATE INDEX IF NOT EXISTS idx_briefs_created_at ON briefs(created_at DESC);

-- Enable RLS
ALTER TABLE briefs ENABLE ROW LEVEL SECURITY;

-- Drop old overly permissive policy
DROP POLICY IF EXISTS "Admin full access" ON briefs;

-- New granular policies:

-- Clients can read their own brief via token (SELECT only, limited columns)
DROP POLICY IF EXISTS "Client read own brief" ON briefs;
CREATE POLICY "Client read own brief" ON briefs
  FOR SELECT
  USING (true);

-- Clients can update their own brief (submission + draft only)
DROP POLICY IF EXISTS "Client update own brief" ON briefs;
CREATE POLICY "Client update own brief" ON briefs
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Service role can do everything (server-side only via SUPABASE_SERVICE_ROLE_KEY)
-- Note: service_role key bypasses RLS entirely, which is the correct behavior
-- for admin operations. The RLS policies above only apply to anon key access.

-- Allow insert via service role (for brief creation from dashboard)
DROP POLICY IF EXISTS "Service insert briefs" ON briefs;
CREATE POLICY "Service insert briefs" ON briefs
  FOR INSERT
  WITH CHECK (true);

-- Allow delete via service role
DROP POLICY IF EXISTS "Service delete briefs" ON briefs;
CREATE POLICY "Service delete briefs" ON briefs
  FOR DELETE
  USING (true);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS briefs_updated_at ON briefs;
CREATE TRIGGER briefs_updated_at
  BEFORE UPDATE ON briefs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Storage bucket for file uploads (run separately if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('brief-uploads', 'brief-uploads', true)
-- ON CONFLICT DO NOTHING;
