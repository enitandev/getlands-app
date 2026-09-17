const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const opps = await prisma.opportunity.findMany()
  console.log(opps.map(o => o.title))
}

main()
