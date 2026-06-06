const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'default-tenant' },
    update: {},
    create: {
      id: 'default-tenant',
      name: 'Default Law Firm',
      slug: 'default-tenant',
      config: JSON.stringify({
        screeningCriteria: "Looking for personal injury cases with clear liability and significant damages.",
      }),
    },
  });

  console.log({ tenant });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@verdictflow.com' },
    update: {},
    create: {
      email: 'admin@verdictflow.com',
      passwordHash: 'hashed_password', // In a real app, use bcrypt
      role: 'ADMIN',
      tenantId: tenant.id,
    },
  });

  console.log({ admin });

  const crmConfig = await prisma.cRMConfig.upsert({
    where: { tenantId: tenant.id },
    update: {},
    create: {
      tenantId: tenant.id,
      provider: 'CLIO',
      apiKey: 'mock-clio-api-key',
    },
  });

  console.log({ crmConfig });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
