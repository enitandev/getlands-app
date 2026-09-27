"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function sendMessageAction(conversationId: string, text: string) {
  const session = await getSession();
  if (!session?.userId) return { error: "Unauthorized" };

  try {
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: session.userId as string,
        text
      }
    });

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { customer: true, agent: true }
    });

    if (conversation) {
      // If sender is customer, notify agent/admin
      if (session.userId === conversation.customerId) {
        // If an agent is assigned, notify them specifically, otherwise notify general admins
        await prisma.notification.create({
          data: {
            userId: conversation.agentId || null,
            title: `New Message from ${conversation.customer.firstName}`,
            message: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
            type: 'SYSTEM',
            linkUrl: '/admin/messages'
          }
        });
      } 
      // If sender is agent/admin, notify customer
      else {
        await prisma.notification.create({
          data: {
            userId: conversation.customerId,
            title: `New Message from Support`,
            message: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
            type: 'SYSTEM',
            linkUrl: '/dashboard/messages'
          }
        });
      }
    }
    
    return { success: true, message };
  } catch (error: any) {
    console.error("Send message error:", error);
    return { error: "Failed to send message" };
  }
}

export async function startConversationAction() {
  const session = await getSession();
  if (!session?.userId) return { error: "Unauthorized" };

  try {
    let conv = await prisma.conversation.findUnique({
      where: { customerId: session.userId as string }
    });

    if (!conv) {
      conv = await prisma.conversation.create({
        data: {
          customerId: session.userId as string
        }
      });
    }
    
    return { success: true, conversation: conv };
  } catch (error: any) {
    return { error: "Failed to start conversation" };
  }
}

export async function assignAgentAction(conversationId: string, agentId: string) {
  const session = await getSession();
  if (!session?.userId) return { error: "Unauthorized" };
  
  const admin = await prisma.user.findUnique({ where: { id: session.userId as string } });
  if (admin?.role === 'customer') return { error: "Unauthorized" };

  try {
    const conv = await prisma.conversation.update({
      where: { id: conversationId },
      data: { agentId }
    });
    
    revalidatePath("/admin/messages");
    return { success: true, conversation: conv };
  } catch (error: any) {
    return { error: "Failed to assign agent" };
  }
}

import { unstable_noStore as noStore } from 'next/cache';

export async function getUnreadMessageCount() {
  noStore();
  const session = await getSession();
  if (!session?.userId) return 0;

  try {
    const user = await prisma.user.findUnique({ where: { id: session.userId as string } });
    if (!user) return 0;

    if (user.role === 'admin') {
      // Admins: count unread messages in all conversations where sender is a customer
      const count = await prisma.message.count({
        where: {
          read: false,
          sender: { role: 'customer' }
        }
      });
      return count;
    } else {
      // Customers: count unread messages in their conversation sent by admin
      const conv = await prisma.conversation.findUnique({ where: { customerId: user.id } });
      if (!conv) return 0;
      
      const count = await prisma.message.count({
        where: {
          conversationId: conv.id,
          read: false,
          senderId: { not: user.id }
        }
      });
      return count;
    }
  } catch (error) {
    return 0;
  }
}

export async function markMessagesAsRead(conversationId: string) {
  const session = await getSession();
  if (!session?.userId) return { success: false };

  try {
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: session.userId as string },
        read: false
      },
      data: { read: true }
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
