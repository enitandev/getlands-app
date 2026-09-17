with open('src/app/actions/admin.ts', 'r') as f:
    content = f.read()

import re

# Block to replace for BOTH createOpportunity and editOpportunity
old_block = """    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/\\s+/g, '-')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, filename), buffer);
    coverImage = `/uploads/${filename}`;"""

new_block = """    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/\\s+/g, '-')}`;
    
    // Initialize Supabase Client
    const { createClient } = require('@supabase/supabase-js');
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase credentials in .env");
    }
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Upload to Supabase Storage
    const { data: uploadData, error } = await supabase.storage
      .from('getlands')
      .upload(`covers/${filename}`, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (error) {
      console.error("Supabase Storage Error:", error);
      throw new Error("Failed to upload image to Supabase. Check bucket settings.");
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('getlands')
      .getPublicUrl(`covers/${filename}`);

    coverImage = publicUrl;"""

content = content.replace(old_block, new_block)

with open('src/app/actions/admin.ts', 'w') as f:
    f.write(content)
