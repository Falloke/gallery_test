import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// @ts-ignore
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.image.deleteMany();

  const tags = ['nature', 'city', 'tech', 'animal', 'abstract'];

  for (let i = 1; i <= 50; i++) {
    const width = 400; 
    const height = Math.floor(Math.random() * (700 - 300 + 1)) + 300; 

    const url = `https://placehold.co/${width}x${height}/png`;

    const shuffledTags = tags.sort(() => 0.5 - Math.random());
    const selectedTags = shuffledTags.slice(0, Math.floor(Math.random() * 3) + 1);

    await prisma.image.create({
      data: {
        url: url,
        width: width,
        height: height,
        hashtags: selectedTags,
      }
    });
  }
  
  console.log("Seeding finished!");
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })