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
