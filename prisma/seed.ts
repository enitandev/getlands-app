import { PrismaClient } from '@prisma/client'
import { mockOpportunities, mockWallet, mockAnnouncements, mockNotifications, mockHoldings } from '../src/lib/mockData'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Create a dummy admin & customer user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const customerPassword = await bcrypt.hash('customer123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@getlands.com' },
    update: {},
    create: {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@getlands.com',
      role: 'admin',
      walletBalance: 0
    }
  })

  const customer = await prisma.user.upsert({
    where: { email: 'emeka@example.com' },
    update: {},
    create: {
      firstName: 'Emeka',
      lastName: 'Abraham',
      email: 'emeka@example.com',
      role: 'customer',
      walletBalance: mockWallet.balance
    }
  })

  // 2. Insert Announcements
  for (const ann of mockAnnouncements) {
    await prisma.announcement.create({
      data: {
        id: ann.id,
        title: ann.title,
        message: ann.message,
        type: ann.type,
        isActive: ann.isActive
      }
    })
  }

  // 3. Insert Notifications
  for (const notif of mockNotifications) {
    await prisma.notification.create({
      data: {
        id: notif.id,
        userId: customer.id,
        title: notif.title,
        message: notif.message,
        unread: !notif.read,
        createdAt: new Date(new Date().getTime() - Math.random() * 10000000)
      }
    })
  }

  // 4. Insert Opportunities
  for (const opp of mockOpportunities) {
    const data: any = {
      id: opp.id,
      title: opp.title,
      slug: opp.slug,
      category: opp.category,
      location: opp.location,
      state: opp.state || 'Lagos',
      coverImage: opp.cover_image,
      status: opp.status || 'available'
    }

    if (opp.category === 'land') {
      data.price = (opp as any).price
      data.landSize = (opp as any).land_size
      data.documentationStatus = (opp as any).documentation_status
    } else if (opp.category === 'farm') {
      data.slotPrice = (opp as any).slot_price
      data.projectedReturn = (opp as any).projected_return
      data.duration = (opp as any).duration
    } else if (opp.category === 'land_banking') {
      data.acquisitionPrice = (opp as any).acquisition_price
      data.statedExitValue = (opp as any).stated_exit_value
      data.duration = (opp as any).duration
    }

    await prisma.opportunity.upsert({
      where: { slug: opp.slug },
      update: {},
      create: data
    })
  }

  // 5. Insert Holdings (Link customer to opportunities)
  for (const hold of mockHoldings) {
    await prisma.holding.create({
      data: {
        id: hold.id,
        userId: customer.id,
        opportunityId: hold.opportunity_id,
        totalAmount: hold.total_amount,
        status: hold.status
      }
    })
  }

  // 6. Insert Transactions (Wallet History)
  for (const tx of mockWallet.history) {
    await prisma.transaction.create({
      data: {
        id: tx.id,
        userId: customer.id,
        type: tx.type,
        amount: tx.amount,
        status: tx.status,
        reference: tx.ref,
        date: new Date(tx.date)
      }
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
