"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function requestWithdrawalAction(formData: FormData) {
  const session = await getSession();
  if (!session?.userId) return { error: "Unauthorized" };

  const amountStr = formData.get("amount") as string;
  const amount = parseFloat(amountStr);

  if (isNaN(amount) || amount <= 0) {
    return { error: "Invalid amount" };
  }

  try {
    // 1. Fetch user to check balance and active bank account
    const user = await prisma.user.findUnique({
      where: { id: session.userId as string },
      include: { bankAccounts: { where: { status: 'active' } } }
    });

    if (!user) return { error: "User not found" };

    if (user.walletBalance < amount) {
      return { error: "Insufficient wallet balance" };
    }

    // Check if they have a bank account to withdraw to
    const activeBank = user.bankAccounts[0];
    if (!activeBank && !user.bankName) {
      return { error: "Please add a verified bank account in Settings first." };
    }

    // 2. Create the withdrawal transaction (status: pending)
    const transaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        type: 'withdrawal',
        amount: amount,
        status: 'pending',
        reference: `WDL-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      }
    });

    // 3. Deduct the amount from wallet balance immediately (locked)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        walletBalance: { decrement: amount }
      }
    });

    // 4. Send an admin notification
    await prisma.notification.create({
      data: {
        userId: null, // Global/Admin notification
        type: 'SYSTEM',
        title: 'New Withdrawal Request',
        message: `${user.firstName} ${user.lastName} requested a withdrawal of ₦${amount.toLocaleString()}.`,
        linkUrl: '/admin/finance'
      }
    });

    revalidatePath("/dashboard/wallet");
    revalidatePath("/admin/finance");

    return { success: true, transaction };
  } catch (error: any) {
    console.error("Withdrawal request error:", error);
    return { error: "Failed to process withdrawal request" };
  }
}
