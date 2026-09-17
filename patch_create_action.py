with open('src/app/actions/admin.ts', 'r') as f:
    content = f.read()

import re

# We need to replace the data object creation inside createOpportunity
old_block = """  const data: any = {
    title,
    slug,
    category,
    location,
    state,
    status,
    coverImage: (formData.get('coverImage') as string) || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  };"""

new_block = """  let coverImage = 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
  const file = formData.get('coverImage') as File;
  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/\\s+/g, '-')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, filename), buffer);
    coverImage = `/uploads/${filename}`;
  }

  const data: any = {
    title,
    slug,
    category,
    location,
    state,
    status,
    coverImage,
  };"""

content = content.replace(old_block, new_block)

with open('src/app/actions/admin.ts', 'w') as f:
    f.write(content)
