import { checkAdmin } from "@/app/actions/admin";
import { prisma } from "@/lib/prisma";
import ClientAdminNotifications from "./ClientAdminNotifications";

export default async function AdminNotificationsPage() {
  await checkAdmin();

  const users = await prisma.user.findMany({
    where: { role: 'customer' },
    select: { id: true, firstName: true, lastName: true, email: true },
    orderBy: { createdAt: 'desc' }
  });

  return <ClientAdminNotifications users={users} />;
}
