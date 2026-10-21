const fromEmail = 'Getlands <hello@getlands.ng>';

async function sendResendEmail(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("Missing RESEND_API_KEY, skipping email.");
    return;
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Resend API Error:", res.status, errorText);
    }
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

export async function sendWelcomeEmail(email: string, firstName: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-w-xl mx-auto p-6 bg-white border border-gray-200 rounded-xl">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #008b45; font-size: 28px; margin: 0;">Welcome to Getlands</h1>
      </div>
      <p style="color: #333; font-size: 16px;">Hello ${firstName},</p>
      <p style="color: #333; font-size: 16px; line-height: 1.5;">
        We are thrilled to welcome you to Getlands! You've taken the first step towards building a premium, secure real-asset portfolio.
      </p>
      <p style="color: #333; font-size: 16px; line-height: 1.5;">
        As a verified member, you now have exclusive access to our marketplace of verified lands, high-yield farm cycles, and structured land banking opportunities.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="https://getlands.ng/explore" style="background-color: #008b45; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">
          Explore the Marketplace
        </a>
      </div>
      <p style="color: #666; font-size: 14px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
        If you have any questions, simply reply to this email or contact your dedicated account manager.<br><br>
        Best regards,<br>
        <strong>The Getlands Team</strong>
      </p>
    </div>
  `;

  await sendResendEmail(email, 'Welcome to Getlands!', html);
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `https://getlands.ng/reset-password?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-w-xl mx-auto p-6 bg-white border border-gray-200 rounded-xl">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #008b45; font-size: 24px; margin: 0;">Reset Your Password</h1>
      </div>
      <p style="color: #333; font-size: 16px;">Hello,</p>
      <p style="color: #333; font-size: 16px; line-height: 1.5;">
        We received a request to reset the password for your Getlands account. If you didn't make this request, you can safely ignore this email.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetUrl}" style="background-color: #008b45; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">
          Reset Password
        </a>
      </div>
      <p style="color: #666; font-size: 14px;">
        Or copy and paste this link into your browser:<br>
        <a href="${resetUrl}" style="color: #008b45; word-break: break-all;">${resetUrl}</a>
      </p>
      <p style="color: #666; font-size: 14px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
        This link will expire in 1 hour.<br><br>
        <strong>The Getlands Team</strong>
      </p>
    </div>
  `;

  await sendResendEmail(email, 'Reset your Getlands Password', html);
}

export async function sendClaimAccountEmail(email: string, firstName: string, token: string) {
  const resetUrl = `https://getlands.ng/reset-password?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-w-xl mx-auto p-6 bg-white border border-gray-200 rounded-xl">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #008b45; font-size: 28px; margin: 0;">Welcome to Getlands</h1>
      </div>
      <p style="color: #333; font-size: 16px;">Hello ${firstName},</p>
      <p style="color: #333; font-size: 16px; line-height: 1.5;">
        Your Getlands investment account has been successfully created by our operations team.
      </p>
      <p style="color: #333; font-size: 16px; line-height: 1.5;">
        Please click the button below to securely set your password and access your dashboard. Once logged in, you will be able to view your portfolio and download your official investment documents.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetUrl}" style="background-color: #008b45; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">
          Set Password & Claim Account
        </a>
      </div>
      <p style="color: #666; font-size: 14px;">
        Or copy and paste this link into your browser:<br>
        <a href="${resetUrl}" style="color: #008b45; word-break: break-all;">${resetUrl}</a>
      </p>
      <p style="color: #666; font-size: 14px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
        This link will expire in 1 hour.<br><br>
        <strong>The Getlands Team</strong>
      </p>
    </div>
  `;

  await sendResendEmail(email, 'Claim your Getlands Account', html);
}

export async function sendNewInvestmentEmail(email: string, firstName: string, opportunityName: string, units: number, resetToken?: string | null) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-w-xl mx-auto p-6 bg-white border border-gray-200 rounded-xl">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #008b45; font-size: 24px; margin: 0;">New Investment Assigned</h1>
      </div>
      <p style="color: #333; font-size: 16px;">Hello ${firstName},</p>
      <p style="color: #333; font-size: 16px; line-height: 1.5;">
        A new holding of <strong>${units} unit(s)</strong> in <strong>${opportunityName}</strong> has been successfully assigned to your portfolio.
      </p>
      <p style="color: #333; font-size: 16px; line-height: 1.5;">
        Your official Allocation Letter, Subscription Agreement, and Payment Receipt have been generated and are now available for download.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetToken ? `https://getlands.ng/reset-password?token=${resetToken}` : `https://getlands.ng/dashboard/holdings`}" style="background-color: #008b45; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">
          ${resetToken ? "Set Password & View Portfolio" : "View Your Portfolio"}
        </a>
      </div>
      <p style="color: #666; font-size: 14px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
        If you have any questions, please contact your account manager.<br><br>
        <strong>The Getlands Team</strong>
      </p>
    </div>
  `;

  await sendResendEmail(email, 'New Getlands Investment Assigned', html);
}

export async function sendAgentPromotionEmail(email: string, firstName: string, referralCode?: string) {
  const refLink = referralCode ? `https://getlands.ng?ref=${referralCode}` : null;
  const html = `
    <div style="font-family: Arial, sans-serif; max-w-xl mx-auto p-6 bg-white border border-gray-200 rounded-xl">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #008b45; font-size: 24px; margin: 0;">You are now a Getlands Sales Agent!</h1>
      </div>
      <p style="color: #333; font-size: 16px;">Hello ${firstName},</p>
      <p style="color: #333; font-size: 16px; line-height: 1.5;">
        Congratulations! Your account has been upgraded to a <strong>Getlands Sales Agent</strong>.
      </p>
      <p style="color: #333; font-size: 16px; line-height: 1.5;">
        You now have exclusive access to the Agent Portal, where you can find your unique referral links, build your network, draft offline portfolios for your clients, and earn commissions on every successful acquisition.
      </p>
      ${refLink ? `
      <div style="background-color: #f7f9f7; border: 1px solid #e2e8e5; border-radius: 12px; padding: 16px 20px; margin: 24px 0; text-align: center;">
        <p style="color: #68736d; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 6px 0;">Your Official Referral Link</p>
        <a href="${refLink}" style="color: #008b45; font-size: 15px; font-weight: bold; text-decoration: underline; word-break: break-all;">${refLink}</a>
        <p style="color: #7a847f; font-size: 12px; margin: 8px 0 0 0;">Referral Code: <strong>${referralCode}</strong></p>
      </div>
      ` : ''}
      <div style="text-align: center; margin: 32px 0;">
        <a href="https://getlands.ng/agent" style="background-color: #008b45; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">
          Access Agent Portal
        </a>
      </div>
      <p style="color: #666; font-size: 14px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
        Log in to your account and navigate to the Agent Portal to review and sign your Agent Agreement and get started.<br><br>
        <strong>The Getlands Team</strong>
      </p>
    </div>
  `;

  await sendResendEmail(email, 'Welcome to the Getlands Agent Network', html);
}

export async function sendWalletCreditEmail(to: string, userName: string, amount: number, title: string) {
  const html = `
    <div style="font-family: sans-serif; color: #333; max-w: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #008b45; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0;">Wallet Credited!</h2>
      </div>
      <div style="padding: 30px;">
        <p>Hello ${userName},</p>
        <p>Your Getlands Wallet has just been credited with <strong>₦${amount.toLocaleString()}</strong> for your <strong>${title}</strong> return.</p>
        <p>You can keep these funds in your wallet for future acquisitions or withdraw them directly to your verified bank account at any time.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://getlands.ng/dashboard/wallet" style="background-color: #008b45; color: white; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold;">View Wallet</a>
        </div>
        <p style="font-size: 12px; color: #666; margin-top: 40px;">If you have any questions, please contact support.</p>
      </div>
    </div>
  `;
  await sendResendEmail(to, "Your Getlands Wallet has been credited", html);
}

export async function sendWithdrawalProcessedEmail(to: string, userName: string, amount: number, netAmount?: number, fee?: number) {
  const finalNet = netAmount ?? (amount - (fee ?? 0));
  const feeBlock = fee && fee > 0
    ? `
      <div style="background-color: #f7f9f7; border: 1px solid #eef3ef; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 14px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #68736d;">Requested Amount:</span>
          <strong>₦${amount.toLocaleString()}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span style="color: #68736d;">Settlement Fee:</span>
          <span style="color: #c53030;">-₦${fee.toLocaleString()}</span>
        </div>
        <div style="border-top: 1px solid #e0e0e0; padding-top: 8px; display: flex; justify-content: space-between;">
          <strong style="color: #182a20;">Net Transferred to Bank:</strong>
          <strong style="color: #008b45; font-size: 16px;">₦${finalNet.toLocaleString()}</strong>
        </div>
      </div>
    `
    : `<p>Your withdrawal request for <strong>₦${amount.toLocaleString()}</strong> has been successfully processed and sent to your bank account.</p>`;

  const html = `
    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #008b45; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0;">Withdrawal Processed</h2>
      </div>
      <div style="padding: 30px;">
        <p>Hello ${userName},</p>
        <p>Good news! Your withdrawal request has been approved and processed.</p>
        ${feeBlock}
        <p>Please note that depending on your bank's network processing, your credit alert will reflect in your account shortly.</p>
        <p style="font-size: 12px; color: #666; margin-top: 40px;">Thank you for trusting Getlands!</p>
      </div>
    </div>
  `;
  await sendResendEmail(to, "Your Withdrawal has been Processed", html);
}

export async function sendDirectBankPayoutEmail(to: string, userName: string, amount: number, title: string, bankName?: string, accountNumber?: string) {
  const html = `
    <div style="font-family: sans-serif; color: #333; max-w: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #008b45; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0;">Payout Transferred to Bank</h2>
      </div>
      <div style="padding: 30px;">
        <p>Hello ${userName},</p>
        <p>Your investment return of <strong>₦${amount.toLocaleString()}</strong> for <strong>${title}</strong> has been transferred directly to your bank account${bankName && accountNumber ? ` (${bankName} - ${accountNumber})` : ''}.</p>
        <p>Depending on your bank's network processing, your credit alert will reflect shortly.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://getlands.ng/dashboard/holdings" style="background-color: #008b45; color: white; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold;">View Holdings</a>
        </div>
        <p style="font-size: 12px; color: #666; margin-top: 40px;">Thank you for investing with Getlands.</p>
      </div>
    </div>
  `;
  await sendResendEmail(to, "Your Getlands Investment Payout has been Sent", html);
}

export async function sendWalletReconciliationEmail(to: string, userName: string, amount: number, reason: string) {
  const html = `
    <div style="font-family: sans-serif; color: #333; max-w: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #182a20; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0;">Wallet Adjustment Notice</h2>
      </div>
      <div style="padding: 30px;">
        <p>Hello ${userName},</p>
        <p>Your Getlands Wallet balance has been adjusted by <strong>-₦${amount.toLocaleString()}</strong>.</p>
        <p style="color: #666; font-size: 14px;">Reason: <em>${reason}</em></p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://getlands.ng/dashboard/wallet" style="background-color: #008b45; color: white; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold;">View Wallet History</a>
        </div>
        <p style="font-size: 12px; color: #666; margin-top: 40px;">If you have any questions regarding this adjustment, please contact support.</p>
      </div>
    </div>
  `;
  await sendResendEmail(to, "Getlands Wallet Adjustment Notice", html);
}

export interface AnnouncementEmailOptions {
  recipients: { email: string; firstName?: string | null }[];
  title: string;
  message: string;
  type: string;
  actionText?: string | null;
  actionUrl?: string | null;
}

export async function sendAnnouncementEmailBatch({
  recipients,
  title,
  message,
  type,
  actionText,
  actionUrl,
}: AnnouncementEmailOptions): Promise<{ sent: number; total: number; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("Missing RESEND_API_KEY, skipping announcement emails.");
    return { sent: 0, total: recipients.length, error: "Missing RESEND_API_KEY" };
  }

  // Deduplicate and sanitize recipients
  const seenEmails = new Set<string>();
  const validRecipients: { email: string; firstName?: string | null }[] = [];

  for (const r of recipients) {
    const cleanEmail = (r.email || '').trim().toLowerCase();
    if (cleanEmail && cleanEmail.includes('@') && !seenEmails.has(cleanEmail)) {
      seenEmails.add(cleanEmail);
      validRecipients.push({ email: cleanEmail, firstName: r.firstName });
    }
  }

  if (validRecipients.length === 0) {
    return { sent: 0, total: 0 };
  }

  // Determine badge styling based on announcement type
  let badgeText = 'PLATFORM UPDATE';
  let badgeBg = '#182a20';
  let subjectPrefix = '[Getlands] ';

  if (type === 'promo') {
    badgeText = 'EXCLUSIVE OFFER';
    badgeBg = '#008b45';
    subjectPrefix = '[Getlands Promo] ';
  } else if (type === 'warning') {
    badgeText = 'IMPORTANT NOTICE';
    badgeBg = '#d97706';
    subjectPrefix = '[Notice] ';
  } else if (type === 'critical') {
    badgeText = 'URGENT ADVISORY';
    badgeBg = '#dc2626';
    subjectPrefix = '[URGENT] ';
  }

  const subject = `${subjectPrefix}${title}`;

  // Format paragraphs safely
  const paragraphs = message
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(Boolean);

  const formattedMessage = paragraphs
    .map(p => `<p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.65; color: #374151;">${p.replace(/\n/g, '<br/>')}</p>`)
    .join('');

  // Determine button URL
  let targetUrl = 'https://getlands.ng/dashboard';
  if (actionUrl) {
    targetUrl = actionUrl.startsWith('/') ? `https://getlands.ng${actionUrl}` : actionUrl;
  }
  const buttonLabel = actionText || 'Open Portal';

  const actionButtonHtml = `
    <div style="margin: 32px 0 16px 0;">
      <a href="${targetUrl}" style="display: inline-block; background-color: #008b45; color: #ffffff; padding: 14px 32px; border-radius: 50px; font-weight: 700; font-size: 14px; text-decoration: none; letter-spacing: 0.02em;">
        ${buttonLabel} &rarr;
      </a>
    </div>
  `;

  // Build individualized email payloads
  const emailPayloads = validRecipients.map(r => {
    const greeting = r.firstName ? `Hello ${r.firstName},` : 'Hello,';
    const html = `
      <div style="background-color: #f7f9f7; padding: 36px 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #18201c;">
        <div style="max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5eae6; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);">
          
          <!-- Header -->
          <div style="background-color: #182a20; padding: 24px 32px; border-bottom: 3px solid #008b45;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td>
                  <span style="font-size: 18px; font-weight: 800; letter-spacing: 0.1em; color: #ffffff; text-transform: uppercase;">GETLANDS</span>
                </td>
                <td align="right">
                  <span style="display: inline-block; padding: 5px 12px; border-radius: 20px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background-color: ${badgeBg}; color: #ffffff;">
                    ${badgeText}
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <!-- Content -->
          <div style="padding: 36px 32px 28px 32px;">
            <p style="margin: 0 0 16px 0; font-size: 15px; color: #68736d; font-weight: 500;">
              ${greeting}
            </p>
            
            <h1 style="margin: 0 0 20px 0; font-size: 22px; font-weight: 800; color: #182a20; line-height: 1.35;">
              ${title}
            </h1>

            <div style="margin-bottom: 24px;">
              ${formattedMessage}
            </div>

            ${actionButtonHtml}
          </div>

          <!-- Footer -->
          <div style="padding: 24px 32px; background-color: #fafcfb; border-top: 1px solid #eef3ef; font-size: 12px; line-height: 1.5; color: #7a847f;">
            <p style="margin: 0 0 6px 0;">
              You are receiving this official communication as a registered member of Getlands.
            </p>
            <p style="margin: 0;">
              &copy; ${new Date().getFullYear()} Getlands. All rights reserved. &middot; <a href="https://getlands.ng" style="color: #008b45; text-decoration: none; font-weight: 600;">getlands.ng</a>
            </p>
          </div>

        </div>
      </div>
    `;

    return {
      from: fromEmail,
      to: r.email,
      subject,
      html,
    };
  });

  // Batch dispatching in chunks of up to 100
  let totalSent = 0;
  const BATCH_SIZE = 100;

  for (let i = 0; i < emailPayloads.length; i += BATCH_SIZE) {
    const chunk = emailPayloads.slice(i, i + BATCH_SIZE);
    try {
      const res = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify(chunk),
      });

      if (res.ok) {
        totalSent += chunk.length;
      } else {
        // Fallback to individual dispatch for this chunk
        console.warn(`Batch email API responded with ${res.status}. Falling back to individual dispatch.`);
        for (const item of chunk) {
          try {
            await sendResendEmail(item.to, item.subject, item.html);
            totalSent++;
          } catch (err) {
            console.error(`Failed to send fallback email to ${item.to}:`, err);
          }
        }
      }
    } catch (chunkErr) {
      console.error("Error dispatching email chunk:", chunkErr);
      // Fallback
      for (const item of chunk) {
        try {
          await sendResendEmail(item.to, item.subject, item.html);
          totalSent++;
        } catch {}
      }
    }
  }

  return { sent: totalSent, total: validRecipients.length };
}
