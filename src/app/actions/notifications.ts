"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function markNotificationAsRead(notificationId: string) {
  const session = await getSession();
  if (!session?.userId) return { success: false, error: "Unauthorized" };

  try {
    await prisma.notification.update({
      where: { 
        id: notificationId,
        userId: session.userId as string
      },
      data: { unread: false }
    });
    
    revalidatePath("/dashboard", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to mark as read" };
  }
}

export async function markAllNotificationsAsRead() {
  const session = await getSession();
  if (!session?.userId) return { success: false, error: "Unauthorized" };

  try {
    await prisma.notification.updateMany({
      where: { 
        userId: session.userId as string,
        unread: true
      },
      data: { unread: false }
    });
    
    revalidatePath("/dashboard", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to mark all as read" };
  }
}
