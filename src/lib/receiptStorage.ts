import fs from 'fs';
import path from 'path';

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'heic'];

function getMimeTypeFromExt(ext: string): string {
  switch (ext.toLowerCase()) {
    case 'png':
      return 'image/png';
    case 'pdf':
      return 'application/pdf';
    case 'webp':
      return 'image/webp';
    case 'heic':
      return 'image/heic';
    case 'jpg':
    case 'jpeg':
    default:
      return 'image/jpeg';
  }
}

function getExtFromFile(file: File): string {
  const nameExt = file.name?.split('.').pop()?.toLowerCase()?.replace(/[^a-z0-9]/g, '');
  if (nameExt && ALLOWED_EXTENSIONS.includes(nameExt)) {
    return nameExt;
  }
  const mime = (file.type || '').toLowerCase();
  if (mime.includes('png')) return 'png';
  if (mime.includes('pdf')) return 'pdf';
  if (mime.includes('webp')) return 'webp';
  if (mime.includes('heic')) return 'heic';
  return 'jpg';
}

export async function savePaymentReceipt(reference: string, receiptFile: File | null | undefined): Promise<{
  saved: boolean;
  filename?: string;
  url?: string;
  error?: string;
}> {
  if (!receiptFile || typeof receiptFile.arrayBuffer !== 'function' || receiptFile.size <= 0) {
    return { saved: false, error: 'No receipt file provided' };
  }

  const cleanRef = reference.trim();
  const ext = getExtFromFile(receiptFile);
  const contentType = receiptFile.type || getMimeTypeFromExt(ext);
  const filename = `${cleanRef}.${ext}`;

  const bytes = await receiptFile.arrayBuffer();
  const buffer = Buffer.from(bytes);

  let savedToSupabase = false;
  let savedLocally = false;
  let publicUrl: string | undefined;

  // 1. Primary storage: Supabase Storage (works on Vercel serverless production)
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

      // Remove any older files with different extensions for this reference so there is no ambiguity
      try {
        const { data: existingList } = await supabase.storage
          .from('getlands')
          .list('receipts', { search: cleanRef });
        if (existingList && existingList.length > 0) {
          const toDelete = existingList
            .filter((item: any) => item.name && item.name.startsWith(`${cleanRef}.`) && item.name !== filename)
            .map((item: any) => `receipts/${item.name}`);
          if (toDelete.length > 0) {
            await supabase.storage.from('getlands').remove(toDelete);
          }
        }
      } catch {
        // Ignore cleanup errors
      }

      const { error: uploadErr } = await supabase.storage
        .from('getlands')
        .upload(`receipts/${filename}`, buffer, {
          contentType,
          upsert: true
        });

      if (uploadErr) {
        console.error('[ReceiptStorage] Supabase upload error:', uploadErr);
      } else {
        savedToSupabase = true;
        const { data } = supabase.storage.from('getlands').getPublicUrl(`receipts/${filename}`);
        publicUrl = data?.publicUrl;
      }
    } catch (supaErr) {
      console.error('[ReceiptStorage] Supabase storage exception:', supaErr);
    }
  }

  // 2. Secondary / Local Dev fallback: save to public/uploads/receipts (isolated try/catch so Vercel EROFS never breaks production)
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'receipts');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    // Clean up older extensions for same reference locally
    const existingLocal = fs.readdirSync(uploadDir).filter(f => f.startsWith(`${cleanRef}.`));
    for (const oldFile of existingLocal) {
      if (oldFile !== filename) {
        try {
          fs.unlinkSync(path.join(uploadDir, oldFile));
        } catch {}
      }
    }
    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);
    savedLocally = true;
  } catch {
    // Expected on read-only serverless environments like Vercel
  }

  return {
    saved: savedToSupabase || savedLocally,
    filename,
    url: publicUrl || `/api/receipt/${cleanRef}`
  };
}

export async function resolvePaymentReceipt(reference: string): Promise<{
  exists: boolean;
  filename?: string;
  contentType?: string;
  isPdf?: boolean;
  buffer?: Buffer;
  publicUrl?: string;
}> {
  const cleanRef = decodeURIComponent(reference).trim();
  if (!cleanRef) return { exists: false };

  // 1. Check local filesystem first (fast in dev)
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'receipts');
    if (fs.existsSync(uploadDir)) {
      const files = fs.readdirSync(uploadDir);
      const matched = files.find(f => f.startsWith(`${cleanRef}.`) || f === cleanRef);
      if (matched) {
        const filePath = path.join(uploadDir, matched);
        const fileBuffer = fs.readFileSync(filePath);
        const ext = matched.split('.').pop()?.toLowerCase() || 'jpg';
        const contentType = getMimeTypeFromExt(ext);
        return {
          exists: true,
          filename: matched,
          contentType,
          isPdf: ext === 'pdf',
          buffer: fileBuffer
        };
      }
    }
  } catch {
    // Ignore local FS error
  }

  // 2. Check Supabase Storage by listing `receipts` matching `cleanRef`
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

      const { data: listData, error: listErr } = await supabase.storage
        .from('getlands')
        .list('receipts', { search: cleanRef, limit: 20 });

      if (!listErr && listData && listData.length > 0) {
        const exactMatch = listData.find(
          (item: any) =>
            item.name &&
            (item.name.toLowerCase().startsWith(`${cleanRef.toLowerCase()}.`) ||
              item.name.toLowerCase() === cleanRef.toLowerCase())
        );

        if (exactMatch) {
          const matchedName = exactMatch.name;
          const ext = matchedName.split('.').pop()?.toLowerCase() || 'jpg';
          const contentType = getMimeTypeFromExt(ext);
          const { data } = supabase.storage
            .from('getlands')
            .getPublicUrl(`receipts/${matchedName}`);

          return {
            exists: true,
            filename: matchedName,
            contentType,
            isPdf: ext === 'pdf',
            publicUrl: data?.publicUrl
          };
        }
      }
    } catch (e) {
      console.error('[ReceiptStorage] Supabase list error:', e);
    }
  }

  return { exists: false };
}
