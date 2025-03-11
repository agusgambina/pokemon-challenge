import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Delete existing users to avoid duplicates
  await prisma.user.deleteMany({});

  const {
    SEED_ADMIN_USERNAME: seedAdminUsernameRaw,
    SEED_ADMIN_PASSWORD: seedAdminPasswordRaw,
  } = process.env;

  // Sanitize environment variables by removing quotes, semicolons and trimming whitespace
  const sanitizeEnvVar = (value: string | undefined) => 
    value?.replace(/['"]/g, '').replace(';', '').trim();

  const seedAdminUsername = sanitizeEnvVar(seedAdminUsernameRaw);
  const seedAdminPassword = sanitizeEnvVar(seedAdminPasswordRaw);

  if (!seedAdminUsername || !seedAdminPassword) {
    throw new Error('SEED_ADMIN_USERNAME or SEED_ADMIN_PASSWORD is not set');
  }

  // Create your default user
  const hashedPassword = await bcrypt.hash(seedAdminPassword, 10);

  const user = await prisma.user.create({
    data: {
      username: seedAdminUsername,
      password: hashedPassword,
    },
  });

  console.log({ user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
