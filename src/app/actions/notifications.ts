"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function markNotificationAsRead(notificationId: string) {
  const session = await getSession();
  if (!session?.userId) return { success: false, error: "Unauthorized" };

  try {
    const notif = await prisma.notification.findUnique({
      where: { id: notificationId }
    });

    if (!notif) {
      return { success: false, error: "Notification not found" };
    }

    // Verify ownership or admin privilege
    if (session.role !== 'admin' && notif.userId !== session.userId && notif.userId !== null) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.notification.update({
      where: { id: notificationId },
      data: { unread: false }
    });
    
    revalidatePath("/dashboard", "layout");
    revalidatePath("/agent", "layout");
    revalidatePath("/admin", "layout");
    return { success: true };
  } catch (error) {
    console.error("markNotificationAsRead error:", error);
    return { success: false, error: "Failed to mark as read" };
  }
}

export async function markAllNotificationsAsRead() {
  const session = await getSession();
  if (!session?.userId) return { success: false, error: "Unauthorized" };

  try {
    if (session.role === 'admin') {
      await prisma.notification.updateMany({
        where: { 
          OR: [
            { userId: session.userId as string },
            { userId: null }
          ],
          unread: true
        },
        data: { unread: false }
      });
    } else {
      await prisma.notification.updateMany({
        where: { 
          userId: session.userId as string,
          unread: true
        },
        data: { unread: false }
      });
    }
    
    revalidatePath("/dashboard", "layout");
    revalidatePath("/agent", "layout");
    revalidatePath("/admin", "layout");
    return { success: true };
  } catch (error) {
    console.error("markAllNotificationsAsRead error:", error);
    return { success: false, error: "Failed to mark all as read" };
  }
}

export async function deleteNotificationAction(notificationId: string) {
  const session = await getSession();
  if (!session?.userId) return { success: false, error: "Unauthorized" };

  try {
    const notif = await prisma.notification.findUnique({
      where: { id: notificationId }
    });

    if (!notif) return { success: false, error: "Notification not found" };

    if (session.role !== 'admin' && notif.userId !== session.userId) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.notification.delete({
      where: { id: notificationId }
    });

    revalidatePath("/dashboard", "layout");
    revalidatePath("/agent", "layout");
    revalidatePath("/admin", "layout");
    return { success: true };
  } catch (error) {
    console.error("deleteNotificationAction error:", error);
    return { success: false, error: "Failed to delete notification" };
  }
}

export async function clearReadNotificationsAction() {
  const session = await getSession();
  if (!session?.userId) return { success: false, error: "Unauthorized" };

  try {
    if (session.role === 'admin') {
      await prisma.notification.deleteMany({
        where: {
          OR: [
            { userId: session.userId as string },
            { userId: null }
          ],
          unread: false
        }
      });
    } else {
      await prisma.notification.deleteMany({
        where: {
          userId: session.userId as string,
          unread: false
        }
      });
    }

    revalidatePath("/dashboard", "layout");
    revalidatePath("/agent", "layout");
    revalidatePath("/admin", "layout");
    return { success: true };
  } catch (error) {
    console.error("clearReadNotificationsAction error:", error);
    return { success: false, error: "Failed to clear notifications" };
  }
}
