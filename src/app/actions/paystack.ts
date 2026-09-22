"use server";

export async function getBanksAction() {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) return { error: 'Paystack configuration missing' };

  try {
    const res = await fetch('https://api.paystack.co/bank?country=nigeria', {
      headers: {
        Authorization: `Bearer ${secretKey}`
      },
      next: { revalidate: 86400 } // cache for 24 hours
    });
    
    if (!res.ok) return { error: 'Failed to fetch banks' };
    const data = await res.json();
    
    if (data.status) {
      return { banks: data.data };
    }
    return { error: data.message };
  } catch (error) {
    return { error: 'Failed to fetch banks due to network error' };
  }
}

export async function verifyBankAccountAction(accountNumber: string, bankCode: string) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) return { error: 'Paystack configuration missing' };
  
  if (!accountNumber || !bankCode) return { error: 'Missing account details' };
  if (accountNumber.length !== 10) return { error: 'Account number must be 10 digits' };

  try {
    const res = await fetch(`https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`, {
      headers: {
        Authorization: `Bearer ${secretKey}`
      }
    });
    
    const data = await res.json();
    
    if (data.status) {
      return { accountName: data.data.account_name };
    } else {
      return { error: data.message || 'Could not resolve account name' };
    }
  } catch (error) {
    return { error: 'Verification service unavailable' };
  }
}
