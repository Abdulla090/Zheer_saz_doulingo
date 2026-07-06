const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Helper to load env variables manually from .env file
function loadEnv() {
  const envPath = path.join(__dirname, '../.env');
  if (!fs.existsSync(envPath)) {
    console.error('.env file not found!');
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const parts = line.trim().split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/^"|"$/g, '');
      env[key] = val;
    }
  });
  return env;
}

async function uploadAvatars() {
  const env = loadEnv();
  const supabaseUrl = env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials missing in .env file!');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const avatarsDir = path.join(__dirname, '../assets/images/avatars');
  const filesToUpload = [
    { name: 'avatar_pingo.svg', dbPath: 'premade/avatar_pingo.svg' },
    { name: 'avatar_fox.svg', dbPath: 'premade/avatar_fox.svg' },
    { name: 'avatar_owl.svg', dbPath: 'premade/avatar_owl.svg' },
    { name: 'avatar_dino.svg', dbPath: 'premade/avatar_dino.svg' }
  ];

  console.log('Uploading premade SVG avatars to Supabase storage...');

  for (const item of filesToUpload) {
    const localPath = path.join(avatarsDir, item.name);
    if (!fs.existsSync(localPath)) {
      console.error(`Local file ${localPath} does not exist!`);
      continue;
    }

    const fileContent = fs.readFileSync(localPath, 'utf8');

    console.log(`Uploading ${item.name} to avatars bucket path: ${item.dbPath}...`);
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(item.dbPath, fileContent, {
        contentType: 'image/svg+xml',
        upsert: true
      });

    if (error) {
      console.error(`Failed to upload ${item.name}:`, error.message);
    } else {
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(item.dbPath);
      console.log(`Successfully uploaded ${item.name}! Public URL: ${urlData.publicUrl}`);
    }
  }

  console.log('All uploads complete!');
}

uploadAvatars().catch(err => {
  console.error('Unexpected error:', err);
});
