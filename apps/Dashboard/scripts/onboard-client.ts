import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Always load .env from the scripts/ folder, regardless of cwd
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '.env') });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('\nERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  console.error('Copy scripts/.env.example → scripts/.env and fill in the values.\n');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(question, defaultValue) {
  const hint = defaultValue ? ` [${defaultValue}]` : '';
  return new Promise(resolve =>
    rl.question(`${question}${hint}: `, answer => {
      const trimmed = answer.trim();
      resolve(trimmed || defaultValue || trimmed);
    })
  );
}

async function main() {
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║   Bridgeway — New Client Onboarding  ║');
  console.log('╚══════════════════════════════════════╝\n');

  // ── Collect inputs ──────────────────────────────────────────────────────────
  const name         = await ask('Practice name');
  const slug         = await ask('Slug (e.g. springfield-dental)');
  const primaryColor = await ask('Primary color hex', '#f59e0b');
  const adminName    = await ask('Admin full name');
  const adminEmail   = await ask('Admin email');
  const adminPassword = await ask('Admin password');

  rl.close();

  // Basic validation
  if (!name || !slug || !adminName || !adminEmail || !adminPassword) {
    console.error('\nERROR: All fields are required.\n');
    process.exit(1);
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    console.error('\nERROR: Slug must be lowercase letters, numbers, and hyphens only.\n');
    process.exit(1);
  }

  console.log('\nCreating org...');

  // ── 1. Insert org ───────────────────────────────────────────────────────────
  const { data: org, error: orgError } = await supabase
    .from('orgs')
    .insert({ name, slug, primary_color: primaryColor })
    .select('id, name, slug')
    .single();

  if (orgError) {
    console.error('\nERROR: Failed to create org:', orgError.message, '\n');
    process.exit(1);
  }

  console.log('Creating admin auth user...');

  // ── 2. Create Supabase auth user ────────────────────────────────────────────
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
  });

  if (authError) {
    // Roll back org so we don't leave orphaned rows
    await supabase.from('orgs').delete().eq('id', org.id);
    console.error('\nERROR: Failed to create auth user:', authError.message);
    console.error('Org insert has been rolled back.\n');
    process.exit(1);
  }

  const userId = authData.user.id;
  console.log('Creating profile...');

  // ── 3. Insert profile ───────────────────────────────────────────────────────
  const { error: profileError } = await supabase.from('profiles').insert({
    id:        userId,
    org_id:    org.id,
    role:      'admin',
    full_name: adminName,
    email:     adminEmail,
  });

  if (profileError) {
    console.error('\nERROR: Failed to create profile:', profileError.message);
    console.error('Auth user and org were created — clean these up manually if needed.\n');
    process.exit(1);
  }

  // ── Success summary ─────────────────────────────────────────────────────────
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║      ✓  Client onboarded             ║');
  console.log('╠══════════════════════════════════════╣');
  console.log(`║  Org ID   : ${org.id}`);
  console.log(`║  Org name : ${org.name}`);
  console.log(`║  Slug     : ${org.slug}`);
  console.log(`║  Admin    : ${adminEmail}`);
  console.log('╚══════════════════════════════════════╝\n');
}

main().catch(err => {
  console.error('\nUnexpected error:', err.message, '\n');
  process.exit(1);
});
