import re

with open('src/app/actions/admin-customers.ts', 'r') as f:
    content = f.read()

old_logic = """  const user = await prisma.user.findUnique({ where: { id: userId } });
  const opportunity = await prisma.opportunity.findUnique({ where: { id: opportunityId } });

  if (!user || !opportunity) return { error: 'User or Opportunity not found' };

  // Generate unique reference
  const reference = `REF-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  // 1. Create Transaction
  const transaction = await prisma.transaction.create({
    data: {
      userId,
      type: 'investment',
      amount: amountPaid,
      status: 'success',
      reference,
      date: dateAcquired
    }
  });

  // 2. Create Holding
  const holding = await prisma.holding.create({
    data: {
      userId,
      opportunityId,
      totalAmount: amountPaid,
      units,
      dateAcquired,
      status: 'active'
    }
  });"""

new_logic = """  const user = await prisma.user.findUnique({ where: { id: userId } });
  const opportunity = await prisma.opportunity.findUnique({ 
    where: { id: opportunityId },
    include: { cohorts: { where: { status: 'OPEN' }, take: 1 } }
  });

  if (!user || !opportunity) return { error: 'User or Opportunity not found' };

  const activeCohort = opportunity.cohorts.length > 0 ? opportunity.cohorts[0] : null;

  // Generate unique reference
  const reference = `REF-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

  // 1. Create Transaction
  const transaction = await prisma.transaction.create({
    data: {
      userId,
      type: 'investment',
      amount: amountPaid,
      status: 'success',
      reference,
      date: dateAcquired
    }
  });

  // 2. Create Holding
  const holding = await prisma.holding.create({
    data: {
      userId,
      opportunityId,
      cohortId: activeCohort ? activeCohort.id : undefined,
      totalAmount: amountPaid,
      units,
      dateAcquired,
      status: 'active'
    }
  });

  // 3. Update Cohort funding progress if it exists
  if (activeCohort) {
    await prisma.cohort.update({
      where: { id: activeCohort.id },
      data: {
        committedAmount: { increment: amountPaid },
        fundedUnits: { increment: units },
        availableAmount: { decrement: amountPaid },
        availableUnits: { decrement: units }
      }
    });
  }"""

content = content.replace(old_logic, new_logic)

with open('src/app/actions/admin-customers.ts', 'w') as f:
    f.write(content)
