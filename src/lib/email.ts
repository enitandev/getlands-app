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

export async function sendNewInvestmentEmail(email: string, firstName: string, opportunityName: string, units: number) {
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
        <a href="https://getlands.shop/dashboard/holdings" style="background-color: #008b45; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px;">
          View Your Portfolio
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
