const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  await prisma.opportunity.update({
    where: { slug: 'pepper-cycle-ogun' },
    data: {
      duration: '4 months',
      projectedReturn: '25%'
    }
  })
  
  await prisma.opportunity.update({
    where: { slug: 'tomato-cycle-kaduna' },
    data: {
      duration: '5 months',
      projectedReturn: '30%'
    }
  })

  await prisma.opportunity.update({
    where: { slug: 'cassava-cycle-ogun' },
    data: {
      duration: '6 months',
      projectedReturn: '35%'
    }
  })

  await prisma.opportunity.update({
    where: { slug: 'abeokuta-land-banking' },
    data: {
      duration: '12 months',
      location: 'Abeokuta, Ogun State'
    }
  })

  console.log('Database updated successfully!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
