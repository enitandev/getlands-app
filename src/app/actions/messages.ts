"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath, unstable_noStore as noStore } from "next/cache";

/**
 * Send a message within an existing conversation and notify the recipient.
 */
export async function sendMessageAction(conversationId: string, text: string) {
  const session = await getSession();
  if (!session?.userId) return { error: "Unauthorized" };
  const trimmed = (text || "").trim();
  if (!trimmed) return { error: "Message cannot be empty" };

  try {
    const senderId = session.userId as string;

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        customer: { select: { id: true, firstName: true, lastName: true, role: true } },
        agent: { select: { id: true, firstName: true, lastName: true, role: true } }
      }
    });

    if (!conversation) return { error: "Conversation not found" };

    // Security check: only conversation customer, agent, or admin can send messages
    const sender = await prisma.user.findUnique({
      where: { id: senderId },
      select: { id: true, firstName: true, lastName: true, role: true }
    });

    if (!sender) return { error: "User not found" };

    const isCustomer = conversation.customerId === senderId;
    const isAgent = conversation.agentId === senderId;
    const isAdmin = sender.role === "admin";

    if (!isCustomer && !isAgent && !isAdmin) {
      return { error: "You are not a participant in this conversation" };
    }

    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId,
        text: trimmed,
        read: false
      }
    });

    // Touch conversation updatedAt so active conversations surface first
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });

    // Generate notifications with intelligent routing
    const preview = trimmed.length > 60 ? trimmed.substring(0, 60) + "..." : trimmed;

    if (conversation.type === "agent_client") {
      if (isCustomer) {
        // Customer sent message to Sales Agent
        if (conversation.agentId) {
          await prisma.notification.create({
            data: {
              userId: conversation.agentId,
              title: `New message from ${conversation.customer.firstName} ${conversation.customer.lastName}`,
              message: preview,
              type: "MESSAGE",
              linkUrl: `/agent/messages?convId=${conversation.id}`
            }
          });
        }
      } else {
        // Sales Agent (or Admin on their behalf) sent message to Customer
        await prisma.notification.create({
          data: {
            userId: conversation.customerId,
            title: `Message from ${sender.firstName} ${sender.lastName} (Property Advisor)`,
            message: preview,
            type: "MESSAGE",
            linkUrl: `/dashboard/messages?convId=${conversation.id}`
          }
        });
      }
    } else {
      // Support Conversation
      if (isCustomer) {
        // User/Agent wrote to Support Desk
        if (conversation.agentId) {
          await prisma.notification.create({
            data: {
              userId: conversation.agentId,
              title: `Support query from ${conversation.customer.firstName} ${conversation.customer.lastName}`,
              message: preview,
              type: "MESSAGE",
              linkUrl: `/admin/messages?convId=${conversation.id}`
            }
          });
        } else {
          // If no specific agent is assigned, notify all administrators directly
          const admins = await prisma.user.findMany({
            where: { role: 'admin' },
            select: { id: true }
          });
          for (const adm of admins) {
            await prisma.notification.create({
              data: {
                userId: adm.id,
                title: `Support query from ${conversation.customer.firstName} ${conversation.customer.lastName}`,
                message: preview,
                type: "MESSAGE",
                linkUrl: `/admin/messages?convId=${conversation.id}`
              }
            });
          }
        }
      } else {
        // Admin or Support desk wrote back to customer
        await prisma.notification.create({
          data: {
            userId: conversation.customerId,
            title: `New message from Getlands Support`,
            message: preview,
            type: "MESSAGE",
            linkUrl: `/dashboard/messages?convId=${conversation.id}`
          }
        });
      }
    }

    revalidatePath("/dashboard/messages");
    revalidatePath("/agent/messages");
    revalidatePath("/admin/messages");

    return { success: true, message };
  } catch (error: any) {
    console.error("Send message error:", error);
    return { error: "Failed to send message" };
  }
}

/**
 * Get or create a conversation thread for the logged-in user.
 * Supports both 'support' (Getlands Helpdesk) and 'agent_client' (Client <-> Sales Agent).
 */
export async function getOrCreateConversation(type: "support" | "agent_client" = "support", targetUserId?: string) {
  const session = await getSession();
  if (!session?.userId) return { error: "Unauthorized" };

  try {
    const currentUserId = session.userId as string;
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { id: true, role: true, referredById: true }
    });

    if (!currentUser) return { error: "User not found" };

    if (type === "support") {
      let conv = await prisma.conversation.findFirst({
        where: {
          customerId: currentUserId,
          type: "support"
        },
        include: {
          agent: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } }
        }
      });

      if (!conv) {
        conv = await prisma.conversation.create({
          data: {
            customerId: currentUserId,
            type: "support",
            status: "open"
          },
          include: {
            agent: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } }
          }
        });
      }

      return { success: true, conversation: conv };
    }

    if (type === "agent_client") {
      // If the caller is an agent reaching out to their client (or targetUserId is specified)
      if (targetUserId) {
        // Verify client exists
        const client = await prisma.user.findUnique({
          where: { id: targetUserId },
          select: { id: true, firstName: true, lastName: true, referredById: true }
        });

        if (!client) return { error: "Client not found" };

        let conv = await prisma.conversation.findFirst({
          where: {
            customerId: targetUserId,
            agentId: currentUserId,
            type: "agent_client"
          },
          include: {
            customer: { select: { id: true, firstName: true, lastName: true, email: true, phoneNumber: true, avatarUrl: true } },
            agent: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } }
          }
        });

        if (!conv) {
          conv = await prisma.conversation.create({
            data: {
              customerId: targetUserId,
              agentId: currentUserId,
              type: "agent_client",
              status: "open"
            },
            include: {
              customer: { select: { id: true, firstName: true, lastName: true, email: true, phoneNumber: true, avatarUrl: true } },
              agent: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } }
            }
          });
        }

        return { success: true, conversation: conv };
      }

      // If the caller is a customer reaching out to their assigned agent
      if (!currentUser.referredById) {
        return { error: "You do not have an assigned property advisor yet." };
      }

      let conv = await prisma.conversation.findFirst({
        where: {
          customerId: currentUserId,
          agentId: currentUser.referredById,
          type: "agent_client"
        },
        include: {
          agent: { select: { id: true, firstName: true, lastName: true, phoneNumber: true, email: true, avatarUrl: true } }
        }
      });

      if (!conv) {
        conv = await prisma.conversation.create({
          data: {
            customerId: currentUserId,
            agentId: currentUser.referredById,
            type: "agent_client",
            status: "open"
          },
          include: {
            agent: { select: { id: true, firstName: true, lastName: true, phoneNumber: true, email: true, avatarUrl: true } }
          }
        });
      }

      return { success: true, conversation: conv };
    }

    return { error: "Invalid conversation type" };
  } catch (error: any) {
    console.error("getOrCreateConversation error:", error);
    return { error: "Failed to load conversation" };
  }
}

/**
 * Legacy start conversation action maintained for backward compatibility.
 */
export async function startConversationAction() {
  return await getOrCreateConversation("support");
}

/**
 * Assign a specific agent or support rep to a conversation.
 */
export async function assignAgentAction(conversationId: string, agentId: string) {
  const session = await getSession();
  if (!session?.userId) return { error: "Unauthorized" };

  const admin = await prisma.user.findUnique({ where: { id: session.userId as string } });
  if (admin?.role === "customer") return { error: "Unauthorized" };

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

/**
 * Get total unread message count for the current user across all relevant conversations.
 */
export async function getUnreadMessageCount(): Promise<number> {
  noStore();
  const session = await getSession();
  if (!session?.userId) return 0;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId as string },
      select: { id: true, role: true }
    });
    if (!user) return 0;

    if (user.role === "admin") {
      // Admins: count unread messages in all support conversations or customer sent messages
      const count = await prisma.message.count({
        where: {
          read: false,
          senderId: { not: user.id }
        }
      });
      return count;
    }

    if (user.role === "sales") {
      // Sales Agents:
      // 1. Unread from clients where agentId = user.id
      // 2. Unread from support desk where customerId = user.id (their support thread)
      const count = await prisma.message.count({
        where: {
          read: false,
          senderId: { not: user.id },
          conversation: {
            OR: [
              { agentId: user.id },
              { customerId: user.id }
            ]
          }
        }
      });
      return count;
    }

    // Regular Customers: count unread messages in conversations where customerId = user.id
    const count = await prisma.message.count({
      where: {
        read: false,
        senderId: { not: user.id },
        conversation: {
          customerId: user.id
        }
      }
    });
    return count;
  } catch (error) {
    console.error("getUnreadMessageCount error:", error);
    return 0;
  }
}

/**
 * Mark all messages in a conversation as read by the current user.
 */
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

/**
 * Retrieve all conversation threads for an agent:
 * - Direct client threads (all registered clients who they referred)
 * - Getlands Support / Brokerage Desk thread
 * Also returns all referred clients so they can start a chat anytime.
 */
export async function getAgentMessagingData() {
  noStore();
  const session = await getSession();
  if (!session?.userId) return null;

  try {
    const agentId = session.userId as string;

    // 1. Fetch conversations where agent is agentId OR agent is customer (support desk)
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { agentId: agentId },
          { customerId: agentId, type: "support" }
        ]
      },
      include: {
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            avatarUrl: true,
            createdAt: true,
            holdings: { select: { units: true } }
          }
        },
        agent: {
          select: { id: true, firstName: true, lastName: true, avatarUrl: true }
        },
        messages: {
          orderBy: { createdAt: "asc" }
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    // 2. Fetch all registered clients referred by this agent
    const referredClients = await prisma.user.findMany({
      where: { referredById: agentId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        avatarUrl: true,
        createdAt: true,
        holdings: { select: { units: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    return {
      conversations,
      referredClients
    };
  } catch (error) {
    console.error("getAgentMessagingData error:", error);
    return null;
  }
}
