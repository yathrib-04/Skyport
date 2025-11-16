import prisma from './config/db.js';
import bcrypt from 'bcryptjs';

async function main() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("123456", salt);

  const agent = await prisma.agent.create({
    data: {
      fullName: "Selam Fikru",
      email: "agent@example.com",
      password: hashedPassword,
      role: "agent", 
    },
  });

  console.log('Agent created:', agent);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
