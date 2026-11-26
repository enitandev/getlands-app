import { NextResponse } from 'next/server';
import { resolvePaymentReceipt } from '@/lib/receiptStorage';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ ref: string }> }) {
  const resolvedParams = await params;
  const ref = resolvedParams.ref;
  const url = new URL(req.url);
  const isCheck = url.searchParams.get('check') === '1';

  if (!ref) {
    if (isCheck) {
      return NextResponse.json({ exists: false, error: 'Reference missing' });
    }
    return new NextResponse('Reference missing', { status: 400 });
  }

  const resolved = await resolvePaymentReceipt(ref);

  if (isCheck) {
    return NextResponse.json({
      exists: resolved.exists,
      filename: resolved.filename || null,
      contentType: resolved.contentType || null,
      isPdf: Boolean(resolved.isPdf),
      url: resolved.exists ? (resolved.publicUrl || `/api/receipt/${encodeURIComponent(ref)}`) : null
    });
  }

  if (resolved.exists) {
    if (resolved.buffer) {
      return new NextResponse(new Uint8Array(resolved.buffer), {
        headers: {
          'Content-Type': resolved.contentType || 'image/jpeg',
          'Content-Disposition': `inline; filename="${resolved.filename || ref}"`,
          'Cache-Control': 'no-store, max-age=0'
        }
      });
    }

    if (resolved.publicUrl) {
      return NextResponse.redirect(`${resolved.publicUrl}?t=${Date.now()}`);
    }
  }

  const notFoundHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Receipt Not Uploaded (${ref})</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f7f9f7; color: #18201c; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
          .card { background: white; border: 1px solid #e5eae6; border-radius: 20px; padding: 36px; max-width: 440px; text-align: center; box-shadow: 0 8px 30px rgba(0,0,0,0.04); }
          .badge { display: inline-block; background: #fffbeb; color: #b45309; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 5px 12px; border-radius: 99px; margin-bottom: 14px; }
          h1 { font-size: 20px; margin: 0 0 10px 0; }
          p { font-size: 14px; color: #68736d; line-height: 1.55; margin: 0 0 20px 0; }
          code { font-family: monospace; background: #f4f7f5; padding: 3px 8px; border-radius: 6px; color: #008b45; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">No Receipt File Found</span>
          <h1>No Proof of Payment Uploaded Yet</h1>
          <p>No receipt image or PDF was found in storage for transaction reference <code>${ref}</code>.</p>
          <p style="font-size: 12px; margin-bottom: 0;">You can upload a receipt directly from the Admin Review modal or ask the customer to attach their proof of payment from their Wallet / Holdings page.</p>
        </div>
      </body>
    </html>
  `;

  return new NextResponse(notFoundHtml, {
    status: 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
