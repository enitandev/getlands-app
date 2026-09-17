with open('src/app/actions/admin.ts', 'r') as f:
    content = f.read()

import re

# We need to add fs, path imports
if "import fs" not in content:
    content = content.replace("import { redirect } from 'next/navigation';", "import { redirect } from 'next/navigation';\nimport fs from 'fs';\nimport path from 'path';")

# Replace coverImage parsing in createOpportunity
create_block = """  const coverImage = formData.get('coverImage') as string;"""
create_upload_block = """  let coverImage = '';
  const file = formData.get('coverImage') as File;
  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/\\s+/g, '-')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, filename), buffer);
    coverImage = `/uploads/${filename}`;
  }"""
content = content.replace(create_block, create_upload_block)

# Replace coverImage parsing in editOpportunity
edit_block = """  const coverImage = formData.get('coverImage') as string;"""
edit_upload_block = """  let coverImage = '';
  const file = formData.get('coverImage') as File;
  if (file && file.size > 0) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name.replace(/\\s+/g, '-')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, filename), buffer);
    coverImage = `/uploads/${filename}`;
  }"""
content = content.replace(edit_block, edit_upload_block)

with open('src/app/actions/admin.ts', 'w') as f:
    f.write(content)
