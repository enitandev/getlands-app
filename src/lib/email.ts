const fromEmail = 'Getlands <hello@getlands.shop>';

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
        <a href="https://getlands.shop/explore" style="background-color: #008b45; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">
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
  const resetUrl = `https://getlands.shop/reset-password?token=${token}`;

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
  const resetUrl = `https://getlands.shop/reset-password?token=${token}`;

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
        <a href="${resetToken ? `https://getlands.shop/reset-password?token=${resetToken}` : `https://getlands.shop/dashboard/holdings`}" style="background-color: #008b45; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">
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

export async function sendAgentPromotionEmail(email: string, firstName: string) {
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
      <div style="text-align: center; margin: 32px 0;">
        <a href="https://getlands.shop/agent" style="background-color: #008b45; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">
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
          <a href="https://www.getlands.shop/dashboard/wallet" style="background-color: #008b45; color: white; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold;">View Wallet</a>
        </div>
        <p style="font-size: 12px; color: #666; margin-top: 40px;">If you have any questions, please contact support.</p>
      </div>
    </div>
  `;
  await sendResendEmail(to, "Your Getlands Wallet has been credited", html);
}

export async function sendWithdrawalProcessedEmail(to: string, userName: string, amount: number) {
  const html = `
    <div style="font-family: sans-serif; color: #333; max-w: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #008b45; padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0;">Withdrawal Processed</h2>
      </div>
      <div style="padding: 30px;">
        <p>Hello ${userName},</p>
        <p>Good news! Your withdrawal request for <strong>₦${amount.toLocaleString()}</strong> has been successfully processed and sent to your bank account.</p>
        <p>Please note that depending on your bank, it may take a few minutes to reflect in your account.</p>
        <p style="font-size: 12px; color: #666; margin-top: 40px;">Thank you for trusting Getlands!</p>
      </div>
    </div>
  `;
  await sendResendEmail(to, "Your Withdrawal has been Processed", html);
}
