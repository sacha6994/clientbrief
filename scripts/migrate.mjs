/**
 * Migration script — adds new columns to the briefs table.
 * Run with: node scripts/migrate.mjs
 *
 * Uses the Supabase Management API to execute SQL.
 */

import { config } from "dotenv";
config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Extract project ref from URL
const projectRef = SUPABASE_URL?.replace("https://", "").replace(".supabase.co", "");

const SQL = `
-- Add new columns
ALTER TABLE briefs ADD COLUMN IF NOT EXISTS current_step TEXT DEFAULT 'welcome';
ALTER TABLE briefs ADD COLUMN IF NOT EXISTS draft_submission JSONB;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_briefs_status ON briefs(status);
CREATE INDEX IF NOT EXISTS idx_briefs_created_at ON briefs(created_at DESC);

-- Storage policy: allow public read on brief-uploads
INSERT INTO storage.objects (bucket_id, name, owner)
SELECT 'brief-uploads', '.keep', NULL
WHERE NOT EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'brief-uploads' AND name = '.keep');
`;

async function runMigration() {
  console.log("🔄 Running migration...");
  console.log(`   Project: ${projectRef}`);

  // Method 1: Try via pg_net or direct REST
  // Since Supabase REST doesn't support DDL, we'll use a workaround:
  // Create a temporary function, execute it, then drop it

  const createFnSQL = `
    CREATE OR REPLACE FUNCTION _temp_migrate() RETURNS void AS $$
    BEGIN
      -- Add columns if they don't exist
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'briefs' AND column_name = 'current_step'
      ) THEN
        ALTER TABLE briefs ADD COLUMN current_step TEXT DEFAULT 'welcome';
      END IF;

      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'briefs' AND column_name = 'draft_submission'
      ) THEN
        ALTER TABLE briefs ADD COLUMN draft_submission JSONB;
      END IF;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `;

  // We can't run raw SQL via REST API.
  // Print instructions for the user instead.
  console.log("");
  console.log("⚠️  Supabase REST API doesn't support DDL commands.");
  console.log("   Please run this SQL in your Supabase Dashboard > SQL Editor:");
  console.log("");
  console.log("─".repeat(60));
  console.log(`
ALTER TABLE briefs ADD COLUMN IF NOT EXISTS current_step TEXT DEFAULT 'welcome';
ALTER TABLE briefs ADD COLUMN IF NOT EXISTS draft_submission JSONB;
CREATE INDEX IF NOT EXISTS idx_briefs_status ON briefs(status);
CREATE INDEX IF NOT EXISTS idx_briefs_created_at ON briefs(created_at DESC);
  `.trim());
  console.log("─".repeat(60));
  console.log("");

  // Verify bucket exists
  console.log("🪣 Verifying storage bucket...");
  const bucketRes = await fetch(`${SUPABASE_URL}/storage/v1/bucket/brief-uploads`, {
    headers: {
      "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
    },
  });

  if (bucketRes.ok) {
    const bucket = await bucketRes.json();
    console.log(`   ✅ Bucket "brief-uploads" exists (public: ${bucket.public})`);
  } else {
    console.log("   ❌ Bucket not found");
  }

  // Create storage policy for public access
  console.log("📦 Setting up storage policies...");
  const policySQL = `
-- Allow public read access to brief-uploads
CREATE POLICY IF NOT EXISTS "Public read brief-uploads" ON storage.objects
  FOR SELECT USING (bucket_id = 'brief-uploads');

-- Allow authenticated uploads to brief-uploads
CREATE POLICY IF NOT EXISTS "Service upload brief-uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'brief-uploads');
  `;

  console.log("   Add these storage policies in SQL Editor too:");
  console.log("");
  console.log(policySQL.trim());
  console.log("");
  console.log("✅ Migration script complete. Run the SQL above in Supabase Dashboard.");
}

runMigration().catch(console.error);
