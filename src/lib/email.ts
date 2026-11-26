const fromEmail = 'Getlands <hello@getlands.ng>';

export async function sendResendEmail(to: string, subject: string, html: string) {
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

export async function sendNewInvestmentEmail(
  email: string,
  firstName: string,
  opportunityName: string,
  units: number,
  resetToken?: string | null,
  options?: {
    category?: string;
    paymentStatus?: string;
    holdingId?: string;
  }
) {
  const category = options?.category;
  const isInstallment = options?.paymentStatus === 'installment';
  const holdingLink = options?.holdingId
    ? `https://getlands.ng/dashboard/holdings/${options.holdingId}`
    : 'https://getlands.ng/dashboard/holdings';
  const destinationUrl = resetToken
    ? `https://getlands.ng/reset-password?token=${resetToken}`
    : holdingLink;
  const buttonText = resetToken
    ? 'Set Password & View Portfolio'
    : 'View & Download Documents';

  let subject = 'New Getlands Investment Assigned';
  let heading = 'New Investment Assigned';
  let bodyContent = '';

  if (category === 'land') {
    if (isInstallment) {
      subject = 'Land Allocation Confirmed: Contract of Sale & Allocation Issued';
      heading = 'Land Allocation Confirmed';
      bodyContent = `
        <p style="color: #333; font-size: 16px; line-height: 1.5;">
          Congratulations! Your deposit for <strong>${units} plot(s)</strong> in <strong>${opportunityName}</strong> has been confirmed under an installment plan.
        </p>
        <p style="color: #333; font-size: 16px; line-height: 1.5;">
          Your official <strong>Land Allocation Certificate</strong>, <strong>Contract of Sale & Allocation Terms</strong> (with Condition Precedent), and <strong>Deposit Receipt</strong> have been issued and are now available for download in your dashboard.
        </p>
        <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px 18px; margin: 20px 0;">
          <p style="color: #92400e; font-size: 14px; line-height: 1.5; margin: 0;">
            <strong>Condition Precedent Notice:</strong> Your official 6-page Deed of Assignment (prepared by The Bridge Chambers, complete with official Chambers crest and NBA Practicing Seal) is secured and will be unlocked automatically upon 100% full liquidation of your contract balance.
          </p>
        </div>
      `;
    } else {
      subject = 'Land Acquisition Confirmed: Official Deed of Assignment & Allocation Issued';
      heading = 'Land Acquisition Confirmed';
      bodyContent = `
        <p style="color: #333; font-size: 16px; line-height: 1.5;">
          Congratulations! Your acquisition of <strong>${units} plot(s)</strong> in <strong>${opportunityName}</strong> has been confirmed in full.
        </p>
        <p style="color: #333; font-size: 16px; line-height: 1.5;">
          Your complete legal conveyancing documentation has been generated and is ready for download:
        </p>
        <ul style="color: #333; font-size: 15px; line-height: 1.6; padding-left: 20px;">
          <li><strong>Official 6-Page Deed of Assignment:</strong> Prepared by Chief Wakeel Olawale Liady of The Bridge Chambers, legal counsel to Getlands Properties Co., complete with Chambers crest, NBA Practicing Seal (SCN053202), and registered Assignor execution.</li>
          <li><strong>Official Land Allocation Certificate:</strong> High-resolution certificate documenting your assigned parcel ownership.</li>
          <li><strong>Official Payment Receipt:</strong> Complete financial breakdown and transaction verification.</li>
        </ul>
      `;
    }
  } else if (category === 'farm') {
    subject = 'Commodity Subscription Confirmed: Allocation Certificate Issued';
    heading = 'Commodity Subscription Confirmed';
    bodyContent = `
      <p style="color: #333; font-size: 16px; line-height: 1.5;">
        Your subscription of <strong>${units} unit(s)</strong> in <strong>${opportunityName}</strong> has been successfully confirmed and activated.
      </p>
      <p style="color: #333; font-size: 16px; line-height: 1.5;">
        Your official <strong>Commodity Cycle Subscription Agreement</strong>, <strong>Commodity Allocation Certificate</strong>, and <strong>Payment Receipt</strong> have been generated and are now available for download in your dashboard.
      </p>
    `;
  } else if (category === 'land_banking') {
    subject = 'Land Banking Investment Confirmed: Buyback Guarantee Issued';
    heading = 'Land Banking Investment Confirmed';
    bodyContent = `
      <p style="color: #333; font-size: 16px; line-height: 1.5;">
        Your investment of <strong>${units} unit(s)</strong> in <strong>${opportunityName}</strong> has been successfully confirmed and activated.
      </p>
      <p style="color: #333; font-size: 16px; line-height: 1.5;">
        Your official <strong>Land Banking Investment & Buyback Guarantee</strong>, <strong>Allocation Certificate</strong>, and <strong>Payment Receipt</strong> have been generated and are now available for download in your dashboard.
      </p>
    `;
  } else {
    bodyContent = `
      <p style="color: #333; font-size: 16px; line-height: 1.5;">
        A new holding of <strong>${units} unit(s)</strong> in <strong>${opportunityName}</strong> has been successfully assigned to your portfolio.
      </p>
      <p style="color: #333; font-size: 16px; line-height: 1.5;">
        Your official Allocation Letter, Subscription Agreement, and Payment Receipt have been generated and are now available for download.
      </p>
    `;
  }

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #008b45; font-size: 24px; margin: 0;">${heading}</h1>
      </div>
      <p style="color: #333; font-size: 16px;">Hello ${firstName},</p>
      ${bodyContent}
      <div style="text-align: center; margin: 32px 0;">
        <a href="${destinationUrl}" style="background-color: #008b45; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block;">
          ${buttonText}
        </a>
      </div>
      <p style="color: #666; font-size: 14px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
        If you have any questions, please contact your account manager.<br><br>
        <strong>The Getlands Team</strong>
      </p>
    </div>
  `;

  await sendResendEmail(email, subject, html);
}

export async function sendDeedUnlockedEmail(
  email: string,
  firstName: string,
  opportunityName: string,
  holdingId?: string
) {
  const holdingLink = holdingId
    ? `https://getlands.ng/dashboard/holdings/${holdingId}`
    : 'https://getlands.ng/dashboard/holdings';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #008b45; font-size: 24px; margin: 0;">Deed of Assignment Unlocked!</h1>
      </div>
      <p style="color: #333; font-size: 16px;">Hello ${firstName},</p>
      <p style="color: #333; font-size: 16px; line-height: 1.5;">
        Congratulations! Your land acquisition for <strong>${opportunityName}</strong> is now <strong>100% liquidated</strong>.
      </p>
      <p style="color: #333; font-size: 16px; line-height: 1.5;">
        With the Condition Precedent satisfied in full, your official <strong>6-page Deed of Assignment</strong> prepared by Chief Wakeel Olawale Liady of The Bridge Chambers (complete with official Chambers crest, high-resolution NBA Practicing Seal SCN053202, and Assignor execution) has been unlocked and is ready for immediate download.
      </p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${holdingLink}" style="background-color: #008b45; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block;">
          Download Your Deed of Assignment
        </a>
      </div>
      <p style="color: #666; font-size: 14px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
        If you have any questions, please contact your account manager.<br><br>
        <strong>The Getlands Team</strong>
      </p>
    </div>
  `;

  await sendResendEmail(email, 'Deed of Assignment Unlocked: 100% Liquidation Complete', html);
}

export async function sendInstallmentReminderEmail(
  email: string,
  firstName: string,
  opportunityName: string,
  amountPaid: number,
  totalContractPrice: number,
  balanceDue: number,
  holdingId: string
) {
  const percentSettled = totalContractPrice > 0
    ? Math.round((amountPaid / totalContractPrice) * 100)
    : 0;

  const holdingLink = `https://getlands.ng/dashboard/holdings/${holdingId}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #008b45; font-size: 24px; margin: 0;">Land Installment Milestone Reminder</h1>
      </div>
      <p style="color: #333; font-size: 16px;">Hello ${firstName},</p>
      <p style="color: #333; font-size: 16px; line-height: 1.5;">
        This is a friendly milestone update regarding your land acquisition for <strong>${opportunityName}</strong> under your active installment plan.
      </p>

      <div style="background-color: #f7f9f7; border: 1px solid #e2e8e5; border-radius: 10px; padding: 18px; margin: 20px 0;">
        <p style="margin: 0 0 10px 0; font-weight: bold; color: #182a20; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Financial Status Breakdown</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #333;">
          <tr>
            <td style="padding: 6px 0; color: #666;">Total Agreed Contract Price:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: bold;">₦${totalContractPrice.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #666;">Total Settled to Date:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: bold; color: #008b45;">₦${amountPaid.toLocaleString()} (${percentSettled}% settled)</td>
          </tr>
          <tr style="border-top: 1px solid #e2e8e5;">
            <td style="padding: 8px 0 0 0; font-weight: bold; color: #92400e;">Outstanding Balance Due:</td>
            <td style="padding: 8px 0 0 0; text-align: right; font-weight: bold; color: #92400e; font-size: 16px;">₦${balanceDue.toLocaleString()}</td>
          </tr>
        </table>
      </div>

      <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px 18px; margin: 20px 0;">
        <p style="color: #92400e; font-size: 13px; line-height: 1.5; margin: 0;">
          <strong>Condition Precedent Notice:</strong> In accordance with your Contract of Sale, your official 6-page Deed of Assignment (prepared by Chief Wakeel Olawale Liady of The Bridge Chambers, complete with official Chambers crest and NBA Practicing Seal SCN053202) is secured and will be automatically unlocked immediately upon 100% full liquidation.
        </p>
      </div>

      <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px 18px; margin: 20px 0; font-size: 13px; color: #166534;">
        <p style="margin: 0 0 6px 0; font-weight: bold;">Official Payment Account:</p>
        <p style="margin: 0 0 3px 0;">Bank: <strong>Moniepoint Microfinance Bank</strong></p>
        <p style="margin: 0 0 3px 0;">Account Number: <strong>9133485636</strong></p>
        <p style="margin: 0;">Account Name: <strong>GETLANDS</strong></p>
      </div>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${holdingLink}" style="background-color: #008b45; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; display: inline-block;">
          View Holding &amp; Payment Details
        </a>
      </div>

      <p style="color: #666; font-size: 14px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px;">
        If you have already made this payment or have any questions, please contact your account manager.<br><br>
        <strong>The Getlands Team</strong>
      </p>
    </div>
  `;

  await sendResendEmail(email, `Land Installment Milestone Reminder: ${opportunityName}`, html);
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
    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #008b45; padding: 24px 20px; text-align: center; color: white;">
        <h2 style="margin: 0; font-size: 24px;">Wallet Credited!</h2>
      </div>
      <div style="padding: 24px;">
        <p>Hello ${userName},</p>
        <p>Your Getlands Wallet has just been credited with <strong>₦${amount.toLocaleString()}</strong> for your <strong>${title}</strong> return.</p>

        <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 18px 20px; margin: 20px 0;">
          <h3 style="color: #92400e; font-size: 15px; margin: 0 0 8px 0; font-weight: bold;">How to Receive This Money in Your Bank Account</h3>
          <p style="color: #78350f; font-size: 14px; line-height: 1.55; margin: 0 0 14px 0;">
            Please note that funds credited to your Getlands Wallet remain in your wallet until you initiate a withdrawal. <strong>To receive this money in your bank account, you must log in to your dashboard, go to your Wallet, and submit a withdrawal request.</strong> Payouts to your bank account are processed within <strong>24 to 48 hours</strong> after your withdrawal request is made.
          </p>
          <div style="text-align: center;">
            <a href="https://getlands.ng/dashboard/wallet?withdraw=true" style="background-color: #182a20; color: white; padding: 11px 22px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 13px; display: inline-block;">
              Request Bank Withdrawal Now
            </a>
          </div>
        </div>

        <div style="background-color: #f7f9f7; border: 1px solid #e2e8e5; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #182a20; font-size: 16px; margin: 0 0 10px 0; font-weight: bold;">Or put this return back to work:</h3>
          <p style="color: #4a554f; font-size: 14px; line-height: 1.5; margin: 0 0 14px 0;">
            Instead of withdrawing, you can also reinvest directly from your wallet in 1 click:
          </p>
          <ul style="color: #333; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0; padding-left: 20px;">
            <li><strong>Food Commodities:</strong> Roll your profit into our next fast-moving Garri, Pepper, or Tomato cycle from ₦50,000.</li>
            <li><strong>Abeokuta Land Banking:</strong> Graduate into land banking in Ilewo Orile, Abeokuta (10 mins from Alamala Barracks) for <strong>40% return in 12 months</strong> with a registered Deed of Assignment and <strong>post-dated cheques</strong> issued to you upfront.</li>
          </ul>
          <div style="text-align: center; margin-top: 16px;">
            <a href="https://getlands.ng/dashboard/marketplace" style="background-color: #008b45; color: white; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px; display: inline-block;">
              Re-invest in 1 Click
            </a>
          </div>
        </div>

        <div style="text-align: center; margin: 15px 0;">
          <a href="https://getlands.ng/dashboard/wallet?withdraw=true" style="color: #008b45; font-size: 13px; font-weight: bold; text-decoration: underline;">Open your Wallet to withdraw to your bank account</a>
        </div>
        <p style="font-size: 12px; color: #666; margin-top: 30px; border-top: 1px solid #eee; padding-top: 16px;">If you have any questions, simply reply to this email or contact support.</p>
      </div>
    </div>
  `;
  await sendResendEmail(to, "Your Getlands Wallet has been credited (Action Required to Withdraw)", html);
}

export async function sendWithdrawalRequestedEmail(
  to: string,
  userName: string,
  amount: number,
  netAmount: number,
  fee: number,
  reference: string,
  bankName?: string,
  accountNumber?: string
) {
  const bankLine = bankName && accountNumber ? `${bankName} (${accountNumber})` : 'Your verified bank account on file';
  const html = `
    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #182a20; padding: 24px 20px; text-align: center; color: white; border-bottom: 3px solid #008b45;">
        <h2 style="margin: 0; font-size: 22px;">Withdrawal Request Received</h2>
      </div>
      <div style="padding: 24px;">
        <p>Hello ${userName},</p>
        <p>We have received your request to withdraw <strong>₦${amount.toLocaleString()}</strong> from your Getlands Wallet to your bank account.</p>

        <div style="background-color: #f7f9f7; border: 1px solid #e2e8e5; border-radius: 12px; padding: 18px 20px; margin: 20px 0; font-size: 14px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #68736d;">Reference:</span>
            <strong style="font-family: monospace;">${reference}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #68736d;">Requested Amount:</span>
            <strong>₦${amount.toLocaleString()}</strong>
          </div>
          ${fee > 0 ? `
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #68736d;">Settlement Fee:</span>
            <span style="color: #c53030;">-₦${fee.toLocaleString()}</span>
          </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #68736d;">Destination Bank:</span>
            <strong>${bankLine}</strong>
          </div>
          <div style="border-top: 1px solid #e0e0e0; padding-top: 10px; margin-top: 8px; display: flex; justify-content: space-between;">
            <strong style="color: #182a20;">Net Payout to Bank:</strong>
            <strong style="color: #008b45; font-size: 16px;">₦${netAmount.toLocaleString()}</strong>
          </div>
        </div>

        <div style="background-color: #eef3ef; border-left: 4px solid #008b45; padding: 14px 16px; border-radius: 6px; margin: 20px 0;">
          <strong style="color: #182a20; font-size: 14px; display: block; margin-bottom: 4px;">Payout Timeline (24 to 48 Hours)</strong>
          <p style="color: #333; font-size: 13px; line-height: 1.5; margin: 0;">
            Your withdrawal request is now queued with our finance team. Payouts are processed and transferred to your bank account within <strong>24 to 48 hours</strong> after a withdrawal request is made. You will receive an email confirmation as soon as the transfer is completed.
          </p>
        </div>

        <div style="text-align: center; margin: 24px 0;">
          <a href="https://getlands.ng/dashboard/wallet" style="background-color: #008b45; color: white; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px; display: inline-block;">
            View Wallet Status
          </a>
        </div>
        <p style="font-size: 12px; color: #666; margin-top: 30px; border-top: 1px solid #eee; padding-top: 16px;">Thank you for investing with Getlands.</p>
      </div>
    </div>
  `;
  await sendResendEmail(to, `Withdrawal Request Received (₦${amount.toLocaleString()})`, html);
}

export async function sendWithdrawalRejectedEmail(
  to: string,
  userName: string,
  amount: number,
  reason?: string
) {
  const html = `
    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #182a20; padding: 24px 20px; text-align: center; color: white;">
        <h2 style="margin: 0; font-size: 22px;">Withdrawal Request Returned to Wallet</h2>
      </div>
      <div style="padding: 24px;">
        <p>Hello ${userName},</p>
        <p>Your recent withdrawal request of <strong>₦${amount.toLocaleString()}</strong> could not be completed and the full amount has been refunded back to your Getlands Wallet balance.</p>
        ${reason ? `<p style="background-color: #fef2f2; border: 1px solid #fecaca; color: #991b1b; padding: 12px 16px; border-radius: 8px; font-size: 14px;"><strong>Note from Finance Team:</strong> ${reason}</p>` : ''}
        <p style="font-size: 14px; line-height: 1.5;">Please verify that your bank account details in Settings are accurate, or contact support if you need assistance before submitting a new withdrawal request.</p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="https://getlands.ng/dashboard/wallet" style="background-color: #008b45; color: white; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px; display: inline-block;">
            Open Your Wallet
          </a>
        </div>
      </div>
    </div>
  `;
  await sendResendEmail(to, "Update on Your Getlands Withdrawal Request", html);
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
  const bankDetailsText = bankName && accountNumber ? ` (${bankName}, Account: ${accountNumber})` : '';
  const html = `
    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #008b45; padding: 24px 20px; text-align: center; color: white;">
        <h2 style="margin: 0; font-size: 24px;">Payout Sent to Your Bank</h2>
      </div>
      <div style="padding: 24px;">
        <p>Hello ${userName},</p>
        <p>Your return of <strong>₦${amount.toLocaleString()}</strong> for <strong>${title}</strong> has been transferred directly to your bank account${bankDetailsText}.</p>
        <p>Depending on your bank's network, your credit alert will reflect shortly.</p>

        <div style="background-color: #f7f9f7; border: 1px solid #e2e8e5; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <h3 style="color: #182a20; font-size: 16px; margin: 0 0 10px 0; font-weight: bold;">Ready for your next cycle?</h3>
          <p style="color: #4a554f; font-size: 14px; line-height: 1.5; margin: 0 0 14px 0;">
            Want to keep your money working for you? Here is what is open right now:
          </p>
          <ul style="color: #333; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0; padding-left: 20px;">
            <li><strong>Food Commodities:</strong> Start a new Garri cycle from ₦50,000 or Pepper, Onions, and Tomatoes from ₦100,000 (5% monthly, 12% every 2 months, or 20% every 3 months).</li>
            <li><strong>Abeokuta Land Banking:</strong> Earn <strong>20% in 6 months</strong> or <strong>40% in 12 months</strong> in Ilewo Orile, Abeokuta (10 mins from Alamala Barracks) with a Deed of Assignment, receipt, and post-dated cheques.</li>
          </ul>
          <div style="text-align: center; margin-top: 16px;">
            <a href="https://getlands.ng/dashboard/marketplace" style="background-color: #008b45; color: white; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px; display: inline-block;">
              Browse Open Opportunities
            </a>
          </div>
        </div>

        <div style="text-align: center; margin: 20px 0;">
          <a href="https://getlands.ng/dashboard/holdings" style="color: #008b45; font-size: 13px; font-weight: bold; text-decoration: underline;">View Your Portfolio</a>
        </div>
        <p style="font-size: 12px; color: #666; margin-top: 30px; border-top: 1px solid #eee; padding-top: 16px;">Thank you for growing your wealth with Getlands.</p>
      </div>
    </div>
  `;
  await sendResendEmail(to, "Your Getlands Payout Has Been Sent to Your Bank", html);
}

export async function sendCommissionEarnedEmail(
  to: string,
  agentName: string,
  amount: number,
  tierLevel: number,
  clientName: string,
  opportunityTitle?: string
) {
  const dealText = opportunityTitle ? ` in <strong>${opportunityTitle}</strong>` : '';
  const tierLabel = tierLevel === 2 ? 'Tier 2 Sub-Agent Referral Commission' : 'Direct Sales Commission';
  const html = `
    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #182a20; padding: 24px 20px; text-align: center; color: white; border-bottom: 3px solid #008b45;">
        <h2 style="margin: 0; font-size: 22px;">New Sales Commission Earned!</h2>
      </div>
      <div style="padding: 24px;">
        <p>Hello ${agentName},</p>
        <p>Well done! You just earned a <strong>₦${amount.toLocaleString()}</strong> ${tierLabel} from <strong>${clientName}</strong>'s investment${dealText}.</p>
        <p>Your commission is currently recorded in your Commission Ledger and will be paid out to you once verified.</p>
        <div style="text-align: center; margin: 28px 0;">
          <a href="https://getlands.ng/agent/earnings" style="background-color: #008b45; color: white; padding: 12px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px; display: inline-block;">
            View Commission Ledger
          </a>
        </div>
        <p style="font-size: 12px; color: #666; margin-top: 30px; border-top: 1px solid #eee; padding-top: 16px;">Keep sharing your referral link on your WhatsApp status to close more deals this week.</p>
      </div>
    </div>
  `;
  await sendResendEmail(to, `You earned a ₦${amount.toLocaleString()} commission on Getlands`, html);
}

export async function sendCommissionPaidEmail(
  to: string,
  agentName: string,
  amount: number,
  method: 'wallet' | 'bank',
  details?: {
    clientName?: string;
    opportunityTitle?: string;
    holdingRef?: string;
    bankName?: string;
    accountNumber?: string;
  }
) {
  const clientInfo = details?.clientName
    ? ` for referring <strong>${details.clientName}</strong>${details.opportunityTitle ? ` (${details.opportunityTitle})` : ''}`
    : details?.opportunityTitle
      ? ` for <strong>${details.opportunityTitle}</strong>`
      : '';

  const bankInfo = details?.bankName && details?.accountNumber
    ? ` (${details.bankName}, Account: ${details.accountNumber})`
    : '';

  const destinationParagraph = method === 'bank'
    ? `<p>Your sales commission of <strong>₦${amount.toLocaleString()}</strong>${clientInfo} has been transferred directly to your bank account${bankInfo}.</p>
       <p>Depending on your bank's network, your credit alert will reflect shortly.</p>`
    : `<p>Your sales commission of <strong>₦${amount.toLocaleString()}</strong>${clientInfo} has been approved and credited to your Getlands Wallet.</p>
       <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 14px 16px; margin: 16px 0;">
         <strong style="color: #92400e; font-size: 14px; display: block; margin-bottom: 4px;">How to Receive This Money in Your Bank Account:</strong>
         <p style="color: #78350f; font-size: 13px; line-height: 1.5; margin: 0;">
           To get this commission paid into your personal bank account, log in to your dashboard, open your <strong>Wallet</strong>, and submit a withdrawal request. Bank payouts are processed within <strong>24 to 48 hours</strong> after your withdrawal request is submitted. You can also use your wallet balance to start your own commodity or land banking cycle.
         </p>
       </div>`;

  const subject = method === 'bank'
    ? `Your ₦${amount.toLocaleString()} Sales Commission Has Been Sent to Your Bank`
    : `Your ₦${amount.toLocaleString()} Sales Commission Has Been Paid`;

  const html = `
    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #008b45; padding: 24px 20px; text-align: center; color: white;">
        <h2 style="margin: 0; font-size: 24px;">Sales Commission Paid!</h2>
      </div>
      <div style="padding: 24px;">
        <p>Hello ${agentName},</p>
        ${destinationParagraph}
        <div style="background-color: #f7f9f7; border: 1px solid #e2e8e5; border-radius: 12px; padding: 18px 20px; margin: 24px 0;">
          <div style="font-size: 13px; color: #68736d; margin-bottom: 6px;">Commission Summary</div>
          <div style="font-size: 20px; font-weight: bold; color: #008b45; margin-bottom: 6px;">₦${amount.toLocaleString()}</div>
          <div style="font-size: 13px; color: #333;">
            Payment Method: <strong>${method === 'bank' ? 'Direct Bank Transfer' : 'Getlands Wallet Credit'}</strong>
            ${details?.holdingRef ? `<br/>Deal Reference: <strong>${details.holdingRef}</strong>` : ''}
          </div>
        </div>
        <div style="text-align: center; margin: 28px 0;">
          <a href="https://getlands.ng/agent/earnings" style="background-color: #008b45; color: white; padding: 12px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px; display: inline-block;">
            View Earnings & Ledger
          </a>
        </div>
        <p style="font-size: 13px; color: #4a554f; line-height: 1.5;">
          Want to earn more commissions this month? Copy our ready-to-use WhatsApp status scripts from your Agent Portal and share them with your contacts today.
        </p>
        <p style="font-size: 12px; color: #666; margin-top: 30px; border-top: 1px solid #eee; padding-top: 16px;">Thank you for partnering with Getlands.</p>
      </div>
    </div>
  `;

  await sendResendEmail(to, subject, html);
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

export async function sendWalletWithdrawalReminderEmail(
  to: string,
  userName: string,
  walletBalance: number
) {
  const html = `
    <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #182a20; padding: 24px 20px; text-align: center; color: white; border-bottom: 3px solid #008b45;">
        <h2 style="margin: 0; font-size: 22px;">You Have Funds Available in Your Getlands Wallet</h2>
      </div>
      <div style="padding: 28px 24px;">
        <p>Hello ${userName},</p>
        <p>This is a friendly reminder that you currently have <strong>₦${walletBalance.toLocaleString()}</strong> available in your Getlands Wallet from your investment returns or commissions.</p>

        <div style="background-color: #f7f9f7; border: 1px solid #e2e8e5; border-radius: 12px; padding: 18px 20px; margin: 22px 0; text-align: center;">
          <div style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; color: #68736d; margin-bottom: 6px;">Available Wallet Balance</div>
          <div style="font-size: 28px; font-weight: 800; color: #008b45;">₦${walletBalance.toLocaleString()}</div>
        </div>

        <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 18px 20px; margin: 22px 0;">
          <strong style="color: #92400e; font-size: 15px; display: block; margin-bottom: 6px;">How to Receive This Money in Your Bank Account:</strong>
          <p style="color: #78350f; font-size: 14px; line-height: 1.55; margin: 0;">
            Funds credited to your Getlands Wallet stay in your wallet until you request a withdrawal (or reinvest them). <strong>To get your money paid into your bank account, please log in to your Getlands dashboard, go to your Wallet, and click "Withdraw to Bank" to submit a withdrawal request.</strong>
          </p>
          <p style="color: #78350f; font-size: 13px; line-height: 1.5; margin: 10px 0 0 0;">
            <strong>Payout Schedule:</strong> Bank payouts are processed and transferred within <strong>24 to 48 hours</strong> after your withdrawal request is submitted.
          </p>
        </div>

        <div style="text-align: center; margin: 28px 0;">
          <a href="https://getlands.ng/dashboard/wallet?withdraw=true" style="background-color: #008b45; color: white; padding: 14px 28px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 15px; display: inline-block;">
            Log In &amp; Withdraw to Bank &rarr;
          </a>
        </div>

        <p style="font-size: 13px; color: #4a554f; text-align: center;">
          Want to compound your returns instead? You can also use your wallet balance to reinvest in our active Food Commodity cycles (from ₦50,000) or Abeokuta Land Banking (up to 40% return) in 1 click.
        </p>

        <p style="font-size: 12px; color: #666; margin-top: 30px; border-top: 1px solid #eee; padding-top: 16px;">
          If you have any questions or need help logging in, simply reply to this email.<br><br>
          <strong>The Getlands Team</strong>
        </p>
      </div>
    </div>
  `;

  await sendResendEmail(
    to,
    `You have ₦${walletBalance.toLocaleString()} in your Getlands Wallet (How to Withdraw to Your Bank)`,
    html
  );
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
