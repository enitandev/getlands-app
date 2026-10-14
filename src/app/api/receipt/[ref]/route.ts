import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ ref: string }> }) {
  const resolvedParams = await params;
  const ref = resolvedParams.ref;

  if (!ref) {
    return new NextResponse('Reference missing', { status: 400 });
  }

  // 1. Check local directory
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'receipts');
  if (fs.existsSync(uploadDir)) {
    const files = fs.readdirSync(uploadDir);
    const matched = files.find(f => f.startsWith(ref));
    if (matched) {
      const filePath = path.join(uploadDir, matched);
      const fileBuffer = fs.readFileSync(filePath);
      const ext = matched.split('.').pop()?.toLowerCase();
      let contentType = 'image/jpeg';
      if (ext === 'png') contentType = 'image/png';
      else if (ext === 'pdf') contentType = 'application/pdf';
      else if (ext === 'webp') contentType = 'image/webp';

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `inline; filename="${matched}"`
        }
      });
    }
  }

  // 2. Check Supabase Storage if configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const { createClient } = require('@supabase/supabase-js');
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
      const { data: { publicUrl } } = supabase.storage.from('getlands').getPublicUrl(`receipts/${ref}.jpg`);
      return NextResponse.redirect(publicUrl);
    } catch (e) {
      console.error(e);
    }
  }

  return new NextResponse('Receipt not found', { status: 404 });
}
